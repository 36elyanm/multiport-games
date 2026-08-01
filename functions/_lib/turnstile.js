// Returns { success, reason } instead of a plain boolean so callers can show
// a distinct message when the secret key itself is missing/wrong (a server
// config problem) vs. an actually-invalid/expired token (a client problem) —
// otherwise both look identical as a generic "verification failed".
// Secret comes from the TURNSTILE_SECRET_KEY Cloudflare Pages env var.
export async function verifyTurnstile(token, secret, ip) {
  if (!secret) return { success: false, reason: 'not-configured' };
  if (!token) return { success: false, reason: 'missing-token' };

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = await res.json();
    if (data.success === true) return { success: true };
    return { success: false, reason: (data['error-codes'] || []).join(',') || 'rejected' };
  } catch {
    return { success: false, reason: 'network-error' };
  }
}
