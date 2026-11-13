import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import worker from './image-admin.js';

const ORIGIN = 'https://review.example';
const TOKEN = 'valid-github-oauth-token';
const originalFetch = globalThis.fetch;
let githubState;
beforeEach(() => {
  githubState = { push: true, userStatus: 200, repoStatus: 200, calls: [] };
  globalThis.fetch = async (url, options) => {
    assert.equal(
      new URL(url).origin,
      'https://api.github.com',
      'Tests never contact external services',
    );
    assert.equal(options.headers.authorization, `Bearer ${TOKEN}`);
    githubState.calls.push(new URL(url).pathname);
    if (githubState.networkError) throw new Error('Offline');
    const user = new URL(url).pathname === '/user';
    return Response.json(
      user ? { id: 42, login: 'maintainer' } : { permissions: { push: githubState.push } },
      {
        status: user ? githubState.userStatus : githubState.repoStatus,
        headers: githubState.headers,
      },
    );
  };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
});

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
  async delete(key) {
    this.objects.delete(key);
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
    ...asJSON({ token: TOKEN, remember: false }),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Lax; Max-Age=28800/);
  return response.headers.get('set-cookie').split(';')[0];
}
const png = await sharp({ create: { width: 120, height: 80, channels: 3, background: '#5e84ae' } })
  .png()
  .toBuffer();
const jpg = await sharp(png).jpeg().toBuffer();
const webp = await sharp(png).webp().toBuffer();
// FFmpeg libjxl lossless RGBA fixtures: raw, full container, split SizeHeader container.
const jxlSamples = [
  Buffer.from(
    '/woTwUoICBAA9AErWZGCgsI9SwDnyq12CQpQ+3dK3quPeHfQwXCH4EloN/RpEo3rRQ/a1R8fD8aGY26+BJdHyP4hej1Ls9TX6bEOeejSE0fP/8VZSIH0jRtj8Loxbowx7u5CDAYACPTUAgAAdB54DsgdlRDt+Xb8KA5Y+EGAXcYoV9/uu8sYAA==',
    'base64',
  ),
  Buffer.from(
    'AAAADEpYTCANCocKAAAAFGZ0eXBqeGwgAAAAAGp4bCAAAACQanhsY/8KE8FKCAgQAPQBK1mRgoLCPUsA58qtdgkKUPt3St6rj3h30MFwh+BJaDf0aRKN60UP2tUfHw/GhmNuvgSXR8j+IXo9S7PU1+mxDnno0hNHz//FWUiB9I0bY/C6MW6MMe7uQgwGAAj01AIAAHQeeA7IHZUQ7fl2/CgOWPhBgF3GKFff7rvLGAA=',
    'base64',
  ),
  Buffer.from(
    'AAAADEpYTCANCocKAAAAFGZ0eXBqeGwgAAAAAGp4bCAAAAAPanhscAAAAAD/ChMAAACRanhscIAAAAHBSggIEAD0AStZkYKCwj1LAOfKrXYJClD7d0req494d9DBcIfgSWg39GkSjetFD9rVHx8PxoZjbr4El0fI/iF6PUuz1NfpsQ556NITR8//xVlIgfSNG2PwujFujDHu7kIMBgAI9NQCAAB0HngOyB2VEO35dvwoDlj4QYBdxihX3+67yxgA',
    'base64',
  ),
];
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

