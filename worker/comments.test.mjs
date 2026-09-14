import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handleComment, termFor, sha1, commentBody, appJwt } from './comments.js';
import config from './comments.json' with { type: 'json' };
import worker from './index.js';

const ORIGIN = 'https://panel-assistant.io';
const PAGE_HTML = '<meta property="og:description" content="Start &amp; finish."/>';

// A real RSA key for the App, so the fake GitHub below can verify the JWT signature.
const appKeys = await crypto.subtle.generateKey(
  {
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  true,
  ['sign', 'verify'],
);
const pkcs8 = Buffer.from(await crypto.subtle.exportKey('pkcs8', appKeys.privateKey)).toString(
  'base64',
);
// PEM armour assembled at run time: the key is generated above and never committed.
const armour = (edge) => `-----${edge} ${['PRIVATE', 'KEY'].join(' ')}-----`;
const APP_PEM = `${armour('BEGIN')}\n${pkcs8.match(/.{1,64}/g).join('\n')}\n${armour('END')}\n`;

// Returns the JWT's claims when its RS256 signature verifies against the App key, else null.
async function verifiedClaims(jwt, publicKey = appKeys.publicKey) {
  const [header, payload, signature] = jwt.split('.');
  const bytes = (b64) => Buffer.from(b64, 'base64url');
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    bytes(signature),
    new TextEncoder().encode(`${header}.${payload}`),
  );
  if (!ok || JSON.parse(bytes(header)).alg !== 'RS256') return null;
  return JSON.parse(bytes(payload));
}

// A rate limiter with the binding's shape: the first `limit` calls per key succeed.
const limiter = (limit = 2) => {
  const seen = new Map();
  return {
    keys: seen,
    async limit({ key }) {
      seen.set(key, (seen.get(key) ?? 0) + 1);
      return { success: seen.get(key) <= limit };
    },
  };
};

const makeEnv = (over = {}) => ({
  COMMENT_RATE: limiter(),
  TURNSTILE_SECRET_KEY: 'turnstile-secret',
  GITHUB_APP_ID: '123456',
  GITHUB_APP_PRIVATE_KEY: APP_PEM,
  ASSETS: {
    // Like Static Assets under wrangler dev: the host is ignored and a page answers with or
    // without its trailing slash.
    fetch: async (req) =>
      ['/', '/start/getting-started/', '/start/getting-started'].includes(new URL(req.url).pathname)
        ? new Response(PAGE_HTML)
        : new Response('not found', { status: 404 }),
  },
  ...over,
});

// Fakes Turnstile and GitHub, recording every outbound call.
const upstream = ({
  turnstile = { success: true, hostname: 'panel-assistant.io' },
  existing = null,
  recent = [],
} = {}) => {
  const calls = [];
  const fetcher = async (url, init) => {
    if (url.includes('turnstile')) {
      calls.push({ kind: 'turnstile', form: Object.fromEntries(init.body) });
      return Response.json(turnstile);
    }
    // GitHub REST for App authentication: only a JWT signed by the App key, issued for its id.
    if (!url.endsWith('/graphql')) {
      const path = new URL(url).pathname;
      const jwt = init.headers.authorization.replace(/^Bearer /, '');
      const claims = await verifiedClaims(jwt);
      calls.push({ kind: 'github', rest: `${init.method} ${path}`, claims, body: init.body });
      if (!claims || claims.iss !== '123456') return Response.json({}, { status: 401 });
      if (
        init.method === 'GET' &&
        path === '/repos/panel-assistant/panel-assistant.io/installation'
      ) {
        return Response.json({ id: 42 });
      }
      if (init.method === 'POST' && path === '/app/installations/42/access_tokens') {
        return Response.json({ token: 'installation-token' }, { status: 201 });
      }
      return Response.json({}, { status: 404 });
    }
    const { query, variables } = JSON.parse(init.body);
    calls.push({ kind: 'github', query, variables, auth: init.headers.authorization });
    if (query.includes('search(')) {
      return Response.json({ data: { search: { nodes: existing ? [existing] : [] } } });
    }
    if (query.includes('discussions(')) {
      return Response.json({ data: { repository: { discussions: { nodes: recent } } } });
    }
    if (query.includes('createDiscussion')) {
      return Response.json({ data: { createDiscussion: { discussion: { id: 'D_new' } } } });
    }
    if (query.includes('addDiscussionComment')) {
      return Response.json({
        data: { addDiscussionComment: { comment: { url: 'https://github.com/c/1' } } },
      });
    }
    return Response.json({ errors: [{ message: 'unexpected' }] });
  };
  return { calls, fetcher };
};

