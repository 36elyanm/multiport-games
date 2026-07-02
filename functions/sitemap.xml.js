export async function onRequestGet({ request, env }) {
  const response = await env.ASSETS.fetch(request);
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