test('private documents, scripts, images and APIs require a revocable GitHub session', async () => {
  const env = environment();
  const document = await send(env, '/admin/', { document: true });
  assert.equal(document.status, 200);
  assert.match(await document.text(), /Sign in with GitHub/);
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
    (await send(env, '/admin/api/library', { cookie: '__Host-image-session=forged' })).status,
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

test('login and mutation requests reject other origins, old keys and tampered or expired sessions', async (t) => {
  const env = environment();
  assert.equal(
    (await send(env, '/admin/session', { method: 'POST', ...asJSON({ secret: 'wrong' }) })).status,
    401,
  );
  assert.equal(
    (
      await send(env, '/admin/session', {
        method: 'POST',
        ...asJSON({ token: TOKEN, remember: false }),
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
  const currentTime = Date.now();
  t.mock.method(Date, 'now', () => currentTime + 8 * 60 * 60 * 1000 + 1000);
  assert.equal((await send(env, '/admin/api/library', { cookie })).status, 401);
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
    assert.equal(
      [...env.IMAGE_STORE.objects.keys()].filter((key) => !key.startsWith('sessions/')).length,
      0,
    );
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
  assert.equal(
    [...env.IMAGE_STORE.objects.keys()].filter((key) => !key.startsWith('sessions/')).length,
    0,
  );
});

test('JPEG XL raw and container masters retain exact private bytes and verified dimensions with ordinary previews', async () => {
  for (const original of jxlSamples) {
    const env = environment(),
      cookie = await session(env);
    const response = await upload(env, cookie, { original, thumb: png, large: webp });
    assert.equal(response.status, 201, await response.clone().text());
    const image = await response.json();
    const hash = createHash('sha256').update(original).digest('hex');
    assert.deepEqual(image.original, {
      key: `originals/${hash}.jxl`,
      sha256: hash,
      extension: 'jxl',
      width: 120,
      height: 80,
      bytes: original.length,
    });
    const archived = await send(
      env,
      `/admin/api/file?key=${encodeURIComponent(image.original.key)}`,
      { cookie },
    );
    assert.equal(archived.headers.get('content-type'), 'image/jxl');
    assert.deepEqual(Buffer.from(await archived.arrayBuffer()), original);
    const saved = await save(env, cookie, { revision: null, models: modelWith([image]) });
    assert.equal(saved.status, 200, await saved.clone().text());
    assert.deepEqual((await saved.json()).models[0].images[0].original, image.original);
    assert.match(image.delivery.thumb, /thumb\.png$/);
    assert.match(image.delivery.large, /large\.webp$/);
  }
});

test('JPEG XL truncated size headers, oversized boxes and incomplete or reordered fragments cannot be archived', async () => {
  const badSize = Buffer.from(jxlSamples[1]);
  badSize.writeUInt32BE(0xffffffff, 32);
  const badOrder = Buffer.from(jxlSamples[2]);
  badOrder.writeUInt32BE(1, 40);
  const unfinished = Buffer.from(jxlSamples[2]);
  unfinished.writeUInt32BE(1, 55);
  const badExtended = Buffer.concat([
    jxlSamples[1].subarray(0, 32),
    Buffer.from([0, 0, 0, 1]),
    Buffer.from('jxlc'),
    Buffer.alloc(8, 255),
  ]);
  for (const original of [
    jxlSamples[0].subarray(0, 2),
    jxlSamples[0].subarray(0, 3),
    jxlSamples[1].subarray(0, -1),
    badSize,
    badOrder,
    unfinished,
    badExtended,
  ]) {
    const env = environment(),
      cookie = await session(env);
    const response = await upload(env, cookie, { original });
    assert.equal(response.status, 400, await response.clone().text());
    assert.equal(
      [...env.IMAGE_STORE.objects.keys()].filter((key) => !key.startsWith('sessions/')).length,
      0,
    );
  }
});

test('PNG fallback previews keep detected MIME, alpha and format-specific immutable keys through private save and reload', async () => {
  const env = environment(),
    cookie = await session(env);
  const alphaPNG = await sharp({
    create: { width: 120, height: 80, channels: 4, background: '#12345688' },
  })
    .png()
    .toBuffer();
  const response = await upload(env, cookie, { original: alphaPNG, thumb: alphaPNG, large: webp });
  assert.equal(response.status, 201, await response.clone().text());
  const image = await response.json();
  assert.equal(image.delivery.thumb, `derivatives/${image.original.sha256}/v1/thumb.png`);
  assert.equal(image.delivery.large, `derivatives/${image.original.sha256}/v1/large.webp`);
  const preview = await send(
    env,
    `/admin/api/file?key=${encodeURIComponent(image.delivery.thumb)}`,
    { cookie },
  );
  assert.equal(preview.headers.get('content-type'), 'image/png');
  const bytes = Buffer.from(await preview.arrayBuffer());
  assert.deepEqual(bytes, alphaPNG);
  assert.equal((await sharp(bytes).metadata()).hasAlpha, true);
  const saved = await save(env, cookie, { revision: null, models: modelWith([image]) });
  assert.equal(saved.status, 200, await saved.clone().text());
  const library = await (await send(env, '/admin/api/library', { cookie })).json();
  assert.deepEqual(library.models[0].images[0].delivery, image.delivery);
  const again = await upload(env, cookie, { original: alphaPNG, thumb: alphaPNG, large: webp });
  assert.equal(again.status, 201);
  assert.deepEqual(env.IMAGE_STORE.objects.get(image.delivery.thumb).bytes, alphaPNG);
});

// Valid ancillary chunks reproduce canvas output without changing compressed pixels.
function pngChunk(type, payload) {
  const body = Buffer.concat([Buffer.from(type), Buffer.from(payload)]);
  let crc = 0xffffffff;
  for (const byte of body) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  const chunk = Buffer.alloc(body.length + 8);
  chunk.writeUInt32BE(payload.length);
  body.copy(chunk, 4);
  chunk.writeUInt32BE((crc ^ 0xffffffff) >>> 0, chunk.length - 4);
  return chunk;
}
function withPNGChunks(bytes, chunks) {
  return Buffer.concat([bytes.subarray(0, 33), ...chunks, bytes.subarray(33)]);
}

test('server cleans PNG previews for PNG and JPEG XL uploads while retaining exact editable private masters', async () => {
  const alpha = await sharp({
    create: {
      width: 120,
      height: 80,
      channels: 4,
      background: { r: 20, g: 40, b: 80, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer();
  const metadata = [
    pngChunk('tEXt', Buffer.from('Software\0Private editor')),
    pngChunk('iTXt', Buffer.from('XML:com.adobe.xmp\0\0\0\0\0Photoshop editing resources')),
    pngChunk('eXIf', Buffer.from('private-location')),
    pngChunk('tIME', Buffer.alloc(7)),
    pngChunk('vpAg', Buffer.from('private application metadata')),
  ];
  const preview = withPNGChunks(alpha, metadata);
  const pngMaster = withPNGChunks(alpha, [metadata[1]]);
  const jxlBox = Buffer.alloc(8 + 26);
  jxlBox.writeUInt32BE(jxlBox.length);
  jxlBox.write('xml ', 4);
  jxlBox.write('Photoshop editing resources', 8);
  const jxlMaster = Buffer.concat([jxlSamples[1], jxlBox]);
  for (const original of [pngMaster, jxlMaster]) {
    const env = environment(),
      cookie = await session(env);
    const response = await upload(env, cookie, { original, thumb: preview, large: preview });
    assert.equal(response.status, 201, await response.clone().text());
    const image = await response.json();
    const master = await send(env, `/admin/api/file?key=${image.original.key}`, { cookie });
    assert.deepEqual(
      Buffer.from(await master.arrayBuffer()),
      original,
      'Photoshop and all other original data remain recoverable',
    );
    for (const key of Object.values(image.delivery)) {
      const stored = env.IMAGE_STORE.objects.get(key);
      assert.deepEqual(stored.bytes, alpha, 'server strips metadata before storage');
      assert.equal(stored.customMetadata.sha256, createHash('sha256').update(alpha).digest('hex'));
      assert.deepEqual(
        await sharp(stored.bytes).raw().toBuffer(),
        await sharp(alpha).raw().toBuffer(),
      );
    }
    const saved = await save(env, cookie, { revision: null, models: modelWith([image]) });
    assert.equal(saved.status, 200, await saved.clone().text());
    assert.deepEqual(env.IMAGE_STORE.objects.get(image.original.key).bytes, original);
  }
});

test('server removes WebP EXIF and XMP while retaining alpha, colour profile and pixels', async () => {
  const alpha = await sharp({
    create: {
      width: 120,
      height: 80,
      channels: 4,
      background: { r: 20, g: 40, b: 80, alpha: 0.5 },
    },
  });
  const preview = await alpha
    .clone()
    .withMetadata({ exif: { IFD0: { Software: 'Private editor' } } })
    .withXmp('<x:xmpmeta>Photoshop editing resources</x:xmpmeta>')
    .webp()
    .toBuffer();
  const env = environment(),
    cookie = await session(env);
  const response = await upload(env, cookie, { original: png, thumb: preview, large: preview });
  assert.equal(response.status, 201, await response.clone().text());
  const image = await response.json();
  const stored = env.IMAGE_STORE.objects.get(image.delivery.large).bytes;
  const details = await sharp(stored).metadata();
  assert.equal(details.exif, undefined);
  assert.equal(details.xmp, undefined);
  assert.equal(details.hasAlpha, true);
  assert.deepEqual(details.icc, (await sharp(preview).metadata()).icc);
  assert.deepEqual(await sharp(stored).raw().toBuffer(), await sharp(preview).raw().toBuffer());
});

test('preview cleanup still refuses animation, unknown critical chunks and truncation before image writes', async () => {
  for (const preview of [
    withPNGChunks(png, [pngChunk('acTL', Buffer.alloc(8))]),
    withPNGChunks(png, [pngChunk('fcTL', Buffer.alloc(26))]),
    withPNGChunks(png, [pngChunk('fdAT', Buffer.alloc(4))]),
    withPNGChunks(png, [pngChunk('ABCD', Buffer.from('unknown critical'))]),
    withPNGChunks(png, [pngChunk('tEXt', Buffer.from('private'))]).subarray(0, 42),
  ]) {
    const env = environment(),
      cookie = await session(env);
    const response = await upload(env, cookie, { thumb: preview });
    assert.equal(response.status, 400);
    assert.ok([...env.IMAGE_STORE.objects.keys()].every((key) => key.startsWith('sessions/')));
  }
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

test('private source masters survive save, reload and export with exact downloadable originals', async () => {
  const env = environment(),
    cookie = await session(env);
  const image = await (await upload(env, cookie)).json();
  image.archiveOnly = true;
  const response = await save(env, cookie, { revision: null, models: modelWith([image]) });
  assert.equal(response.status, 200, await response.clone().text());
  const saved = await response.json();
  assert.equal(saved.models[0].images[0].archiveOnly, true);
  assert.deepEqual(await (await send(env, '/admin/api/library', { cookie })).json(), saved);
  assert.deepEqual(await (await send(env, '/admin/api/export', { cookie })).json(), saved);
  const download = await send(
    env,
    `/admin/api/file?key=${encodeURIComponent(image.original.key)}`,
    { cookie },
  );
  assert.equal(download.status, 200);
  assert.deepEqual(Buffer.from(await download.arrayBuffer()), png);
  const restored = structuredClone(saved);
  restored.models[0].images[0].archiveOnly = false;
  const gallery = await save(env, cookie, restored);
  assert.equal(gallery.status, 200, await gallery.clone().text());
  assert.equal((await gallery.json()).models[0].images[0].archiveOnly, false);
});

test('private source selection rejects ambiguous flags without changing the stored draft', async () => {
  const env = environment(),
    cookie = await session(env);
  const image = await (await upload(env, cookie)).json();
  const response = await save(env, cookie, { revision: null, models: modelWith([image]) });
  assert.equal(response.status, 200);
  const saved = await response.json();
  for (const archiveOnly of [null, 0, 1, 'false', [], {}]) {
    const invalid = structuredClone(saved);
    invalid.models[0].images[0].archiveOnly = archiveOnly;
    assert.equal((await save(env, cookie, invalid)).status, 400, JSON.stringify(archiveOnly));
  }
  assert.deepEqual(await (await send(env, '/admin/api/library', { cookie })).json(), saved);
});

test('private source masters cannot be designated as a product hero', async () => {
  const env = environment(),
    cookie = await session(env);
  const image = await (await upload(env, cookie)).json();
  const response = await save(env, cookie, { revision: null, models: modelWith([image]) });
  assert.equal(response.status, 200);
  const saved = await response.json();
  const invalidHero = structuredClone(saved);
  invalidHero.models[0].images[0].archiveOnly = true;
  invalidHero.models[0].heroImageId = image.id;
  assert.equal((await save(env, cookie, invalidHero)).status, 400);
  assert.deepEqual(await (await send(env, '/admin/api/library', { cookie })).json(), saved);
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
  assert.match(html, /id="github-sign-in"/);
  assert.match(html, /src="\/images\/auth.js"/);
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
        ...asJSON({ token: TOKEN, remember: false }),
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

test('GitHub sessions report the verified account, fixed lifetime and remembered choice without exposing credentials', async (t) => {
  const clock = Date.now();
  t.mock.method(Date, 'now', () => clock);
  for (const [remember, seconds] of [
    [false, 28800],
    [true, 2592000],
  ]) {
    const env = environment();
    const response = await send(env, '/images/session', {
      method: 'POST',
      ...asJSON({ token: TOKEN, remember, login: 'unverified-client' }),
    });
    assert.equal(response.status, 200);
    const setCookie = response.headers.get('set-cookie');
    assert.match(
      setCookie,
      /^__Host-image-session=[a-f0-9]{64}; Path=\/; HttpOnly; Secure; SameSite=Lax;/,
    );
    assert.match(setCookie, new RegExp(`Max-Age=${seconds}$`));
    const cookie = setCookie.split(';')[0];
    const details = await response.json();
    assert.deepEqual(details, {
      authenticated: true,
      login: 'maintainer',
      expiresAt: new Date((Math.floor(clock / 1000) + seconds) * 1000).toISOString(),
      remembered: remember,
    });
    assert.deepEqual(await (await send(env, '/images/session', { cookie })).json(), details);
    assert.equal(JSON.stringify(details).includes(TOKEN), false);
    const logout = await send(env, '/images/session', { method: 'DELETE', cookie });
    assert.equal(logout.status, 200);
    assert.equal(
      (await send(env, '/images/api/library', { cookie })).status,
      401,
      'A copied cookie cannot replay a logged-out session',
    );
    assert.equal(env.IMAGE_STORE.objects.size, 0, 'Logout removes the retained GitHub token');
  }
});

test('GitHub identity and repository write permission are checked server-side and old shared keys cannot sign in', async () => {
  const env = environment();
  env.ADMIN_REVIEW_SECRET = 'previous-valid-review-secret-longer-than-thirty-two';
  assert.equal(
    (
      await send(env, '/images/session', {
        method: 'POST',
        ...asJSON({ secret: env.ADMIN_REVIEW_SECRET }),
      })
    ).status,
    401,
  );
  githubState.userStatus = 401;
  assert.equal(
    (await send(env, '/images/session', { method: 'POST', ...asJSON({ token: TOKEN }) })).status,
    401,
  );
  githubState.userStatus = 200;
  githubState.push = false;
  assert.equal(
    (
      await send(env, '/images/session', {
        method: 'POST',
        ...asJSON({ token: TOKEN, login: 'maintainer', permissions: { push: true } }),
      })
    ).status,
    403,
  );
  assert.equal(env.IMAGE_STORE.objects.size, 0, 'Denied identities cannot create sessions');
});

test('GitHub outages and primary or secondary rate limits fail closed without creating sessions', async () => {
  for (const state of [
    { networkError: true },
    { userStatus: 429 },
    { repoStatus: 403, headers: { 'x-ratelimit-remaining': '0' } },
    { repoStatus: 403, headers: { 'retry-after': '30' } },
  ]) {
    const env = environment();
    Object.assign(
      githubState,
      { push: true, userStatus: 200, repoStatus: 200, headers: undefined, networkError: false },
      state,
    );
    const response = await send(env, '/images/session', {
      method: 'POST',
      ...asJSON({ token: TOKEN }),
    });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('set-cookie'), null);
    assert.equal(env.IMAGE_STORE.objects.size, 0);
  }
});

test('repository write authorization is cached for at most five minutes and denial revokes the session', async (t) => {
  let clock = Date.now();
  t.mock.method(Date, 'now', () => clock);
  const env = environment(),
    cookie = await session(env);
  githubState.push = false;
  clock += 299000;
  assert.equal((await send(env, '/images/api/library', { cookie })).status, 200);
  clock += 1000;
  assert.equal((await send(env, '/images/api/library', { cookie })).status, 403);
  assert.equal((await send(env, '/images/session', { cookie })).status, 401);
  assert.equal(env.IMAGE_STORE.objects.size, 0);
});

test('a failed authorization refresh denies private data while keeping logout and later retry available', async (t) => {
  let clock = Date.now();
  t.mock.method(Date, 'now', () => clock);
  const env = environment(),
    cookie = await session(env);
  clock += 300000;
  githubState.networkError = true;
  assert.equal((await send(env, '/images/api/library', { cookie })).status, 503);
  githubState.networkError = false;
  assert.equal((await send(env, '/images/api/library', { cookie })).status, 200);
  githubState.networkError = true;
  clock += 300000;
  assert.equal((await send(env, '/images/session', { method: 'DELETE', cookie })).status, 200);
  assert.equal((await send(env, '/images/api/library', { cookie })).status, 401);
});

test('expired sessions discard retained tokens and cannot be extended by private reads', async (t) => {
  let clock = Date.now();
  t.mock.method(Date, 'now', () => clock);
  const env = environment(),
    cookie = await session(env);
  clock += 28800000;
  assert.equal((await send(env, '/images/session', { cookie })).status, 401);
  assert.equal(env.IMAGE_STORE.objects.size, 0);
});

test('a GitHub authorization refresh cannot recreate a session revoked while the request was in flight', async (t) => {
  let clock = Date.now();
  t.mock.method(Date, 'now', () => clock);
  const env = environment(),
    cookie = await session(env);
  clock += 300000;
  const original = globalThis.fetch;
  let release, reached;
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  const githubReached = new Promise((resolve) => {
    reached = resolve;
  });
  globalThis.fetch = async (url, options) => {
    if (new URL(url).pathname.startsWith('/repos/')) {
      reached();
      await pending;
    }
    return original(url, options);
  };
  const refresh = send(env, '/images/api/library', { cookie });
  await githubReached;
  assert.equal((await send(env, '/images/session', { method: 'DELETE', cookie })).status, 200);
  release();
  assert.equal((await refresh).status, 401);
  assert.equal((await send(env, '/images/api/library', { cookie })).status, 401);
  assert.equal(env.IMAGE_STORE.objects.size, 0);
});

test('concurrent successful GitHub authorization refreshes keep both private requests signed in', async (t) => {
  let clock = Date.now();
  t.mock.method(Date, 'now', () => clock);
  const env = environment(),
    cookie = await session(env);
  clock += 300000;
  const original = globalThis.fetch;
  let release,
    reached,
    count = 0;
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  const bothReached = new Promise((resolve) => {
    reached = resolve;
  });
  globalThis.fetch = async (url, options) => {
    if (new URL(url).pathname.startsWith('/repos/')) {
      if (++count === 2) reached();
      await pending;
    }
    return original(url, options);
  };
  const requests = [
    send(env, '/images/api/library', { cookie }),
    send(env, '/images/api/library', { cookie }),
  ];
  await bothReached;
  release();
  assert.deepEqual(
    (await Promise.all(requests)).map((response) => response.status),
    [200, 200],
  );
  assert.equal((await send(env, '/images/session', { cookie })).status, 200);
  assert.equal((await send(env, '/images/session', { method: 'DELETE', cookie })).status, 200);
  assert.equal((await send(env, '/images/session', { cookie })).status, 401);
});

test('unexpected GitHub redirects fail closed instead of forwarding the token', async () => {
  const env = environment();
  let requests = 0;
  globalThis.fetch = async (url, options) => {
    requests++;
    assert.equal(new URL(url).origin, 'https://api.github.com');
    assert.equal(options.redirect, 'manual');
    return new Response('{}', { status: 302, headers: { location: 'https://other.example/user' } });
  };
  const response = await send(env, '/images/session', {
    method: 'POST',
    ...asJSON({ token: TOKEN }),
  });
  assert.equal(response.status, 503);
  assert.equal(requests, 1);
  assert.equal(response.headers.get('set-cookie'), null);
  assert.equal(env.IMAGE_STORE.objects.size, 0);
});

test('session credentials remain outside downloadable files and library exports', async () => {
  const env = environment(),
    cookie = await session(env);
  const key = [...env.IMAGE_STORE.objects.keys()][0];
  for (const path of [key, `archives/../${key}`, `originals/../${key}`]) {
    assert.equal(
      (await send(env, '/images/api/file?key=' + encodeURIComponent(path), { cookie })).status,
      400,
    );
  }
  const exported = await (await send(env, '/images/api/export', { cookie })).text();
  assert.deepEqual(JSON.parse(exported), { revision: null, models: [] });
  assert.equal(exported.includes(TOKEN), false);
  assert.equal(exported.includes(cookie.split('=')[1]), false);
  assert.equal(await (await send(env, '/images/auth.js')).text(), 'private asset /auth.js');
  assert.equal((await send(env, '/images/app.js')).status, 401);
});

test('legacy Worker document navigation uses the canonical host without redirecting private file or mutation requests', async () => {
  const env = environment();
  const origin = 'https://panel-image-admin-review.example.workers.dev';
  for (const path of ['/admin/', '/images/', '/admin/index.html']) {
    const response = await worker.fetch(
      new Request(origin + path + '?view=panel', { headers: { accept: 'text/html' } }),
      env,
    );
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), 'https://panel-assistant.io/images/?view=panel');
  }
  const file = await worker.fetch(
    new Request(origin + '/admin/api/file?key=originals/test.png', {
      headers: { accept: 'text/html' },
    }),
    env,
  );
  assert.equal(file.status, 401);
  assert.equal(file.headers.get('location'), null);
  const mutation = await worker.fetch(
    new Request(origin + '/admin/api/library', {
      method: 'PUT',
      headers: { origin, 'content-type': 'application/json' },
      body: '{}',
    }),
    env,
  );
  assert.equal(mutation.status, 401);
  assert.equal(mutation.headers.get('location'), null);
});