const post = (fields = {}, headers = {}) => {
  const body = new FormData();
  const all = {
    body: 'Useful tip',
    name: 'Sam',
    page: '/start/getting-started/',
    'cf-turnstile-response': 'tok',
    ...fields,
  };
  for (const [k, v] of Object.entries(all)) if (v !== undefined) body.set(k, v);
  return new Request(`${ORIGIN}/comments`, {
    method: 'POST',
    body,
    headers: { origin: ORIGIN, 'cf-connecting-ip': '198.51.100.7', ...headers },
  });
};

test('the discussion term and hash match giscus pathname mapping', async () => {
  assert.equal(termFor('/'), 'index');
  assert.equal(termFor('/start/getting-started/'), 'start/getting-started/');
  assert.equal(termFor('/a/page.html'), 'a/page');
  // SHA-1 of "index", as giscus writes into the discussion body under strict mapping.
  assert.equal(await sha1('index'), 'e540cdd1328b2b21e29a95405c301b9313b7c346');
});

test('a comment on a page with no discussion creates it the way giscus does, then comments', async () => {
  const { calls, fetcher } = upstream();
  const res = await handleComment(post(), makeEnv(), config, fetcher);
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { url: 'https://github.com/c/1' });

  const hash = await sha1('start/getting-started/');
  const create = calls.find((c) => c.query?.includes('createDiscussion'));
  assert.deepEqual(create.variables.input, {
    repositoryId: config.repoId,
    categoryId: config.categoryId,
    title: 'start/getting-started/',
    body: `# start/getting-started/\n\nStart & finish.\n\n${ORIGIN}/start/getting-started/\n\n<!-- sha1: ${hash} -->`,
  });
  const search = calls.find((c) => c.query?.includes('search('));
  assert.equal(
    search.variables.q,
    `repo:panel-assistant/panel-assistant.io category:"General" in:body "${hash}"`,
  );
  const add = calls.find((c) => c.query?.includes('addDiscussionComment'));
  assert.equal(add.variables.input.discussionId, 'D_new');
  const graph = calls.filter((c) => c.query);
  assert.ok(graph.length > 0 && graph.every((c) => c.auth === 'bearer installation-token'));
});

test('the App signs a short-lived RS256 JWT for its own id', async () => {
  const now = Date.UTC(2026, 8, 14, 12, 0, 0);
  const claims = await verifiedClaims(await appJwt('123456', APP_PEM, now));
  assert.deepEqual(claims, { iat: now / 1000 - 60, exp: now / 1000 + 540, iss: '123456' });
  // A different key does not verify, so the fake GitHub really checks the signature.
  const other = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );
  assert.equal(await verifiedClaims(await appJwt('123456', APP_PEM, now), other.publicKey), null);
});

test('comments post with an installation token narrowed to Discussions on this repository', async () => {
  const { calls, fetcher } = upstream();
  assert.equal((await handleComment(post(), makeEnv(), config, fetcher)).status, 201);
  const rest = calls.filter((c) => c.rest);
  assert.deepEqual(
    rest.map((c) => c.rest),
    [
      'GET /repos/panel-assistant/panel-assistant.io/installation',
      'POST /app/installations/42/access_tokens',
    ],
  );
  assert.ok(rest.every((c) => c.claims?.iss === '123456'));
  assert.deepEqual(JSON.parse(rest[1].body), {
    repositories: ['panel-assistant.io'],
    permissions: { discussions: 'write' },
  });
});

test('an App key that GitHub rejects posts nothing', async () => {
  const { calls, fetcher } = upstream();
  const env = makeEnv({ GITHUB_APP_ID: '999' });
  const res = await handleComment(post(), env, config, fetcher);
  assert.equal(res.status, 502);
  // The refused installation lookup ends it: no token request and no GraphQL call follow.
  assert.deepEqual(
    calls.filter((c) => c.kind === 'github').map((c) => c.rest),
    ['GET /repos/panel-assistant/panel-assistant.io/installation'],
  );
});

