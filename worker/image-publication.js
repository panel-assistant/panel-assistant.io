// Only this sanitized snapshot and verified web renditions cross the publication boundary.
export const PUBLICATION_KEY = 'published-images/current.json';
export const MAX_PUBLISH_IMAGES = 100;
const ASSET_ORIGIN = 'https://assets.panel-assistant.io';
const encoder = new TextEncoder();
const hashPattern = /^[a-f0-9]{64}$/;
const idPattern = /^[a-z0-9-]{1,100}$/;
const digest = async (bytes) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

export class PublicationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
const check = (condition, message, status) => {
  if (!condition) throw new PublicationError(message, status);
};

// The UI hashes the saved model with the same JSON.stringify + UTF-8 + SHA-256 recipe.
export const modelHash = (model) => digest(encoder.encode(JSON.stringify(model)));

export async function publicationObject(store) {
  check(store, 'Public image storage is not configured.', 503);
  const object = await store.get(PUBLICATION_KEY);
  if (!object) return { object: null, snapshot: { revision: null, models: [] } };
  const snapshot = JSON.parse(await object.text());
  check(
    typeof snapshot.revision === 'string' && Array.isArray(snapshot.models),
    'The published image snapshot is invalid.',
    503,
  );
  return { object, snapshot };
}

// Check the actual container, dimensions and absence of metadata; retain alpha bytes exactly.
function webpDimensions(bytes) {
  const ascii = (at, length) => String.fromCharCode(...bytes.subarray(at, at + length));
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  check(
    bytes.length >= 30 &&
      ascii(0, 4) === 'RIFF' &&
      ascii(8, 4) === 'WEBP' &&
      view.getUint32(4, true) + 8 === bytes.length,
    'Invalid public WebP container.',
  );
  let position = 12,
    frame,
    canvas;
  while (position + 8 <= bytes.length) {
    const type = ascii(position, 4);
    const size = view.getUint32(position + 4, true);
    const at = position + 8;
    check(at + size + (size % 2) <= bytes.length, 'Truncated public WebP.');
    check(
      ['VP8X', 'ALPH', 'VP8 ', 'VP8L'].includes(type),
      'Public WebP must be static and metadata-free.',
    );
    if (type === 'VP8X') {
      check(position === 12 && size === 10 && !(bytes[at] & ~0x10), 'Invalid public WebP flags.');
      canvas = {
        width: 1 + bytes[at + 4] + (bytes[at + 5] << 8) + (bytes[at + 6] << 16),
        height: 1 + bytes[at + 7] + (bytes[at + 8] << 8) + (bytes[at + 9] << 16),
      };
    } else if (type === 'VP8 ' || type === 'VP8L') {
      check(!frame, 'Public WebP must have one frame.');
      if (type === 'VP8 ') {
        check(size >= 10 && ascii(at + 3, 3) === '\x9d\x01\x2a', 'Invalid public WebP frame.');
        frame = {
          width: view.getUint16(at + 6, true) & 0x3fff,
          height: view.getUint16(at + 8, true) & 0x3fff,
        };
      } else {
        check(size >= 5 && bytes[at] === 0x2f, 'Invalid lossless WebP frame.');
        const bits = view.getUint32(at + 1, true);
        check(bits >>> 29 === 0, 'Invalid lossless WebP version.');
        frame = { width: 1 + (bits & 0x3fff), height: 1 + ((bits >>> 14) & 0x3fff) };
      }
    }
    position = at + size + (size % 2);
  }
  check(
    position === bytes.length &&
      frame?.width > 0 &&
      frame?.height > 0 &&
      (!canvas || (canvas.width === frame.width && canvas.height === frame.height)),
    'Incomplete public WebP or inconsistent dimensions.',
  );
  return frame;
}

function sourcePage(value) {
  if (!value || value === 'unknown') return undefined;
  const url = new URL(value);
  check(
    ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password,
    'Invalid public source link.',
  );
  return url.href;
}

function validateModel(model) {
  check(
    typeof model.title === 'string' && model.title.trim() && model.title.length <= 300,
    'Invalid model title.',
  );
  check(
    Array.isArray(model.images) && model.images.length <= MAX_PUBLISH_IMAGES,
    `Publish at most ${MAX_PUBLISH_IMAGES} images per model.`,
    413,
  );
  const ids = new Set();
  for (const image of model.images) {
    check(
      image && typeof image.id === 'string' && idPattern.test(image.id) && !ids.has(image.id),
      'Invalid published image ID.',
    );
    ids.add(image.id);
    check(
      typeof image.alt === 'string' &&
        image.alt.trim() &&
        image.alt.length <= 2000 &&
        typeof image.credit === 'string' &&
        image.credit.length <= 4000,
      'Invalid published image text.',
    );
    check(
      hashPattern.test(image.original?.sha256 ?? '') &&
        Number.isSafeInteger(image.original.width) &&
        image.original.width > 0 &&
        Number.isSafeInteger(image.original.height) &&
        image.original.height > 0 &&
        ['thumb', 'large'].every(
          (name) =>
            image.delivery?.[name] === `derivatives/${image.original.sha256}/v1/${name}.webp`,
        ),
      'Invalid saved image identity.',
    );
    sourcePage(image.source?.page);
  }
  check(
    model.heroImageId === undefined ||
      model.heroImageId === null ||
      (typeof model.heroImageId === 'string' && ids.has(model.heroImageId)),
    'Hero image must belong to this model.',
  );
}

