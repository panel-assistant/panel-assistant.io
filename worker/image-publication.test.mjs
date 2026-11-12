import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import worker from './image-admin.js';

const ORIGIN = 'https://review.example';
const SECRET = 'local-publication-fixture-secret-longer-than-32-characters';
const CURRENT = 'published-images/current.json';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

// Exercise the authenticated production handler with R2 conditional writes and exact bytes.
class Bucket {
  objects = new Map();
  serial = 0;
  beforePut;
  reads = [];
  operations = 0;
  async put(key, value, options = {}) {
    this.operations++;
    if (this.beforePut) await this.beforePut(key, value, options);
    const previous = this.objects.get(key);
    if (options.onlyIf?.etagMatches && previous?.etag !== options.onlyIf.etagMatches) return null;
    if (options.onlyIf?.etagDoesNotMatch === '*' && previous) return null;
    const bytes = typeof value === 'string' ? Buffer.from(value) : Buffer.from(value);
    const stored = { bytes, size: bytes.length, etag: String(++this.serial), ...options };
    this.objects.set(key, stored);
    return { etag: stored.etag };
  }
  async head(key) {
    this.operations++;
    return this.objects.get(key) ?? null;
  }
  async get(key) {
    this.operations++;
    this.reads.push(key);
    const stored = this.objects.get(key);
    if (!stored) return null;
    return {
      ...stored,
      text: async () => stored.bytes.toString(),
      arrayBuffer: async () => Uint8Array.from(stored.bytes).buffer,
      body: new Response(stored.bytes).body,
    };
  }
}

const png = await sharp({
  create: { width: 120, height: 80, channels: 4, background: '#12345688' },
})
  .png()
  .toBuffer();
const webp = await sharp(png).webp().toBuffer();
const source = {
  page: 'http://vendor.example/product',
  url: 'https://private.example/original?token=private',
  licence: 'Private permission evidence',
  notes: 'PRIVATE OPERATOR NOTES',
  discovered: '2026-11-12',
};

function fixture() {
  const env = {
    ADMIN_REVIEW_SECRET: SECRET,
    IMAGE_STORE: new Bucket(),
    PUBLIC_IMAGES: new Bucket(),
  };
  let cookie;
  const send = (path, body, extra = {}) =>
    worker.fetch(
      new Request(`${ORIGIN}/images/api/${path}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
          ...(cookie ? { cookie } : {}),
          ...(body === undefined ? {} : { origin: ORIGIN, 'content-type': 'application/json' }),
          ...extra.headers,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        ...extra,
      }),
      env,
    );
  const login = async () => {
    const response = await worker.fetch(
      new Request(`${ORIGIN}/images/session`, {
        method: 'POST',
        headers: { origin: ORIGIN, 'content-type': 'application/json' },
        body: JSON.stringify({ secret: SECRET }),
      }),
      env,
    );
    assert.equal(response.status, 200);
    cookie = response.headers.get('set-cookie').split(';')[0];
  };
  const upload = async (id) => {
    const form = new FormData();
    for (const [name, bytes] of [
      ['original', png],
      ['thumb', webp],
      ['large', webp],
    ])
      form.set(name, new Blob([bytes]), name);
    form.set('meta', JSON.stringify({ id, alt: `Panel ${id}`, credit: `Credit ${id}`, source }));
    const response = await worker.fetch(
      new Request(`${ORIGIN}/images/api/upload`, {
        method: 'POST',
        headers: { cookie, origin: ORIGIN },
        body: form,
      }),
      env,
    );
    assert.equal(response.status, 201, await response.clone().text());
    return response.json();
  };
  const save = async (library) => {
    const response = await send('library', library, { method: 'PUT' });
    assert.equal(response.status, 200, await response.clone().text());
    return response.json();
  };
  const prepare = async () => {
    await login();
    const first = await upload('front'),
      second = await upload('rear');
    return save({
      revision: null,
      models: [
        { id: 'vendor/panel', title: 'Panel', images: [second, first], heroImageId: first.id },
        { id: 'vendor/other', title: 'Other panel', images: [] },
      ],
    });
  };
  const publish = (library, publishedRevision = null, modelId = 'vendor/panel') =>
    send('publish', { modelId, draftRevision: library.revision, publishedRevision });
  return { env, send, login, save, prepare, publish };
}

test('selected publication preserves exact alpha renditions and exposes ordered credits without private masters or provenance', async () => {
  const f = fixture(),
    library = await f.prepare();
  assert.deepEqual(await (await f.send('publication')).json(), { revision: null, models: [] });
  const draftBefore = f.env.IMAGE_STORE.objects.get('library.json').bytes;
  f.env.IMAGE_STORE.reads.length = 0;
  const response = await f.publish(library);
  assert.equal(response.status, 200, await response.clone().text());
  const snapshot = await response.json(),
    model = snapshot.models[0];
  assert.deepEqual(
    snapshot.models.map((model) => model.id),
    ['vendor/panel'],
  );
  assert.deepEqual(
    model.images.map((image) => image.id),
    ['rear', 'front'],
  );
  assert.equal(model.heroImageId, 'front');
  assert.equal(model.draftRevision, library.revision);
  assert.equal(model.draftHash, sha(JSON.stringify(library.models[0])));
  assert.equal(model.images[0].credit, 'Credit rear');
  assert.equal(model.images[0].source, source.page);
  assert.equal(model.images[0].width, 120);
  assert.equal(model.images[0].height, 80);
  const key = `published-images/${sha(webp)}.webp`;
  assert.equal(model.images[0].thumb, `https://assets.panel-assistant.io/${key}`);
  assert.equal(model.images[0].large, model.images[0].thumb);
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(key).bytes, webp);
  assert.equal((await sharp(f.env.PUBLIC_IMAGES.objects.get(key).bytes).metadata()).hasAlpha, true);
  assert.equal(
    f.env.PUBLIC_IMAGES.objects.get(key).httpMetadata.cacheControl,
    'public, max-age=31536000, immutable',
  );
  assert.deepEqual(f.env.IMAGE_STORE.objects.get('library.json').bytes, draftBefore);
  assert.ok(f.env.IMAGE_STORE.reads.every((key) => !key.startsWith('originals/')));
  assert.ok(
    [...f.env.PUBLIC_IMAGES.objects.keys()].every((key) => key.startsWith('published-images/')),
  );
  const publicText = JSON.stringify(snapshot);
  for (const privateText of [
    'originals/',
    'derivatives/',
    'private.example',
    'PRIVATE OPERATOR NOTES',
    'Private permission evidence',
    '"history"',
    '"review"',
  ])
    assert.ok(!publicText.includes(privateText), privateText);
  assert.deepEqual(await (await f.send('publication')).json(), snapshot);
  assert.deepEqual(
    JSON.parse(
      f.env.PUBLIC_IMAGES.objects.get(`published-images/revisions/${snapshot.revision}.json`).bytes,
    ),
    snapshot,
  );
});

