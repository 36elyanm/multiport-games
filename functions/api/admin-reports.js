export async function onRequestGet({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  const key = new URL(request.url).searchParams.get('key');
  const adminKey = env.ADMIN_KEY || 'multiportgames2025';
  if (key !== adminKey) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const { results } = await env.DB.prepare(
    'SELECT id, game, description, email, created_at, fixed FROM bug_reports ORDER BY created_at DESC LIMIT 200'
  ).all();
  return Response.json({ reports: results }, { headers });
}

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  const key = new URL(request.url).searchParams.get('key');
  const adminKey = env.ADMIN_KEY || 'multiportgames2025';
  if (key !== adminKey) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const { id, fixed } = await request.json();
  await env.DB.prepare('UPDATE bug_reports SET fixed=?1 WHERE id=?2').bind(fixed ? 1 : 0, id).run();
  return Response.json({ success: true }, { headers });
}
