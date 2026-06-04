export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const { game, description, email } = await request.json();
    if (!description || description.trim().length < 5)
      return Response.json({ error: 'Please describe the bug.' }, { status: 400, headers });

    await env.DB.prepare(
      'INSERT INTO bug_reports (game, description, email, created_at) VALUES (?1, ?2, ?3, ?4)'
    ).bind(
      (game || 'Unknown').slice(0, 100),
      description.trim().slice(0, 1000),
      (email || '').slice(0, 200),
      Date.now()
    ).run();

    return Response.json({ success: true }, { headers });
  } catch (e) {
    return Response.json({ error: 'Server error.' }, { status: 500, headers });
  }
}