test('publishing another model preserves previous selections and an explicit empty list removes only the chosen gallery', async () => {
  const f = fixture(),
    library = await f.prepare();
  const first = await (await f.publish(library)).json();
  const second = await (await f.publish(library, first.revision, 'vendor/other')).json();
  assert.deepEqual(second.models[0], first.models[0]);
  const removed = structuredClone(library);
  removed.models[0].images = [];
  removed.models[0].heroImageId = null;
  const saved = await f.save(removed);
  const response = await f.publish(saved, second.revision);
  assert.equal(response.status, 200, await response.clone().text());
  const cleared = await response.json();
  assert.deepEqual(cleared.models[0].images, []);
  assert.equal(cleared.models[0].heroImageId, null);
  assert.deepEqual(cleared.models[1], second.models[1]);
  assert.ok(f.env.IMAGE_STORE.objects.has(library.models[0].images[0].original.key));
});

test('stale draft/public revisions and requests without one explicit model cannot publish', async () => {
  const f = fixture(),
    library = await f.prepare();
  const first = await (await f.publish(library)).json();
  const before = f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes;
  for (const [body, status] of [
    [{ draftRevision: library.revision, publishedRevision: first.revision }, 400],
    [{ modelId: '*', draftRevision: library.revision, publishedRevision: first.revision }, 400],
    [
      {
        modelId: 'vendor/absent',
        draftRevision: library.revision,
        publishedRevision: first.revision,
      },
      404,
    ],
    [{ modelId: 'vendor/panel', draftRevision: 'stale', publishedRevision: first.revision }, 409],
    [{ modelId: 'vendor/panel', draftRevision: library.revision, publishedRevision: null }, 409],
  ])
    assert.equal((await f.send('publish', body)).status, status);
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes, before);
});

