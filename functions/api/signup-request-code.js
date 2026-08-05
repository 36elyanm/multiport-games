import { verifyTurnstile } from '../_lib/turnstile.js';
import { sendEmail } from '../_lib/resend.js';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function makeCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const n = new DataView(bytes.buffer).getUint32(0) % 1000000;
  return n.toString().padStart(6, '0');
}

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const { username, email, password, turnstileToken } = await request.json();
    if (!username || !email || !password) return Response.json({ error: 'Missing fields' }, { status: 400, headers });

    const ip = request.headers.get('CF-Connecting-IP');
    const verify = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!verify.success) {
      const msg = verify.reason === 'not-configured'
        ? 'Human verification is not configured on the server. Please contact support.'
        : `Human verification failed (${verify.reason}). Please try again.`;
      return Response.json({ error: msg }, { status: 400, headers });
    }
    if (username.length < 3) return Response.json({ error: 'Username must be at least 3 characters.' }, { status: 400, headers });
    if (password.length < 6) return Response.json({ error: 'Password must be at least 6 characters.' }, { status: 400, headers });
    if (!/\S+@\S+\.\S+/.test(email)) return Response.json({ error: 'Invalid email address.' }, { status: 400, headers });

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await env.DB.prepare(
      'SELECT username FROM users WHERE username = ?1 COLLATE NOCASE OR email = ?2 COLLATE NOCASE'
    ).bind(trimmedUsername, trimmedEmail).first();
    if (existingUser) return Response.json({ error: 'Username or email already registered.' }, { status: 409, headers });

    const code = makeCode();
    const passwordHash = await sha256(password);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await env.DB.prepare(
      `INSERT INTO signup_codes (email, code, username, password_hash, attempts, expires_at) VALUES (?1, ?2, ?3, ?4, 0, ?5)
       ON CONFLICT(email) DO UPDATE SET code=?2, username=?3, password_hash=?4, attempts=0, expires_at=?5`
    ).bind(trimmedEmail, code, trimmedUsername, passwordHash, expiresAt).run();

    const sent = await sendEmail(env.RESEND_API_KEY, {
      to: trimmedEmail,
      subject: `${code} is your Multiport Games verification code`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a2e">
          <div style="text-align:center;font-size:1.2rem;font-weight:800;margin-bottom:24px">Multiport<span style="color:#e94560">Games</span></div>
          <div style="background:#f7f7fa;border-radius:16px;padding:32px 24px;text-align:center">
            <p style="margin:0 0 8px;font-size:.95rem;color:#555">Verify your email to finish creating your account</p>
            <p style="margin:0 0 20px;font-size:.85rem;color:#888">Hi ${trimmedUsername}, enter this code to continue:</p>
            <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#1a1a2e;background:#fff;border-radius:12px;padding:16px 8px;display:inline-block;min-width:220px">${code}</div>
            <p style="margin:20px 0 0;font-size:.8rem;color:#999">This code expires in 10 minutes.</p>
          </div>
          <p style="margin:24px 0 0;font-size:.78rem;color:#999;text-align:center">If you didn't request this, you can safely ignore this email.</p>
        </div>`,
    });
    if (!sent.success) {
      const msg = sent.reason === 'not-configured'
        ? 'Email sending is not configured on the server. Please contact support.'
        : 'Could not send verification email. Please try again.';
      return Response.json({ error: msg }, { status: 500, headers });
    }

    return Response.json({ success: true }, { headers });
  } catch (e) {
    return Response.json({ error: 'Server error, please try again.' }, { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
