// Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET set as Cloudflare Pages
// environment variables (Production environment) to function.
export async function onRequestGet({ request, env }) {
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) return new Response('Google sign-in is not configured.', { status: 500 });

  const state = crypto.randomUUID();
  const redirectUri = new URL('/api/auth/google/callback', request.url).toString();

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  const headers = new Headers({ Location: authUrl.toString() });
  headers.append('Set-Cookie', `g_oauth_state=${state}; Path=/; Max-Age=600; Secure; HttpOnly; SameSite=Lax`);
  return new Response(null, { status: 302, headers });
}
