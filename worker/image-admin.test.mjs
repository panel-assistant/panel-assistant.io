import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import worker from './image-admin.js';

const ORIGIN = 'https://review.example';
const SECRET = 'private-review-test-secret-of-at-least-32-characters';

// Exercise the real request handler against R2's conditional-write and metadata contract.
class Bucket {
  objects = new Map();
  serial = 0;
  beforePut;
  async put(key, body, options = {}) {
    if (this.beforePut) await this.beforePut(key, body, options);
    const old = this.objects.get(key);
    if (options.onlyIf?.etagMatches && old?.etag !== options.onlyIf.etagMatches) return null;
    if (options.onlyIf?.etagDoesNotMatch === '*' && old) return null;
    const bytes = typeof body === 'string' ? Buffer.from(body) : Buffer.from(body);
    const record = { bytes, size: bytes.length, etag: String(++this.serial), ...options };
    this.objects.set(key, record);
    return { etag: record.etag };
  }
  async head(key) {
    const record = this.objects.get(key);
    return record ? { ...record } : null;
  }
  async get(key) {
    const record = this.objects.get(key);
    if (!record) return null;
    return {
      ...record,
      body: new Response(record.bytes).body,
      arrayBuffer: async () => Uint8Array.from(record.bytes).buffer,
      text: async () => record.bytes.toString(),
    };
  }
}
function environment() {
  return {
    ADMIN_REVIEW_SECRET: SECRET,
    IMAGE_STORE: new Bucket(),
    ASSETS: {
      fetch: async (request) => new Response(`private asset ${new URL(request.url).pathname}`),
    },
  };
}
const send = (env, path, { method = 'GET', cookie, body, headers = {}, document = false } = {}) =>
  worker.fetch(
    new Request(`${ORIGIN}${path}`, {
      method,
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(!['GET', 'HEAD'].includes(method) ? { origin: ORIGIN } : {}),
        ...(document ? { accept: 'text/html', 'sec-fetch-dest': 'document' } : {}),
        ...headers,
      },
      ...(body === undefined ? {} : { body }),
    }),
    env,
  );
const asJSON = (body) => ({
  body: JSON.stringify(body),
  headers: { 'content-type': 'application/json' },
});
async function session(env, prefix = '/admin/') {
  const response = await send(env, `${prefix}session`, {
    method: 'POST',
    ...asJSON({ secret: SECRET }),
  });
  assert.equal(response.status, 200);
  assert.match(
    response.headers.get('set-cookie'),
    /HttpOnly; Secure; SameSite=Strict; Max-Age=28800/,
  );
  return response.headers.get('set-cookie').split(';')[0];
}
const png = await sharp({ create: { width: 120, height: 80, channels: 3, background: '#5e84ae' } })
  .png()
  .toBuffer();
const jpg = await sharp(png).jpeg().toBuffer();
const webp = await sharp(png).webp().toBuffer();
const meta = {
  id: 'sample-panel-front',
  alt: 'Panel front',
  credit: 'Photographer unknown',
  source: {
    page: 'https://vendor.example/model',
    url: 'unknown',
    licence: 'unknown',
    notes: 'Discovered in product listing.',
    discovered: '2026-11-11',
  },
};
async function upload(
  env,
  cookie,
  { original = png, thumb = webp, large = webp, metadata = meta, prefix = '/admin/' } = {},
) {
  const form = new FormData();
  form.set('original', new Blob([original], { type: 'image/svg+xml' }), 'untrusted-name.svg');
  form.set('thumb', new Blob([thumb], { type: 'image/webp' }), 'thumb.webp');
  form.set('large', new Blob([large], { type: 'image/webp' }), 'large.webp');
  form.set('meta', JSON.stringify(metadata));
  return send(env, `${prefix}api/upload`, { method: 'POST', cookie, body: form });
}
async function save(env, cookie, library) {
  return send(env, '/admin/api/library', { method: 'PUT', cookie, ...asJSON(library) });
}
const modelWith = (images) => [{ id: 'vendor/model', title: 'Example panel', images }];