test('one hundred images publish within the R2 request budget and larger batches preserve the active snapshot', async () => {
  const f = fixture(),
    library = await f.prepare();
  const image = library.models[0].images[0];
  library.models[0].images = Array.from({ length: 100 }, (_, index) => ({
    ...image,
    id: `photo-${index}`,
  }));
  library.models[0].heroImageId = 'photo-99';
  const saved = await f.save(library);
  f.env.IMAGE_STORE.operations = 0;
  f.env.PUBLIC_IMAGES.operations = 0;
  const response = await f.publish(saved);
  assert.equal(response.status, 200, await response.clone().text());
  const snapshot = await response.json();
  assert.equal(snapshot.models[0].images.length, 100);
  assert.equal(snapshot.models[0].heroImageId, 'photo-99');
  assert.ok(f.env.IMAGE_STORE.operations + f.env.PUBLIC_IMAGES.operations < 610);
  const before = f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes;
  saved.models[0].images.push({ ...image, id: 'photo-100' });
  const tooMany = await f.save(saved);
  assert.equal((await f.publish(tooMany, snapshot.revision)).status, 413);
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes, before);
});

test('an intervening publication wins the activation CAS without being overwritten', async () => {
  const f = fixture(),
    library = await f.prepare();
  const first = await (await f.publish(library)).json();
  const winner = { ...first, revision: 'concurrent-publication' };
  f.env.PUBLIC_IMAGES.beforePut = async (key) => {
    if (key !== CURRENT) return;
    f.env.PUBLIC_IMAGES.beforePut = null;
    await f.env.PUBLIC_IMAGES.put(CURRENT, JSON.stringify(winner));
  };
  assert.equal((await f.publish(library, first.revision)).status, 409);
  assert.deepEqual(await (await f.send('publication')).json(), winner);
});

test('copy failures and draft changes during preparation leave the previous active publication untouched', async () => {
  const f = fixture(),
    library = await f.prepare();
  const first = await (await f.publish(library)).json();
  const before = f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes;
  f.env.PUBLIC_IMAGES.beforePut = async (key) => {
    if (key.endsWith('.webp')) throw new Error('simulated storage failure');
  };
  assert.equal((await f.publish(library, first.revision)).status, 500);
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes, before);
  f.env.PUBLIC_IMAGES.beforePut = async (key) => {
    if (!key.endsWith('.webp')) return;
    f.env.PUBLIC_IMAGES.beforePut = null;
    await f.env.IMAGE_STORE.put(
      'library.json',
      JSON.stringify({ ...library, revision: 'newer-draft' }),
    );
  };
  assert.equal((await f.publish(library, first.revision)).status, 409);
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes, before);
});

test('corrupt or private-metadata derivatives never activate, including preexisting mismatched public objects', async () => {
  const f = fixture(),
    library = await f.prepare();
  const first = await (await f.publish(library)).json();
  const before = f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes;
  const derivativeKey = library.models[0].images[0].delivery.thumb;
  const derivative = f.env.IMAGE_STORE.objects.get(derivativeKey);
  const originalBytes = derivative.bytes;
  derivative.bytes = Buffer.from('not an image');
  derivative.size = derivative.bytes.length;
  assert.equal((await f.publish(library, first.revision)).status, 400);
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes, before);
  derivative.bytes = originalBytes;
  derivative.size = originalBytes.length;
  derivative.customMetadata.sha256 = '0'.repeat(64);
  assert.equal((await f.publish(library, first.revision)).status, 400);
  derivative.customMetadata.sha256 = sha(originalBytes);
  const privateChunk = Buffer.concat([
    Buffer.from('EXIF'),
    Buffer.from([6, 0, 0, 0]),
    Buffer.from('secret'),
  ]);
  const metadataWebp = Buffer.concat([webp, privateChunk]);
  metadataWebp.writeUInt32LE(metadataWebp.length - 8, 4);
  derivative.bytes = metadataWebp;
  derivative.size = metadataWebp.length;
  derivative.customMetadata.sha256 = sha(metadataWebp);
  assert.equal(
    (await f.publish(library, first.revision)).status,
    400,
    'public derivatives must not contain private EXIF metadata',
  );
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes, before);
  derivative.bytes = originalBytes;
  derivative.size = originalBytes.length;
  derivative.customMetadata.sha256 = sha(originalBytes);
  const publicKey = `published-images/${sha(webp)}.webp`;
  await f.env.PUBLIC_IMAGES.put(publicKey, 'corrupt existing object');
  assert.equal((await f.publish(library, first.revision)).status, 409);
  assert.equal(
    f.env.PUBLIC_IMAGES.objects.get(publicKey).bytes.toString(),
    'corrupt existing object',
  );
  assert.deepEqual(f.env.PUBLIC_IMAGES.objects.get(CURRENT).bytes, before);
});