test('an existing discussion is reused, not duplicated', async () => {
  const hash = await sha1('start/getting-started/');
  const { calls, fetcher } = upstream({
    existing: { id: 'D_old', body: `# x\n\n<!-- sha1: ${hash} -->` },
  });
  const res = await handleComment(post(), makeEnv(), config, fetcher);
  assert.equal(res.status, 201);
  assert.ok(!calls.some((c) => c.query?.includes('createDiscussion')));
  assert.equal(
    calls.find((c) => c.query?.includes('addDiscussionComment')).variables.input.discussionId,
    'D_old',
  );
});

test('a discussion too new for search is found among recent ones, not duplicated', async () => {
  const hash = await sha1('start/getting-started/');
  const { calls, fetcher } = upstream({
    recent: [
      { id: 'D_other', body: '<!-- sha1: 0000 -->' },
      { id: 'D_fresh', body: `# x\n\n<!-- sha1: ${hash} -->` },
    ],
  });
  const res = await handleComment(post(), makeEnv(), config, fetcher);
  assert.equal(res.status, 201);
  assert.ok(!calls.some((c) => c.query?.includes('createDiscussion')));
  assert.equal(
    calls.find((c) => c.query?.includes('addDiscussionComment')).variables.input.discussionId,
    'D_fresh',
  );
});

test('the rate limit refuses the third comment from one address within the window, before any upstream call', async () => {
  const env = makeEnv();
  const { calls, fetcher } = upstream();
  assert.equal((await handleComment(post(), env, config, fetcher)).status, 201);
  assert.equal((await handleComment(post(), env, config, fetcher)).status, 201);
  const before = calls.length;
  const third = await handleComment(post(), env, config, fetcher);
  assert.equal(third.status, 429);
  assert.deepEqual(await third.json(), { error: 'rate' });
  assert.equal(calls.length, before);
  // A different address is counted separately.
  const other = post({}, { 'cf-connecting-ip': '203.0.113.9' });
  assert.equal((await handleComment(other, env, config, fetcher)).status, 201);
});

test('the form uses a real Turnstile site key, not a test key', () => {
  // Cloudflare's test site keys start 1x, 2x or 3x; a live key starts 0x.
  assert.match(config.turnstileSiteKey, /^0x[\w-]{20,}$/);
});

test('the configured limit is per address, two a minute', () => {
  const text = readFileSync(new URL('./wrangler.jsonc', import.meta.url), 'utf8');
  assert.match(
    text,
    /"name": "COMMENT_RATE", "namespace_id": "\d+", "simple": \{ "limit": 2, "period": 60 \}/,
  );
});

test('a failed Turnstile check posts nothing to GitHub', async () => {
  const { calls, fetcher } = upstream({
    turnstile: { success: false, hostname: 'panel-assistant.io', 'error-codes': ['bad'] },
  });
  const res = await handleComment(post(), makeEnv(), config, fetcher);
  assert.equal(res.status, 403);
  assert.deepEqual(await res.json(), { error: 'challenge' });
  assert.ok(!calls.some((c) => c.kind === 'github'));
  const verify = calls.find((c) => c.kind === 'turnstile');
  assert.deepEqual(verify.form, {
    secret: 'turnstile-secret',
    response: 'tok',
    remoteip: '198.51.100.7',
  });
});

test('a Turnstile pass for another hostname is refused', async () => {
  const { calls, fetcher } = upstream({ turnstile: { success: true, hostname: 'evil.example' } });
  const res = await handleComment(post(), makeEnv(), config, fetcher);
  assert.equal(res.status, 403);
  assert.ok(!calls.some((c) => c.kind === 'github'));
});

test('a page the site does not serve gets no discussion', async () => {
  for (const page of [
    '/no-such-page/',
    'https://evil.example/',
    '/../etc/',
    '//evil.example/',
    '/start/getting-started',
  ]) {
    const { calls, fetcher } = upstream();
    const res = await handleComment(post({ page }), makeEnv(), config, fetcher);
    assert.equal(res.status, 400, page);
    assert.ok(!calls.some((c) => c.kind === 'github'), page);
  }
});