test('all private documents, scripts, images and APIs require the signed session', async () => {
  const env = environment();
  const document = await send(env, '/admin/', { document: true });
  assert.equal(document.status, 200);
  assert.match(await document.text(), /Private image review/);
  for (const path of [
    '/admin/app.js',
    '/admin/api/library',
    '/admin/api/export',
    '/admin/api/publication',
    '/admin/api/publish',
    '/admin/api/file?key=originals/test.png',
  ]) {
    const response = await send(env, path);
    assert.equal(response.status, 401, path);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match(response.headers.get('x-robots-tag'), /noindex/);
  }
  // A forged bearer/cookie value must not bypass the gate.
  assert.equal(
    (await send(env, '/admin/api/library', { cookie: '__Host-image-review=forged' })).status,
    401,
  );
  const cookie = await session(env);
  const entry = await send(env, '/admin/', { cookie });
  assert.equal(await entry.text(), 'private asset /index.html');
  const script = await send(env, '/admin/app.js', { cookie });
  assert.equal(await script.text(), 'private asset /app.js');
  assert.deepEqual(await (await send(env, '/admin/api/library', { cookie })).json(), {
    revision: null,
    models: [],
  });
  const logout = await send(env, '/admin/session', { method: 'DELETE', cookie });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
});

test('login and mutation requests reject other origins, bad credentials and tampered or expired sessions', async () => {
  const env = environment();
  assert.equal(
    (await send(env, '/admin/session', { method: 'POST', ...asJSON({ secret: 'wrong' }) })).status,
    401,
  );
  assert.equal(
    (
      await send(env, '/admin/session', {
        method: 'POST',
        ...asJSON({ secret: SECRET }),
        headers: { 'content-type': 'application/json', origin: 'https://untrusted.example' },
      })
    ).status,
    403,
  );
  const cookie = await session(env);
  assert.equal((await save(env, cookie + 'x', { revision: null, models: [] })).status, 401);
  const logout = await send(env, '/admin/session', {
    method: 'DELETE',
    cookie,
    headers: { origin: '' },
  });
  assert.equal(logout.status, 403);
  const publish = await send(env, '/admin/api/publish', {
    method: 'POST',
    cookie,
    ...asJSON({ modelId: 'vendor/model', draftRevision: 'saved', publishedRevision: null }),
    headers: { 'content-type': 'application/json', origin: 'https://untrusted.example' },
  });
  assert.equal(publish.status, 403);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const payload = `${Math.floor(Date.now() / 1000) - 1}.${'a'.repeat(32)}`;
  const signature = Buffer.from(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)),
  ).toString('hex');
  assert.equal(
    (
      await send(env, '/admin/api/library', {
        cookie: `__Host-image-review=${payload}.${signature}`,
      })
    ).status,
    401,
  );
});

test('publication endpoints report missing public storage while private saves remain available', async () => {
  const env = environment(),
    cookie = await session(env);
  assert.equal((await send(env, '/admin/api/publication', { cookie })).status, 503);
  assert.equal(
    (
      await send(env, '/admin/api/publish', {
        method: 'POST',
        cookie,
        ...asJSON({ modelId: 'vendor/model', draftRevision: 'saved', publishedRevision: null }),
      })
    ).status,
    503,
  );
  env.PUBLIC_IMAGES = {
    get() {
      throw new Error('Saving a private draft must not read publication storage.');
    },
    put() {
      throw new Error('Saving a private draft must not write publication storage.');
    },
  };
  assert.equal((await save(env, cookie, { revision: null, models: [] })).status, 200);
});

