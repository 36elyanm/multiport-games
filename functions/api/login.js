async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const { username, password } = await request.json();
    if (!username || !password) return Response.json({ error: 'Please fill in all fields.' }, { status: 400, headers });

    const hash = await sha256(password);
    const user = await env.DB.prepare(
      'SELECT username FROM users WHERE username = ?1 COLLATE NOCASE AND password_hash = ?2'
    ).bind(username.trim(), hash).first();

    if (!user) return Response.json({ error: 'Incorrect username or password.' }, { status: 401, headers });
    return Response.json({ success: true, username: user.username }, { headers });
  } catch (e) {
    return Response.json({ error: 'Server error, please try again.' }, { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
