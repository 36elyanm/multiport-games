import { sendWebPush } from '../_lib/webpush.js';

export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const { game, description, email } = await request.json();
    if (!description || description.trim().length < 5)
      return Response.json({ error: 'Please describe the bug.' }, { status: 400, headers });

    const gameName = (game || 'Unknown').slice(0, 100);
    const desc = description.trim().slice(0, 1000);

    await env.DB.prepare(
      'INSERT INTO bug_reports (game, description, email, created_at) VALUES (?1, ?2, ?3, ?4)'
    ).bind(gameName, desc, (email || '').slice(0, 200), Date.now()).run();

    await notifySubscribers(env, gameName, desc);

    return Response.json({ success: true }, { headers });
  } catch (e) {
    return Response.json({ error: 'Server error.' }, { status: 500, headers });
  }
}

async function notifySubscribers(env, gameName, desc) {
  try {
    const vapidPublic = env.VAPID_PUBLIC_KEY;
    const vapidPrivate = env.VAPID_PRIVATE_KEY;
    if (!vapidPublic || !vapidPrivate) return;

    const { results: subs } = await env.DB.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions').all();
    if (!subs?.length) return;

    const payload = {
      title: '🐛 New Bug Report',
      body: `${gameName}: ${desc.slice(0, 120)}`,
      url: '/admin.html',
    };

    await Promise.allSettled(subs.map(async (s) => {
      const res = await sendWebPush(s, payload, vapidPublic, vapidPrivate, 'mailto:admin@multiportgames.pages.dev');
      if (res.status === 404 || res.status === 410) {
        await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?1').bind(s.endpoint).run();
      }
    }));
  } catch (e) {
    // never let push notification errors break the bug-report submission
  }
}