test('upload archives exact bytes with detected format and source provenance, then serves only private authenticated files', async () => {
  const env = environment(),
    cookie = await session(env);
  for (const [original, extension] of [
    [png, 'png'],
    [jpg, 'jpg'],
    [webp, 'webp'],
  ]) {
    const response = await upload(env, cookie, { original });
    assert.equal(response.status, 201, await response.clone().text());
    const image = await response.json();
    const sha = createHash('sha256').update(original).digest('hex');
    assert.deepEqual(image.original, {
      key: `originals/${sha}.${extension}`,
      sha256: sha,
      extension,
      width: 120,
      height: 80,
      bytes: original.length,
    });
    assert.equal(image.review, 'pending');
    assert.deepEqual(image.source, meta.source);
    const download = await send(env, `/admin/api/file?key=${image.original.key}`, { cookie });
    assert.deepEqual(Buffer.from(await download.arrayBuffer()), original);
    assert.equal(download.headers.get('cache-control'), 'no-store');
    const records = [...env.IMAGE_STORE.objects.entries()].filter(([key]) =>
      key.startsWith(`archives/uploads/${image.id}/${sha}/`),
    );
    assert.equal(
      records.length,
      1,
      'successful uploads have recoverable provenance before saving a library',
    );
    assert.deepEqual(JSON.parse(records[0][1].bytes), image);
  }
  for (const key of [
    'library.json',
    '../library.json',
    'originals/../library.json',
    'originals//x',
    'https://vendor.example/image.png',
  ]) {
    assert.equal(
      (await send(env, `/admin/api/file?key=${encodeURIComponent(key)}`, { cookie })).status,
      400,
    );
  }
});

test('upload rejects unsupported, truncated and oversized derivative images before storing objects', async () => {
  const env = environment(),
    cookie = await session(env);
  const oversized = await sharp({
    create: { width: 600, height: 400, channels: 3, background: '#444' },
  })
    .webp()
    .toBuffer();
  const badWebp = Buffer.from(webp);
  badWebp.writeUInt32LE(webp.length, 4);
  for (const options of [
    { original: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>') },
    { original: png.subarray(0, 33) },
    { original: jpg.subarray(0, jpg.length - 2) },
    { original: badWebp },
    { thumb: oversized },
    { metadata: { ...meta, source: { ...meta.source, page: 'javascript:alert(1)' } } },
  ]) {
    const response = await upload(env, cookie, options);
    assert.equal(response.status, 400, await response.clone().text());
    assert.equal(env.IMAGE_STORE.objects.size, 0);
  }
  // The streaming bound applies even when no Content-Length header was supplied.
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(36 * 1024 * 1024 + 1));
      controller.close();
    },
  });
  const response = await worker.fetch(
    new Request(`${ORIGIN}/admin/api/upload`, {
      method: 'POST',
      duplex: 'half',
      headers: { cookie, origin: ORIGIN, 'content-type': 'multipart/form-data; boundary=unused' },
      body,
    }),
    env,
  );
  assert.equal(response.status, 413);
  assert.equal(env.IMAGE_STORE.objects.size, 0);
});

test('the first derivative bytes stay immutable when another browser encodes the same original differently', async () => {
  const env = environment(),
    cookie = await session(env);
  const first = await (await upload(env, cookie)).json();
  const differentlyEncoded = await sharp(png).webp({ lossless: true }).toBuffer();
  assert.notDeepEqual(differentlyEncoded, webp);
  const second = await upload(env, cookie, {
    thumb: differentlyEncoded,
    large: differentlyEncoded,
  });
  assert.equal(second.status, 201, await second.clone().text());
  assert.deepEqual(env.IMAGE_STORE.objects.get(first.delivery.thumb).bytes, webp);
});