test('empty, oversized, cross-origin and non-POST requests are refused', async () => {
  const { calls, fetcher } = upstream();
  const env = makeEnv({ COMMENT_RATE: limiter(100) });
  assert.equal((await handleComment(post({ body: '  ' }), env, config, fetcher)).status, 400);
  assert.equal(
    (await handleComment(post({ body: 'x'.repeat(config.maxBody + 1) }), env, config, fetcher))
      .status,
    413,
  );
  assert.equal(
    (await handleComment(post({}, { origin: 'https://evil.example' }), env, config, fetcher))
      .status,
    403,
  );
  assert.equal(
    (await handleComment(new Request(`${ORIGIN}/comments`), env, config, fetcher)).status,
    405,
  );
  assert.ok(!calls.some((c) => c.kind === 'github'));
});

test('without its secrets or limiter the endpoint fails closed', async () => {
  const { calls, fetcher } = upstream();
  for (const missing of [
    'COMMENT_RATE',
    'TURNSTILE_SECRET_KEY',
    'GITHUB_APP_ID',
    'GITHUB_APP_PRIVATE_KEY',
  ]) {
    const res = await handleComment(post(), makeEnv({ [missing]: undefined }), config, fetcher);
    assert.equal(res.status, 503, missing);
  }
  assert.equal(calls.length, 0);
});

test('a GitHub failure is reported without detail', async () => {
  const fetcher = async (url) =>
    url.includes('turnstile')
      ? Response.json({ success: true, hostname: 'panel-assistant.io' })
      : Response.json({ message: 'Bad credentials' }, { status: 401 });
  const res = await handleComment(post(), makeEnv(), config, fetcher);
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { error: 'github' });
});

test('reader text cannot mention people or inject HTML, however it is encoded', () => {
  // Each of these rendered as a real mention on GitHub before this escaping, or would have.
  const hostile = [
    '@octocat',
    '&#64;octocat',
    '&#x40;octocat',
    '&commat;octocat',
    '\\@octocat',
    '| @octocat |\n|---|',
    '@<!-- -->octocat',
    '@github/security',
  ];
  for (const input of hostile) {
    const body = commentBody(input, 'Sam @x &#64;y');
    assert.ok(!body.includes('@'), input);
    // Every ampersand left is one this function wrote, so nothing decodes to an at sign.
    assert.deepEqual(body.match(/&(?!amp;|lt;)/g), null, input);
    assert.ok(!body.includes('<!--'), input);
  }
  assert.match(commentBody('hi @someone <img src=x>', ''), /hi \uff20someone &lt;img src=x>/);
  assert.match(commentBody('&#64;x', ''), /^&amp;#64;x/);
  assert.match(commentBody('hi', ''), /A reader posted this/);
});

test('the live worker routes /comments to the handler and everything else as before', async () => {
  const env = makeEnv({ COMMENT_RATE: undefined, GO_MISSES: { writeDataPoint() {} } });
  const res = await worker.fetch(post(), env);
  assert.equal(res.status, 503);
  assert.equal((await worker.fetch(new Request(`${ORIGIN}/go/usb-install`), env)).status, 302);
  const wrangler = readFileSync(new URL('./wrangler.jsonc', import.meta.url), 'utf8');
  assert.match(wrangler, /"run_worker_first": \[[^\]]*"\/comments"/);
});

test('the Worker holds no comment state: no storage binding and no module-level cache', () => {
  const wrangler = readFileSync(new URL('./wrangler.jsonc', import.meta.url), 'utf8');
  for (const binding of [
    'kv_namespaces',
    'd1_databases',
    'r2_buckets',
    'durable_objects',
    'queues',
    'hyperdrive',
    'vectorize',
  ]) {
    assert.ok(!wrangler.includes(`"${binding}"`), binding);
  }
  const source = readFileSync(new URL('./comments.js', import.meta.url), 'utf8');
  const topLevel = source
    .split('\n')
    .filter((l) => /^(let|var)\s|^const\s+\w+\s*=\s*(new\s|\[|\{)/.test(l));
  assert.deepEqual(topLevel, []);
});
