export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  url.pathname = '/sitemap-content.xml';
  const response = await env.ASSETS.fetch(new Request(url.toString(), request));
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
