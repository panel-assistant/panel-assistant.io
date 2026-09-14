import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleEditorAuth } from './editor-auth.js';
import config from './editor.json' with { type: 'json' };
import worker from './index.js';

const ORIGIN = 'https://panel-assistant.io';
const env = { GITHUB_OAUTH_CLIENT_ID: 'client-id', GITHUB_OAUTH_CLIENT_SECRET: 'client-secret' };
const STATE = '0123456789abcdef0123456789abcdef';

const auth = (query, e = env) =>
  handleEditorAuth(new Request(`${ORIGIN}/oauth/auth?${query}`), e, config);

const callback = ({
  query = `code=abc&state=${STATE}`,
  cookie = `editor-csrf=${STATE}`,
  e = env,
  fetcher,
} = {}) =>
  handleEditorAuth(
    new Request(`${ORIGIN}/oauth/callback?${query}`, { headers: cookie ? { cookie } : {} }),
    e,
    config,
    fetcher,
  );

const github = (body = { access_token: 'gho_token' }) => {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return new Response(JSON.stringify(body));
  };
  return { calls, fetcher };
};

test('auth redirects to GitHub with the fixed public scope and a CSRF cookie', async () => {
  const res = await auth('provider=github&site_id=panel-assistant.io&scope=repo,user');
  assert.equal(res.status, 302);
  const location = new URL(res.headers.get('location'));
  assert.equal(location.origin + location.pathname, 'https://github.com/login/oauth/authorize');
  assert.equal(location.searchParams.get('scope'), 'public_repo');
  assert.equal(location.searchParams.get('client_id'), 'client-id');
  const state = location.searchParams.get('state');
  assert.match(state, /^[0-9a-f]{32}$/);
  assert.match(
    res.headers.get('set-cookie'),
    new RegExp(`^editor-csrf=${state};.*HttpOnly.*Secure`),
  );
});

test('auth refuses another provider, another site and missing secrets', async () => {
  for (const [query, e, code] of [
    ['provider=gitlab&site_id=panel-assistant.io', env, 'UNSUPPORTED_BACKEND'],
    ['provider=github&site_id=evil.example', env, 'UNSUPPORTED_DOMAIN'],
    ['provider=github', env, 'UNSUPPORTED_DOMAIN'],
    ['provider=github&site_id=panel-assistant.io', {}, 'MISCONFIGURED_CLIENT'],
  ]) {
    const res = await auth(query, e);
    assert.equal(res.status, 200, query);
    assert.equal(res.headers.get('location'), null, query);
    assert.match(await res.text(), new RegExp(code), query);
  }
});

test('callback exchanges the code and hands the token only to the site origin', async () => {
  const { calls, fetcher } = github();
  const res = await callback({ fetcher });
  const body = await res.text();
  assert.deepEqual(calls, [
    {
      url: 'https://github.com/login/oauth/access_token',
      body: { client_id: 'client-id', client_secret: 'client-secret', code: 'abc' },
    },
  ]);
  assert.match(body, /authorization:github:success:/);
  assert.match(body, /gho_token/);
  assert.match(body, /const origin = "https:\/\/panel-assistant.io"/);
  assert.match(body, /event\.origin !== origin/);
  assert.ok(!body.includes("'*'"), 'never posts to any origin');
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.match(res.headers.get('set-cookie'), /Max-Age=0/);
  assert.ok(!body.includes('client-secret'));
});

test('callback refuses a missing or mismatched CSRF value without calling GitHub', async () => {
  for (const opts of [
    { cookie: null },
    { cookie: 'editor-csrf=ffffffffffffffffffffffffffffffff' },
    { query: 'code=abc' },
    { query: `state=${STATE}` },
    { e: {} },
  ]) {
    const { calls, fetcher } = github();
    const body = await (await callback({ ...opts, fetcher })).text();
    assert.equal(calls.length, 0, JSON.stringify(opts));
    assert.match(body, /authorization:github:error:/, JSON.stringify(opts));
    assert.ok(!body.includes('gho_token'));
  }
});

test('callback reports GitHub refusing the code as an error, not a token', async () => {
  const { fetcher } = github({ error: 'bad_verification_code' });
  assert.match(await (await callback({ fetcher })).text(), /TOKEN_REQUEST_FAILED/);
});

test('a token in the page cannot break out of the script', async () => {
  const { fetcher } = github({ access_token: '</script><script>alert(1)</script>' });
  const body = await (await callback({ fetcher })).text();
  assert.equal(body.match(/<\/script>/g).length, 1);
});

test('the Worker routes /oauth/ to sign-in and nothing else there', async () => {
  const assets = { fetch: async () => new Response('asset') };
  const res = await worker.fetch(
    new Request(`${ORIGIN}/oauth/auth?provider=github&site_id=panel-assistant.io`),
    {
      ...env,
      ASSETS: assets,
    },
  );
  assert.equal(res.status, 302);
  const other = await worker.fetch(new Request(`${ORIGIN}/oauth/other`), {
    ...env,
    ASSETS: assets,
  });
  assert.equal(other.status, 404);
  const post = await worker.fetch(new Request(`${ORIGIN}/oauth/auth`, { method: 'POST' }), env);
  assert.equal(post.status, 405);
});

test('the editor sign-in keeps no state', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('./editor-auth.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /env\.(KV|DB|R2|[A-Z_]*STORE)/);
  assert.doesNotMatch(source, /^(let|var) /m);
});