test('library saves retain removed masters and full previous provenance while enforcing revision and immutable originals', async () => {
  const env = environment(),
    cookie = await session(env);
  const image = await (await upload(env, cookie)).json();
  const firstResponse = await save(env, cookie, { revision: null, models: modelWith([image]) });
  assert.equal(firstResponse.status, 200, await firstResponse.clone().text());
  const first = await firstResponse.json();
  const edited = structuredClone(first);
  edited.models[0].images[0].credit = 'Corrected photographer';
  const head = env.IMAGE_STORE.head;
  env.IMAGE_STORE.head = async () => {
    throw new Error('Existing-image metadata edits must fit the R2 subrequest budget.');
  };
  const updated = await (await save(env, cookie, edited)).json();
  env.IMAGE_STORE.head = head;
  assert.notEqual(updated.revision, first.revision);
  assert.equal((await save(env, cookie, first)).status, 409);
  const forged = structuredClone(updated);
  forged.models[0].images[0].original.width += 1;
  assert.equal((await save(env, cookie, forged)).status, 409);
  const invented = structuredClone(updated);
  invented.models[0].images[0].history = [{ id: 'fabricated' }];
  assert.equal((await save(env, cookie, invented)).status, 409);
  for (const id of [undefined, 123]) {
    const missingID = structuredClone(updated);
    missingID.models[0].images[0].id = id;
    assert.equal((await save(env, cookie, missingID)).status, 400);
  }
  const removedResponse = await save(env, cookie, {
    revision: updated.revision,
    models: modelWith([]),
  });
  assert.equal(removedResponse.status, 200);
  const previous = JSON.parse(
    env.IMAGE_STORE.objects.get(`archives/library/${updated.revision}.json`).bytes,
  );
  assert.equal(previous.models[0].images[0].credit, 'Corrected photographer');
  assert.equal(previous.models[0].images[0].original.sha256, image.original.sha256);
  assert.deepEqual(env.IMAGE_STORE.objects.get(image.original.key).bytes, png);
  const exported = await send(env, '/admin/api/export', { cookie });
  assert.match(exported.headers.get('content-disposition'), /attachment/);
  assert.deepEqual((await exported.json()).models, modelWith([]));
});

test('an intervening R2 write wins even after the incoming revision was checked', async () => {
  const env = environment(),
    cookie = await session(env);
  const first = await (await save(env, cookie, { revision: null, models: [] })).json();
  let interrupted = false;
  env.IMAGE_STORE.beforePut = async (key) => {
    if (key !== 'library.json' || interrupted) return;
    interrupted = true;
    env.IMAGE_STORE.beforePut = null;
    await env.IMAGE_STORE.put(
      'library.json',
      JSON.stringify({ revision: 'concurrent-winner', models: [] }),
    );
  };
  const response = await save(env, cookie, first);
  assert.equal(response.status, 409);
  const stored = JSON.parse(await (await env.IMAGE_STORE.get('library.json')).text());
  assert.equal(stored.revision, 'concurrent-winner');
});

test('a model hero is explicit, survives save and reload, and can be cleared without reordering images', async () => {
  const env = environment(),
    cookie = await session(env);
  const front = await (await upload(env, cookie)).json();
  const rear = await (
    await upload(env, cookie, { metadata: { ...meta, id: 'sample-panel-rear', alt: 'Panel rear' } })
  ).json();
  const initial = await (
    await save(env, cookie, { revision: null, models: modelWith([front, rear]) })
  ).json();
  assert.equal(
    initial.models[0].heroImageId,
    undefined,
    'legacy models have no automatically selected hero',
  );
  const choice = structuredClone(initial);
  choice.models[0].heroImageId = rear.id;
  const selectedResponse = await save(env, cookie, choice);
  assert.equal(selectedResponse.status, 200);
  const selected = await selectedResponse.json();
  const reloaded = await (await send(env, '/admin/api/library', { cookie })).json();
  assert.equal(reloaded.models[0].heroImageId, rear.id);
  assert.deepEqual(
    reloaded.models[0].images.map((image) => image.id),
    [front.id, rear.id],
  );
  reloaded.models[0].heroImageId = null;
  assert.equal((await save(env, cookie, reloaded)).status, 200);
  const cleared = await (await send(env, '/admin/api/library', { cookie })).json();
  assert.equal(cleared.models[0].heroImageId, null);
  const archived = JSON.parse(
    env.IMAGE_STORE.objects.get(`archives/library/${selected.revision}.json`).bytes,
  );
  assert.equal(archived.models[0].heroImageId, rear.id);
});

