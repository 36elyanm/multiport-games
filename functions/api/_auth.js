async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const MAX_ATTEMPTS = 2;
const LOCKOUT_MS = 15 * 60 * 1000;

// Server-side admin password check with a per-IP lockout after MAX_ATTEMPTS wrong guesses.
// Password lives in the admin_auth table (hashed) so it can be changed without touching
// Cloudflare Pages env vars; falls back to env.ADMIN_KEY if that table is empty.
export async function checkAdminAuth(request, env, providedKey) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();

  const attemptRow = await env.DB.prepare(
    'SELECT attempts, locked_until FROM admin_login_attempts WHERE ip=?1'
  ).bind(ip).first();

  if (attemptRow && attemptRow.locked_until > now) {
    const mins = Math.ceil((attemptRow.locked_until - now) / 60000);
    return { ok: false, status: 429, error: `Too many attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.` };
  }

  const authRow = await env.DB.prepare('SELECT password_hash FROM admin_auth WHERE id=1').first();
  const expectedHash = authRow ? authRow.password_hash : await sha256(env.ADMIN_KEY || 'multiportgames2025');
  const providedHash = providedKey ? await sha256(providedKey) : '';

  if (providedKey && providedHash === expectedHash) {
    if (attemptRow) await env.DB.prepare('DELETE FROM admin_login_attempts WHERE ip=?1').bind(ip).run();
    return { ok: true };
  }

  const attempts = (attemptRow ? attemptRow.attempts : 0) + 1;
  if (attempts >= MAX_ATTEMPTS) {
    await env.DB.prepare(
      'INSERT INTO admin_login_attempts (ip, attempts, locked_until) VALUES (?1,0,?2) ON CONFLICT(ip) DO UPDATE SET attempts=0, locked_until=?2'
    ).bind(ip, now + LOCKOUT_MS).run();
    return { ok: false, status: 429, error: 'Too many attempts. Locked for 15 minutes.' };
  }
  await env.DB.prepare(
    'INSERT INTO admin_login_attempts (ip, attempts, locked_until) VALUES (?1,?2,0) ON CONFLICT(ip) DO UPDATE SET attempts=?2'
  ).bind(ip, attempts, 0).run();
  const remaining = MAX_ATTEMPTS - attempts;
  return { ok: false, status: 401, error: `Wrong password. ${remaining} attempt${remaining === 1 ? '' : 's'} left before lockout.` };
}

export { sha256 };
