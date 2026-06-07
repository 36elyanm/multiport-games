export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  const key = new URL(request.url).searchParams.get('key');
  const adminKey = env.ADMIN_KEY || 'multiportgames2025';
  if (key !== adminKey) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const sub = await request.json();
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth)
    return Response.json({ error: 'Invalid subscription' }, { status: 400, headers });

  await env.DB.prepare(
    'INSERT INTO push_subscriptions (endpoint, p256dh, auth, created_at) VALUES (?1,?2,?3,?4) ON CONFLICT(endpoint) DO NOTHING'
  ).bind(sub.endpoint, sub.keys.p256dh, sub.keys.auth, Date.now()).run();

  return Response.json({ success: true }, { headers });
}

export async function onRequestDelete({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  const key = new URL(request.url).searchParams.get('key');
  const adminKey = env.ADMIN_KEY || 'multiportgames2025';
  if (key !== adminKey) return Response.json({ error: 'Unauthorized' }, { status: 401, headers });

  const { endpoint } = await request.json();
  if (endpoint) await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?1').bind(endpoint).run();

  return Response.json({ success: true }, { headers });
}
