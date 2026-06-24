import { checkAdminAuth } from './_auth.js';

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  const key = new URL(request.url).searchParams.get('key');
  const auth = await checkAdminAuth(request, env, key);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status, headers });

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
  const auth = await checkAdminAuth(request, env, key);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status, headers });

  const { endpoint } = await request.json();
  if (endpoint) await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?1').bind(endpoint).run();

  return Response.json({ success: true }, { headers });
}
