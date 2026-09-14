// GitHub sign-in for the page editor at /admin/. The editor opens /oauth/auth in a popup; GitHub
// returns to /oauth/callback, which exchanges the code for the reader's own token and hands it to
// the editor window. Nothing is stored: the CSRF value lives in a ten-minute cookie and the token
// goes straight back to the page that asked for it.
//
// Adapted from Sveltia CMS Authenticator (https://github.com/sveltia/sveltia-cms-auth), MIT License,
// Copyright (c) 2026 Kohei Yoshino. Reduced to GitHub, one fixed scope and one fixed site origin.

const PROVIDER = 'github';
const COOKIE = 'editor-csrf';

const html = (config, message, extraHeaders = {}) =>
  new Response(
    `<!doctype html><html><body><script>
(() => {
  const origin = ${JSON.stringify(config.siteOrigin)};
  const message = ${JSON.stringify(message).replaceAll('<', '\\u003c')};
  window.addEventListener('message', (event) => {
    if (event.origin !== origin || event.data !== 'authorizing:${PROVIDER}') return;
    window.opener?.postMessage(message, origin);
  });
  window.opener?.postMessage('authorizing:${PROVIDER}', origin);
})();
</script></body></html>`,
    {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'no-store',
        ...extraHeaders,
      },
    },
  );

const failure = (config, error, errorCode) =>
  html(
    config,
    `authorization:${PROVIDER}:error:${JSON.stringify({ provider: PROVIDER, error, errorCode })}`,
    { 'set-cookie': `${COOKIE}=; HttpOnly; Max-Age=0; Path=/oauth; SameSite=Lax; Secure` },
  );

export async function handleEditorAuth(request, env, config, fetcher = fetch) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return new Response(null, { status: 405 });

  const { GITHUB_OAUTH_CLIENT_ID: clientId, GITHUB_OAUTH_CLIENT_SECRET: clientSecret } = env;

  if (url.pathname === `${config.authBase}/auth`) {
    if (url.searchParams.get('provider') !== PROVIDER) {
      return failure(config, 'Only GitHub sign-in is available.', 'UNSUPPORTED_BACKEND');
    }
    if (url.searchParams.get('site_id') !== new URL(config.siteOrigin).hostname) {
      return failure(config, 'This sign-in serves one site only.', 'UNSUPPORTED_DOMAIN');
    }
    if (!clientId || !clientSecret) {
      return failure(config, 'Sign-in is not configured.', 'MISCONFIGURED_CLIENT');
    }
    const state = crypto.randomUUID().replaceAll('-', '');
    // The scope is fixed rather than taken from the request: anyone can reach this endpoint, and a
    // token keeps whatever scope it was first granted.
    const params = new URLSearchParams({ client_id: clientId, scope: config.scope, state });
    return new Response(null, {
      status: 302,
      headers: {
        location: `https://github.com/login/oauth/authorize?${params}`,
        'cache-control': 'no-store',
        'set-cookie': `${COOKIE}=${state}; HttpOnly; Max-Age=600; Path=/oauth; SameSite=Lax; Secure`,
      },
    });
  }

  if (url.pathname === `${config.authBase}/callback`) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookie = request.headers
      .get('cookie')
      ?.match(/(?:^|;\s*)editor-csrf=([0-9a-f]{32})\b/)?.[1];
    if (!code || !state) {
      return failure(
        config,
        'GitHub did not return an authorisation code.',
        'AUTH_CODE_REQUEST_FAILED',
      );
    }
    if (!cookie || cookie !== state) {
      return failure(config, 'Sign-in could not be verified. Try again.', 'CSRF_DETECTED');
    }
    if (!clientId || !clientSecret) {
      return failure(config, 'Sign-in is not configured.', 'MISCONFIGURED_CLIENT');
    }
    let token;
    try {
      const response = await fetcher('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      });
      ({ access_token: token } = await response.json());
    } catch {
      token = undefined;
    }
    if (!token) {
      return failure(config, 'GitHub did not issue a token. Try again.', 'TOKEN_REQUEST_FAILED');
    }
    return html(
      config,
      `authorization:${PROVIDER}:success:${JSON.stringify({ provider: PROVIDER, token })}`,
      { 'set-cookie': `${COOKIE}=; HttpOnly; Max-Age=0; Path=/oauth; SameSite=Lax; Secure` },
    );
  }

  return new Response(null, { status: 404 });
}