test('a hero must reference an image still present in the same model', async () => {
  const env = environment(),
    cookie = await session(env);
  const image = await (await upload(env, cookie)).json();
  const foreign = await (
    await upload(env, cookie, { metadata: { ...meta, id: 'other-panel-front' } })
  ).json();
  const initial = await (
    await save(env, cookie, {
      revision: null,
      models: [
        ...modelWith([image]),
        { id: 'vendor/other', title: 'Other panel', images: [foreign] },
      ],
    })
  ).json();
  for (const heroImageId of [foreign.id, 'deleted-image', '', false, 0, [], {}]) {
    const invalid = structuredClone(initial);
    invalid.models[0].heroImageId = heroImageId;
    assert.equal((await save(env, cookie, invalid)).status, 400, JSON.stringify(heroImageId));
  }
  const removed = structuredClone(initial);
  removed.models[0].heroImageId = image.id;
  removed.models[0].images = [];
  assert.equal(
    (await save(env, cookie, removed)).status,
    400,
    'removing a selected hero requires clearing or changing the selection',
  );
  const reloaded = await (await send(env, '/admin/api/library', { cookie })).json();
  assert.deepEqual(reloaded, initial, 'invalid selections leave the stored revision unchanged');
});

test('canonical image address preserves authenticated assets, upload, master download, save and logout', async () => {
  const env = environment();
  const prefix = '/images/';
  const redirect = await send(env, '/images?return=review');
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get('location'), '/images/?return=review');
  const login = await send(env, prefix, { document: true });
  const html = await login.text();
  assert.match(html, /fetch\('\/images\/session'/);
  assert.match(html, /location.replace\('\/images\/'\)/);
  for (const path of [
    'app.js',
    'styles.css',
    'api/library',
    'api/export',
    'api/file?key=originals/test.png',
  ]) {
    const response = await send(env, prefix + path);
    assert.equal(response.status, 401, path);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal(
    (
      await send(env, prefix + 'session', {
        method: 'POST',
        ...asJSON({ secret: SECRET }),
        headers: { 'content-type': 'application/json', origin: 'https://other.example' },
      })
    ).status,
    403,
  );
  const cookie = await session(env, prefix);
  assert.equal(await (await send(env, prefix, { cookie })).text(), 'private asset /index.html');
  assert.equal(
    await (await send(env, prefix + 'app.js', { cookie })).text(),
    'private asset /app.js',
  );
  const uploaded = await upload(env, cookie, { prefix });
  assert.equal(uploaded.status, 201);
  const image = await uploaded.json();
  const input = { revision: null, models: modelWith([image]) };
  const saved = await send(env, prefix + 'api/library', {
    method: 'PUT',
    cookie,
    ...asJSON(input),
  });
  assert.equal(saved.status, 200);
  const library = await saved.json();
  assert.deepEqual(await (await send(env, '/admin/api/library', { cookie })).json(), library);
  const exported = await send(env, prefix + 'api/export', { cookie });
  assert.deepEqual(await exported.json(), library);
  assert.match(exported.headers.get('content-disposition'), /attachment/);
  const download = await send(env, prefix + `api/file?key=${image.original.key}`, { cookie });
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), png);
  const logout = await send(env, prefix + 'session', { method: 'DELETE', cookie });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
});

test('apex CMS and image-prefix lookalikes pass through without changing website headers or body', async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (request) => {
    requests.push(request.url);
    return new Response('existing website', { headers: { 'cache-control': 'public, max-age=60' } });
  };
  try {
    for (const path of ['/admin/', '/images-old', '/images.json?x=1']) {
      const response = await worker.fetch(
        new Request('https://panel-assistant.io' + path),
        environment(),
      );
      assert.equal(await response.text(), 'existing website', path);
      assert.equal(response.headers.get('cache-control'), 'public, max-age=60');
      assert.equal(response.headers.get('content-security-policy'), null);
    }
    assert.equal(requests.length, 3);
    assert.equal(
      (
        await worker.fetch(
          new Request('https://panel-assistant.io/images/api/library'),
          environment(),
        )
      ).status,
      401,
    );
    assert.equal(requests.length, 3, 'private API must never fall through to public assets');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
