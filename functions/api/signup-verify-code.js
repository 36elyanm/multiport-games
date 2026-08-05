const MAX_ATTEMPTS = 5;

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const { email, code } = await request.json();
    if (!email || !code) return Response.json({ error: 'Missing fields' }, { status: 400, headers });

    const trimmedEmail = email.trim().toLowerCase();
    const row = await env.DB.prepare(
      'SELECT code, username, password_hash, attempts, expires_at FROM signup_codes WHERE email = ?1 COLLATE NOCASE'
    ).bind(trimmedEmail).first();

    if (!row) return Response.json({ error: 'No pending signup found for this email. Please start over.' }, { status: 400, headers });
    if (Date.now() > row.expires_at) {
      await env.DB.prepare('DELETE FROM signup_codes WHERE email = ?1 COLLATE NOCASE').bind(trimmedEmail).run();
      return Response.json({ error: 'Code expired. Please start over.' }, { status: 400, headers });
    }
    if (row.attempts >= MAX_ATTEMPTS) {
      await env.DB.prepare('DELETE FROM signup_codes WHERE email = ?1 COLLATE NOCASE').bind(trimmedEmail).run();
      return Response.json({ error: 'Too many incorrect attempts. Please start over.' }, { status: 429, headers });
    }

    if (code.trim() !== row.code) {
      await env.DB.prepare('UPDATE signup_codes SET attempts = attempts + 1 WHERE email = ?1 COLLATE NOCASE').bind(trimmedEmail).run();
      const remaining = MAX_ATTEMPTS - (row.attempts + 1);
      return Response.json({ error: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} left.` }, { status: 400, headers });
    }

    try {
      await env.DB.prepare(
        'INSERT INTO users (username, email, password_hash, created_at) VALUES (?1, ?2, ?3, ?4)'
      ).bind(row.username, trimmedEmail, row.password_hash, Date.now()).run();
    } catch (e) {
      if (e.message && e.message.includes('UNIQUE')) {
        await env.DB.prepare('DELETE FROM signup_codes WHERE email = ?1 COLLATE NOCASE').bind(trimmedEmail).run();
        return Response.json({ error: 'Username or email already registered.' }, { status: 409, headers });
      }
      throw e;
    }

    await env.DB.prepare('DELETE FROM signup_codes WHERE email = ?1 COLLATE NOCASE').bind(trimmedEmail).run();
    return Response.json({ success: true, username: row.username }, { headers });
  } catch (e) {
    return Response.json({ error: 'Server error, please try again.' }, { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