async function copyDerivative(privateStore, publicStore, image, name) {
  const object = await privateStore.get(image.delivery[name]);
  check(
    object && object.size > 0 && object.size <= 5 * 1024 * 1024,
    'A saved derivative is missing or too large.',
  );
  const bytes = new Uint8Array(await object.arrayBuffer());
  const dimensions = webpDimensions(bytes);
  const sha = await digest(bytes);
  check(
    object.size === bytes.length &&
      object.httpMetadata?.contentType === 'image/webp' &&
      object.customMetadata?.sha256 === sha &&
      object.customMetadata?.extension === 'webp' &&
      Number(object.customMetadata.width) === dimensions.width &&
      Number(object.customMetadata.height) === dimensions.height &&
      Math.max(dimensions.width, dimensions.height) <= (name === 'thumb' ? 480 : 2400) &&
      Math.max(dimensions.width, dimensions.height) <=
        Math.max(image.original.width, image.original.height),
    'A saved derivative does not match its verified metadata.',
  );
  const key = `published-images/${sha}.webp`;
  const saved = await publicStore.put(key, bytes, {
    onlyIf: { etagDoesNotMatch: '*' },
    httpMetadata: {
      contentType: 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: { sha256: sha },
  });
  if (!saved) {
    const existing = await publicStore.get(key);
    check(
      existing &&
        existing.size === bytes.length &&
        existing.httpMetadata?.contentType === 'image/webp' &&
        existing.httpMetadata.cacheControl === 'public, max-age=31536000, immutable' &&
        (await digest(await existing.arrayBuffer())) === sha,
      'An immutable public rendition has inconsistent bytes or serving metadata.',
      409,
    );
  }
  return { url: `${ASSET_ORIGIN}/${key}`, ...dimensions };
}

export async function publishModel(input, privateStore, publicStore) {
  check(privateStore && publicStore, 'Image publication storage is not configured.', 503);
  check(
    input &&
      typeof input.modelId === 'string' &&
      /^[a-z0-9-]+\/[a-z0-9-]+$/.test(input.modelId) &&
      input.modelId.length <= 200,
    'Choose one model to publish.',
  );
  check(
    typeof input.draftRevision === 'string' &&
      input.draftRevision.length > 0 &&
      input.draftRevision.length <= 100,
    'Supply the saved draft revision.',
  );
  check(
    input.publishedRevision === null ||
      (typeof input.publishedRevision === 'string' &&
        input.publishedRevision.length > 0 &&
        input.publishedRevision.length <= 100),
    'Supply the current published revision.',
  );
  const libraryObject = await privateStore.get('library.json');
  check(libraryObject, 'Save a private draft before publishing.', 409);
  const library = JSON.parse(await libraryObject.text());
  check(
    library.revision === input.draftRevision,
    'The saved draft changed. Reload before publishing.',
    409,
  );
  const model = library.models?.find((model) => model.id === input.modelId);
  check(model, 'Model not found in the saved draft.', 404);
  validateModel(model);
  const { object, snapshot } = await publicationObject(publicStore);
  check(
    snapshot.revision === input.publishedRevision,
    'Published images changed. Reload before publishing.',
    409,
  );
  const publishedModel = {
    id: model.id,
    title: model.title,
    draftRevision: library.revision,
    draftHash: await modelHash(model),
    ...(model.heroImageId === undefined ? {} : { heroImageId: model.heroImageId }),
    images: [],
  };
  // Sequential processing keeps memory bounded to one derivative (at most 5 MiB) plus metadata.
  // At most 100 images use fewer than 610 R2 operations, including immutable-object collisions.
  for (const image of model.images) {
    const thumb = await copyDerivative(privateStore, publicStore, image, 'thumb');
    const large = await copyDerivative(privateStore, publicStore, image, 'large');
    const source = sourcePage(image.source?.page);
    publishedModel.images.push({
      id: image.id,
      alt: image.alt,
      credit: image.credit,
      ...(source ? { source } : {}),
      thumb: thumb.url,
      large: large.url,
      width: large.width,
      height: large.height,
    });
  }
  check(
    (await privateStore.head('library.json'))?.etag === libraryObject.etag,
    'The saved draft changed while preparing publication. Reload before publishing.',
    409,
  );
  const models = snapshot.models.map((existing) =>
    existing.id === model.id ? publishedModel : existing,
  );
  if (!models.some((existing) => existing.id === model.id)) models.push(publishedModel);
  const next = { revision: crypto.randomUUID(), publishedAt: new Date().toISOString(), models };
  const body = JSON.stringify(next);
  const metadata = { httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' } };
  const archived = await publicStore.put(`published-images/revisions/${next.revision}.json`, body, {
    ...metadata,
    onlyIf: { etagDoesNotMatch: '*' },
  });
  check(archived, 'Could not retain this publication revision.', 409);
  const activated = await publicStore.put(PUBLICATION_KEY, body, {
    ...metadata,
    onlyIf: object ? { etagMatches: object.etag } : { etagDoesNotMatch: '*' },
  });
  check(
    activated,
    'Published images changed while preparing publication. Reload before publishing.',
    409,
  );
  return next;
}
