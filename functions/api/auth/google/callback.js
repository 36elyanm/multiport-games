function parseCookie(header, name) {
  if (!header) return null;
  const found = header.split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
  return found ? decodeURIComponent(found.slice(name.length + 1)) : null;
}

async function randomHex(len) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function b64urlDecode(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = parseCookie(request.headers.get('Cookie'), 'g_oauth_state');

  const fail = (msg) => Response.redirect(new URL(`/login.html?g_error=${encodeURIComponent(msg)}`, request.url), 302);

  if (!code || !state || !cookieState || state !== cookieState) {
    return fail('Google sign-in failed. Please try again.');
  }

  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail('Google sign-in is not configured.');

  const redirectUri = new URL('/api/auth/google/callback', request.url).toString();

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.id_token) return fail('Google sign-in failed. Please try again.');

    // The id_token arrives over a direct server-to-server TLS call to Google's
    // own token endpoint, so its payload is trusted without re-verifying the
    // JWT signature ourselves.
    const payload = JSON.parse(b64urlDecode(tokenData.id_token.split('.')[1]));
    if (!payload.email || !payload.sub) return fail('Google sign-in failed. Please try again.');
    if (payload.email_verified === false) return fail('Your Google email is not verified.');

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();

    let user = await env.DB.prepare('SELECT username FROM users WHERE google_id = ?1').bind(googleId).first();

    if (!user) {
      const existing = await env.DB.prepare('SELECT username FROM users WHERE email = ?1 COLLATE NOCASE').bind(email).first();
      if (existing) {
        await env.DB.prepare('UPDATE users SET google_id = ?1 WHERE username = ?2 COLLATE NOCASE').bind(googleId, existing.username).run();
        user = existing;
      } else {
        let base = (payload.name || email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || 'player';
        let username = base;
        let n = 0;
        while (await env.DB.prepare('SELECT 1 FROM users WHERE username = ?1 COLLATE NOCASE').bind(username).first()) {
          n++;
          username = `${base}${n}`;
        }
        const placeholderHash = await randomHex(32);
        await env.DB.prepare(
          'INSERT INTO users (username, email, password_hash, google_id, created_at) VALUES (?1, ?2, ?3, ?4, ?5)'
        ).bind(username, email, placeholderHash, googleId, Date.now()).run();
        user = { username };
      }
    }

    const headers = new Headers({
      Location: new URL(`/login.html?g_user=${encodeURIComponent(user.username)}`, request.url).toString()
    });
    headers.append('Set-Cookie', 'g_oauth_state=; Path=/; Max-Age=0');
    return new Response(null, { status: 302, headers });
  } catch (e) {
    return fail('Google sign-in failed. Please try again.');
  }
}
