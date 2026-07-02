async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) return Response.json({ error: 'Missing fields' }, { status: 400, headers });
    if (username.length < 3)  return Response.json({ error: 'Username must be at least 3 characters.' }, { status: 400, headers });
    if (password.length < 6)  return Response.json({ error: 'Password must be at least 6 characters.' }, { status: 400, headers });
    if (!/\S+@\S+\.\S+/.test(email)) return Response.json({ error: 'Invalid email address.' }, { status: 400, headers });

    const hash = await sha256(password);
    await env.DB.prepare(
      'INSERT INTO users (username, email, password_hash, created_at) VALUES (?1, ?2, ?3, ?4)'
    ).bind(username.trim(), email.trim().toLowerCase(), hash, Date.now()).run();

    return Response.json({ success: true, username: username.trim() }, { headers });
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      if (e.message.toLowerCase().includes('username')) return Response.json({ error: 'Username already taken.' }, { status: 409, headers });
      return Response.json({ error: 'Email already registered.' }, { status: 409, headers });
    }
    return Response.json({ error: 'Server error, please try again.' }, { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
