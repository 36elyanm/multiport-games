export async function onRequestGet({ env }) {
  const headers = { 'Content-Type': 'application/json' };
  const { results } = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM bug_reports WHERE fixed = 0'
  ).all();
  return Response.json({ count: results?.[0]?.n || 0 }, { headers });
}
