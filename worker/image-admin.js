// Private drafts stay private; an explicit per-model action publishes verified web renditions.
import {
  PublicationError,
  publicationObject,
  publishModel,
  renditionDetails,
} from './image-publication.js';

const PREFIX = '/admin/';
const IMAGE_PREFIX = '/images/';
const COOKIE = '__Host-image-review';
const TTL = 8 * 60 * 60;
const MiB = 1024 * 1024;
const encoder = new TextEncoder();
const slug = /^[a-z0-9-]{1,100}$/;
const hashPattern = /^[a-f0-9]{64}$/;
const security = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'x-robots-tag': 'noindex, nofollow, nosnippet',
  'referrer-policy': 'no-referrer',
};

class Problem extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const check = (condition, message, status = 400) => {
  if (!condition) throw new Problem(status, message);
};
const json = (value, status = 200, headers = {}) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json;charset=UTF-8', ...headers },
  });
const hex = (bytes) =>
  [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
const digest = async (bytes) => hex(await crypto.subtle.digest('SHA-256', bytes));
const equal = (a, b) => {
  let different = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) different |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return different === 0;
};
const sign = async (text, secret) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(text)));
};
const cookie = (value, age) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;

async function authenticated(request, secret) {
  if (!secret) return false;
  const value = request.headers
    .get('cookie')
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  const match = value?.match(/^(\d+)\.([a-f0-9]{32})\.([a-f0-9]{64})$/);
  if (!match) return false;
  const now = Math.floor(Date.now() / 1000);
  if (+match[1] <= now || +match[1] > now + TTL + 5) return false;
  return equal(
    encoder.encode(match[3]),
    encoder.encode(await sign(`${match[1]}.${match[2]}`, secret)),
  );
}

function loginPage(prefix) {
  const nonce = crypto.randomUUID();
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Private image review</title><body><h1>Private image review</h1><form id="login"><label>Review access key <input name="secret" type="password" autocomplete="off" required></label><button>Sign in</button><p id="status" role="status"></p></form><script nonce="${nonce}">
const form = document.querySelector('#login');
const supplied = new URLSearchParams(location.hash.slice(1)).get('access');
history.replaceState(null, '', location.pathname + location.search);
async function login(secret) {
  document.querySelector('#status').textContent = 'Signing in…';
  try {
    const response = await fetch('${prefix}session', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret})});
    if (!response.ok) throw new Error('Access key was not accepted.');
    location.replace('${prefix}');
  } catch (error) { document.querySelector('#status').textContent = error.message; }
}
form.addEventListener('submit', event => {event.preventDefault();login(form.elements.secret.value);});
if (supplied) login(supplied);
</script></body></html>`,
    {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'content-security-policy': `default-src 'none'; script-src 'nonce-${nonce}'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
      },
    },
  );
}

async function readBytes(body, limit) {
  const chunks = [];
  let length = 0;
  const reader = body?.getReader();
  check(reader, 'A request body is required.');
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new Problem(413, 'The request is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
async function readJSON(request, limit = 2 * MiB) {
  check(
    request.headers.get('content-type')?.split(';')[0] === 'application/json',
    'Use application/json.',
    415,
  );
  try {
    return JSON.parse(new TextDecoder().decode(await readBytes(request.body, limit)));
  } catch (error) {
    if (error instanceof Problem) throw error;
    throw new Problem(400, 'Invalid JSON.');
  }
}
function text(value, label, max = 2000, required = false) {
  check(
    typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0),
    `Invalid ${label}.`,
  );
  return value;
}
function source(value) {
  check(value && typeof value === 'object' && !Array.isArray(value), 'Invalid source.');
  const result = {};
  for (const key of ['page', 'url']) {
    result[key] = text(value[key] ?? '', `source ${key}`, 4000);
    if (result[key] && result[key] !== 'unknown') {
      let parsed;
      try {
        parsed = new URL(result[key]);
      } catch {
        /* checked below */
      }
      check(
        parsed &&
          ['http:', 'https:'].includes(parsed.protocol) &&
          !parsed.username &&
          !parsed.password,
        `Invalid source ${key} URL.`,
      );
    }
  }
  result.licence = text(value.licence, 'licence', 4000, true);
  result.notes = text(value.notes ?? '', 'source notes', 10000);
  if (value.discovered !== undefined) {
    result.discovered = text(value.discovered, 'discovery date', 100);
    check(Number.isFinite(Date.parse(result.discovered)), 'Invalid discovery date.');
  }
  return result;
}
function metadata(value) {
  check(value && typeof value === 'object' && !Array.isArray(value), 'Invalid image metadata.');
  return {
    alt: text(value.alt, 'image description', 2000, true),
    credit: text(value.credit ?? '', 'credit', 4000),
    source: source(value.source),
  };
}
const ascii = (bytes, start, count) => String.fromCharCode(...bytes.subarray(start, start + count));

// JPEG XL SizeHeader/container rules: libjxl v0.11.1 headers.cc and decode.cc.
// Read dimensions only; browser Image.decode() establishes complete image decodability.
function jxlDimensions(bytes) {
  let stream = bytes,
    streamLength = bytes.length;
  if (hex(bytes.subarray(0, 12)) === '0000000c4a584c200d0a870a') {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const prefix = [];
    let position = 12,
      boxes = 0,
      fragments = 0,
      kind,
      final = false;
    streamLength = 0;
    while (position < bytes.length) {
      check(++boxes <= 4096 && position + 8 <= bytes.length, 'Invalid JPEG XL container.');
      let size = view.getUint32(position),
        header = 8;
      const type = ascii(bytes, position + 4, 4);
      if (size === 1) {
        check(position + 16 <= bytes.length, 'Truncated JPEG XL box.');
        const extended = view.getBigUint64(position + 8);
        check(extended <= BigInt(bytes.length - position), 'Invalid JPEG XL box size.');
        size = Number(extended);
        header = 16;
      } else if (size === 0) size = bytes.length - position;
      check(size >= header && size <= bytes.length - position, 'Truncated JPEG XL box.');
      let start = position + header;
      const end = position + size;
      if (boxes === 1) {
        check(
          type === 'ftyp' &&
            end - start >= 12 &&
            (end - start - 8) % 4 === 0 &&
            ascii(bytes, start, 4) === 'jxl ',
          'Invalid JPEG XL file type.',
        );
        let compatible = false;
        for (let at = start + 8; at < end; at += 4) compatible ||= ascii(bytes, at, 4) === 'jxl ';
        check(compatible, 'Missing JPEG XL compatible brand.');
      } else if (type === 'jxlc' || type === 'jxlp') {
        check(!final && (!kind || kind === type), 'Invalid JPEG XL codestream sequence.');
        kind = type;
        if (type === 'jxlp') {
          check(end - start >= 4, 'Truncated JPEG XL fragment.');
          const index = view.getUint32(start);
          check((index & 0x7fffffff) === fragments++, 'Invalid JPEG XL fragment order.');
          final = Boolean(index & 0x80000000);
          start += 4;
        } else final = true;
        streamLength += end - start;
        for (let at = start; at < end && prefix.length < 16; at++) prefix.push(bytes[at]);
      } else check(type !== 'ftyp' && type !== 'JXL ', 'Duplicate JPEG XL header.');
      position = end;
    }
    check(final && streamLength > 2, 'Incomplete JPEG XL codestream.');
    stream = Uint8Array.from(prefix);
  }
  check(stream[0] === 0xff && stream[1] === 0x0a, 'Invalid JPEG XL codestream signature.');
  let position = 16;
  const read = (count) => {
    check(position + count <= stream.length * 8, 'Truncated JPEG XL size header.');
    let value = 0;
    for (let bit = 0; bit < count; bit++, position++)
      value += ((stream[position >> 3] >> (position & 7)) & 1) * 2 ** bit;
    return value;
  };
  const small = read(1);
  const dimension = () => (small ? (read(5) + 1) * 8 : read([9, 13, 18, 30][read(2)]) + 1);
  const height = dimension(),
    ratio = read(3);
  const ratios = [
    [1, 1],
    [12, 10],
    [4, 3],
    [3, 2],
    [16, 9],
    [5, 4],
    [2, 1],
  ];
  const width = ratio
    ? Math.floor((height * ratios[ratio - 1][0]) / ratios[ratio - 1][1])
    : dimension();
  check(streamLength > Math.ceil(position / 8), 'Incomplete JPEG XL image header.');
  return { width, height };
}

function dimensions(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let width, height, extension;
  if (
    (bytes[0] === 0xff && bytes[1] === 0x0a) ||
    hex(bytes.subarray(0, 12)) === '0000000c4a584c200d0a870a'
  ) {
    ({ width, height } = jxlDimensions(bytes));
    extension = 'jxl';
  } else if (
    bytes.length >= 33 &&
    hex(bytes.subarray(0, 8)) === '89504e470d0a1a0a' &&
    ascii(bytes, 12, 4) === 'IHDR'
  ) {
    width = view.getUint32(16);
    height = view.getUint32(20);
    extension = 'png';
    let position = 8,
      ended = false,
      data = false;
    while (position + 12 <= bytes.length) {
      const length = view.getUint32(position);
      const type = ascii(bytes, position + 4, 4);
      check(position + length + 12 <= bytes.length && type !== 'acTL', 'Invalid or animated PNG.');
      if (position === 8) check(length === 13, 'Invalid PNG header.');
      if (type === 'IDAT') data = true;
      position += length + 12;
      if (type === 'IEND') {
        check(length === 0 && position === bytes.length, 'Invalid PNG ending.');
        ended = true;
        break;
      }
    }
    check(ended && data, 'Incomplete PNG.');
  } else if (bytes.length >= 20 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    check(bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9, 'Incomplete JPEG.');
    let pos = 2;
    while (pos + 3 < bytes.length) {
      check(bytes[pos++] === 0xff, 'Invalid JPEG.');
      while (bytes[pos] === 0xff) pos++;
      const marker = bytes[pos++];
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue;
      check(pos + 2 <= bytes.length, 'Invalid JPEG.');
      const length = view.getUint16(pos);
      check(length >= 2 && pos + length <= bytes.length, 'Invalid JPEG segment.');
      if (
        [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
          marker,
        )
      ) {
        check(length >= 8, 'Invalid JPEG frame.');
        height = view.getUint16(pos + 3);
        width = view.getUint16(pos + 5);
        extension = 'jpg';
        break;
      }
      pos += length;
    }
  } else if (bytes.length >= 30 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
    check(view.getUint32(4, true) + 8 === bytes.length, 'Invalid WebP container.');
    let position = 12,
      frame = false;
    while (position + 8 <= bytes.length) {
      const chunk = ascii(bytes, position, 4),
        length = view.getUint32(position + 4, true);
      check(
        position + 8 + length + (length % 2) <= bytes.length && !['ANIM', 'ANMF'].includes(chunk),
        'Invalid or animated WebP chunk.',
      );
      if (chunk === 'VP8 ' || chunk === 'VP8L') frame = true;
      position += 8 + length + (length % 2);
    }
    check(position === bytes.length && frame, 'Incomplete WebP.');
    const type = ascii(bytes, 12, 4);
    if (type === 'VP8X') {
      check(view.getUint32(16, true) === 10, 'Invalid WebP frame.');
      check(!(bytes[20] & 2), 'Animated images are not supported.');
      width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16);
      height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16);
    } else if (type === 'VP8 ' && bytes.length >= 30 && hex(bytes.subarray(23, 26)) === '9d012a') {
      width = view.getUint16(26, true) & 0x3fff;
      height = view.getUint16(28, true) & 0x3fff;
    } else if (type === 'VP8L' && bytes[20] === 0x2f) {
      const bits = view.getUint32(21, true);
      width = 1 + (bits & 0x3fff);
      height = 1 + ((bits >>> 14) & 0x3fff);
    }
    extension = 'webp';
  }
  check(
    width > 0 && height > 0 && width <= 20000 && height <= 20000 && width * height <= 100000000,
    'Use a valid JPEG, PNG, WebP or JPEG XL image (maximum 100 megapixels).',
  );
  return { width, height, extension };
}
function storageKey(key) {
  check(
    typeof key === 'string' &&
      key.length <= 500 &&
      /^(originals|derivatives|archives)\/[a-zA-Z0-9._/-]+$/.test(key) &&
      !key.split('/').some((part) => !part || part === '.' || part === '..'),
    'Invalid storage key.',
  );
  return key;
}
async function immutablePut(store, key, bytes, options = {}) {
  const result = await store.put(key, bytes, { ...options, onlyIf: { etagDoesNotMatch: '*' } });
  if (result) return;
  const existing = await store.get(key);
  check(
    existing && (await digest(await existing.arrayBuffer())) === (await digest(bytes)),
    'An immutable object already exists with different bytes.',
    409,
  );
}

async function upload(request, store) {
  const contentType = request.headers.get('content-type') ?? '';
  check(contentType.startsWith('multipart/form-data;'), 'Use multipart/form-data.', 415);
  const body = await readBytes(request.body, 36 * MiB);
  let form;
  try {
    form = await new Response(body, { headers: { 'content-type': contentType } }).formData();
  } catch {
    throw new Problem(400, 'Invalid multipart upload.');
  }
  let meta;
  try {
    meta = JSON.parse(form.get('meta'));
  } catch {
    throw new Problem(400, 'Invalid image metadata JSON.');
  }
  const image = { id: meta?.id ?? crypto.randomUUID(), ...metadata(meta) };
  check(typeof image.id === 'string' && slug.test(image.id), 'Invalid image ID.');
  const parts = {};
  for (const name of ['original', 'thumb', 'large']) {
    const file = form.get(name);
    check(file && typeof file.arrayBuffer === 'function' && file.size > 0, `Missing ${name} file.`);
    check(file.size <= (name === 'original' ? 25 : 5) * MiB, `${name} file is too large.`, 413);
    const bytes = new Uint8Array(await file.arrayBuffer());
    parts[name] = {
      bytes,
      ...(name === 'original' ? dimensions(bytes) : renditionDetails(bytes)),
      sha256: await digest(bytes),
    };
  }
  const original = parts.original;
  for (const [name, bound] of [
    ['thumb', 480],
    ['large', 2400],
  ]) {
    const part = parts[name];
    check(
      ['webp', 'png'].includes(part.extension) &&
        Math.max(part.width, part.height) <= bound &&
        Math.max(part.width, part.height) <= Math.max(original.width, original.height),
      `Invalid ${name} derivative dimensions or format.`,
    );
  }
  image.original = {
    key: `originals/${original.sha256}.${original.extension}`,
    sha256: original.sha256,
    extension: original.extension,
    width: original.width,
    height: original.height,
    bytes: original.bytes.length,
  };
  image.delivery = Object.fromEntries(
    ['thumb', 'large'].map((name) => [
      name,
      `derivatives/${original.sha256}/v1/${name}.${parts[name].extension}`,
    ]),
  );
  image.review = 'pending';
  image.history = [];
  for (const name of ['original', 'thumb', 'large']) {
    const part = parts[name];
    const options = {
      httpMetadata: { contentType: `image/${part.extension === 'jpg' ? 'jpeg' : part.extension}` },
      customMetadata: {
        sha256: part.sha256,
        width: String(part.width),
        height: String(part.height),
        extension: part.extension,
      },
    };
    if (name === 'original') await immutablePut(store, image.original.key, part.bytes, options);
    else {
      // Two browsers may encode the same master differently. Keep the first immutable rendition.
      const saved = await store.put(image.delivery[name], part.bytes, {
        ...options,
        onlyIf: { etagDoesNotMatch: '*' },
      });
      if (!saved) {
        const existing = await store.head(image.delivery[name]);
        check(
          existing?.customMetadata?.extension === part.extension &&
            Number(existing.customMetadata.width) > 0 &&
            Number(existing.customMetadata.height) > 0 &&
            Math.max(
              Number(existing.customMetadata.width),
              Number(existing.customMetadata.height),
            ) <= (name === 'thumb' ? 480 : 2400),
          'Stored derivative metadata is invalid.',
          409,
        );
      }
    }
  }
  const record = encoder.encode(JSON.stringify(image));
  await immutablePut(
    store,
    `archives/uploads/${image.id}/${original.sha256}/${crypto.randomUUID()}.json`,
    record,
    { httpMetadata: { contentType: 'application/json' } },
  );
  return json(image, 201);
}

const canonical = (value) =>
  JSON.stringify(value, (_, item) =>
    item && typeof item === 'object' && !Array.isArray(item)
      ? Object.fromEntries(
          Object.keys(item)
            .sort()
            .map((key) => [key, item[key]]),
        )
      : item,
  );
async function validateLibrary(input, old, store) {
  check(input && Array.isArray(input.models) && input.models.length <= 500, 'Invalid model list.');
  const previous = new Map(
    (old.models ?? []).flatMap((model) =>
      model.images.map((image) => [image.id, { model: model.id, image }]),
    ),
  );
  const ids = new Set(),
    modelIds = new Set();
  const models = [];
  for (const model of input.models) {
    check(
      model &&
        typeof model.id === 'string' &&
        model.id.length <= 200 &&
        /^[a-z0-9-]+\/[a-z0-9-]+$/.test(model.id) &&
        !modelIds.has(model.id),
      'Invalid or duplicate model ID.',
    );
    modelIds.add(model.id);
    const title = text(model.title, 'model title', 300, true);
    check(Array.isArray(model.images) && model.images.length <= 200, 'Invalid model image list.');
    const images = [];
    for (const candidate of model.images) {
      check(
        candidate &&
          typeof candidate.id === 'string' &&
          slug.test(candidate.id) &&
          !ids.has(candidate.id) &&
          ids.size < 2000,
        'Invalid or duplicate image ID.',
      );
      ids.add(candidate.id);
      const original = candidate.original;
      check(
        original &&
          hashPattern.test(original.sha256) &&
          ['jpg', 'png', 'webp', 'jxl'].includes(original.extension) &&
          original.key === `originals/${original.sha256}.${original.extension}` &&
          ['width', 'height', 'bytes'].every(
            (key) => Number.isSafeInteger(original[key]) && original[key] > 0,
          ),
        'Invalid original record.',
      );
      const delivery = candidate.delivery;
      check(
        delivery &&
          ['thumb', 'large'].every((name) =>
            ['webp', 'png'].some(
              (extension) =>
                delivery[name] === `derivatives/${original.sha256}/v1/${name}.${extension}`,
            ),
          ),
        'Invalid derivative keys.',
      );
      const history = candidate.history ?? [];
      check(
        Array.isArray(history) && history.length <= 100 && canonical(history).length < 100000,
        'Invalid image history.',
      );
      const existing = previous.get(candidate.id);
      if (existing) {
        check(
          existing.model === model.id &&
            canonical(existing.image.original) === canonical(original) &&
            canonical(existing.image.delivery) === canonical(delivery) &&
            canonical(existing.image.history ?? []) === canonical(history),
          'Existing image originals and history are immutable; upload a replacement with a new ID.',
          409,
        );
      } else {
        check(history.length === 0, 'New images cannot supply historical records.');
      }
      // Unchanged identities were validated when first saved. Avoid re-reading every object on
      // each metadata edit: a populated library would exceed the Worker's subrequest budget.
      if (!existing) {
        const master = await store.head(original.key);
        check(
          master &&
            master.size === original.bytes &&
            master.customMetadata?.sha256 === original.sha256 &&
            Number(master.customMetadata?.width) === original.width &&
            Number(master.customMetadata?.height) === original.height &&
            master.customMetadata?.extension === original.extension,
          'Original has not been uploaded or its metadata does not match.',
        );
        for (const [name, bound] of [
          ['thumb', 480],
          ['large', 2400],
        ]) {
          const part = await store.head(delivery[name]);
          check(
            part &&
              ['webp', 'png'].includes(part.customMetadata?.extension) &&
              delivery[name].endsWith(`.${part.customMetadata.extension}`) &&
              Number(part.customMetadata?.width) > 0 &&
              Number(part.customMetadata?.height) > 0 &&
              Math.max(Number(part.customMetadata.width), Number(part.customMetadata.height)) <=
                bound,
            'Derivative has not been uploaded or has invalid dimensions.',
          );
        }
      }
      check(
        ['pending', 'reviewed'].includes(candidate.review ?? 'pending'),
        'Invalid review status.',
      );
      images.push({
        id: candidate.id,
        ...metadata(candidate),
        original,
        delivery,
        review: candidate.review ?? 'pending',
        history,
      });
    }
    const heroImageId = model.heroImageId;
    check(
      heroImageId === undefined ||
        heroImageId === null ||
        (typeof heroImageId === 'string' && images.some((image) => image.id === heroImageId)),
      'Hero image must belong to this model; clear the hero before removing its image.',
    );
    models.push({
      id: model.id,
      title,
      images,
      ...(heroImageId === undefined ? {} : { heroImageId }),
    });
  }
  return models;
}

async function libraryObject(store) {
  const object = await store.get('library.json');
  if (!object) return { object: null, library: { revision: null, models: [] } };
  return { object, library: JSON.parse(await object.text()) };
}
async function api(request, url, store, publicStore) {
  check(store, 'Image storage is not configured.', 503);
  if (url.pathname === '/admin/api/publication' && request.method === 'GET')
    return json((await publicationObject(publicStore)).snapshot);
  if (url.pathname === '/admin/api/publish' && request.method === 'POST')
    return json(await publishModel(await readJSON(request, 8192), store, publicStore));
  if (url.pathname === '/admin/api/file' && ['GET', 'HEAD'].includes(request.method)) {
    const key = storageKey(url.searchParams.get('key'));
    const object = await store.get(key);
    check(object, 'File not found.', 404);
    return new Response(request.method === 'HEAD' ? null : object.body, {
      headers: {
        'content-type': object.httpMetadata?.contentType ?? 'application/octet-stream',
        'content-length': String(object.size),
      },
    });
  }
  if (url.pathname === '/admin/api/upload' && request.method === 'POST')
    return upload(request, store);
  if (url.pathname === '/admin/api/library' || url.pathname === '/admin/api/export') {
    const { object, library } = await libraryObject(store);
    if (request.method === 'GET')
      return json(
        library,
        200,
        url.pathname.endsWith('/export')
          ? { 'content-disposition': 'attachment; filename="product-image-library.json"' }
          : {},
      );
    if (request.method === 'PUT' && url.pathname.endsWith('/library')) {
      const input = await readJSON(request);
      check(input?.revision === library.revision, 'Library changed. Reload before saving.', 409);
      const models = await validateLibrary(input, library, store);
      const next = { revision: crypto.randomUUID(), models };
      if (object)
        await immutablePut(
          store,
          `archives/library/${library.revision}.json`,
          encoder.encode(JSON.stringify(library)),
          { httpMetadata: { contentType: 'application/json' } },
        );
      const saved = await store.put('library.json', JSON.stringify(next), {
        httpMetadata: { contentType: 'application/json' },
        onlyIf: object ? { etagMatches: object.etag } : { etagDoesNotMatch: '*' },
      });
      check(saved, 'Library changed. Reload before saving.', 409);
      return json(next);
    }
  }
  throw new Problem(404, 'Unknown image API endpoint or method.');
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/')
    return new Response(null, { status: 302, headers: { location: PREFIX } });
  if (url.pathname === IMAGE_PREFIX.slice(0, -1))
    return new Response(null, {
      status: 302,
      headers: { location: IMAGE_PREFIX + url.search },
    });
  const prefix = url.pathname.startsWith(IMAGE_PREFIX) ? IMAGE_PREFIX : PREFIX;
  check(url.pathname.startsWith(prefix), 'Not found.', 404);
  // Keep one internal API namespace while each browser mount retains its own URLs.
  url.pathname = PREFIX + url.pathname.slice(prefix.length);
  check(
    typeof env.ADMIN_REVIEW_SECRET === 'string' && env.ADMIN_REVIEW_SECRET.length >= 32,
    'Review access is not configured.',
    503,
  );
  if (!['GET', 'HEAD'].includes(request.method)) {
    check(
      request.headers.get('origin') === url.origin &&
        request.headers.get('sec-fetch-site') !== 'cross-site',
      'A same-origin request is required.',
      403,
    );
  }
  if (url.pathname === '/admin/session' && request.method === 'POST') {
    const input = await readJSON(request, 8192);
    check(
      typeof input?.secret === 'string' &&
        input.secret.length <= 4096 &&
        equal(
          encoder.encode(await digest(encoder.encode(input.secret))),
          encoder.encode(await digest(encoder.encode(env.ADMIN_REVIEW_SECRET))),
        ),
      'Access key was not accepted.',
      401,
    );
    const payload = `${Math.floor(Date.now() / 1000) + TTL}.${crypto.randomUUID().replaceAll('-', '')}`;
    return json({ authenticated: true }, 200, {
      'set-cookie': cookie(`${payload}.${await sign(payload, env.ADMIN_REVIEW_SECRET)}`, TTL),
    });
  }
  if (!(await authenticated(request, env.ADMIN_REVIEW_SECRET))) {
    if (
      request.method === 'GET' &&
      !url.pathname.startsWith('/admin/api/') &&
      (request.headers.get('sec-fetch-dest') === 'document' ||
        request.headers.get('accept')?.includes('text/html'))
    )
      return loginPage(prefix);
    throw new Problem(401, 'Sign in to review images.');
  }
  if (url.pathname === '/admin/session' && request.method === 'DELETE')
    return json({ authenticated: false }, 200, { 'set-cookie': cookie('', 0) });
  if (url.pathname.startsWith('/admin/api/'))
    return api(request, url, env.IMAGE_STORE, env.PUBLIC_IMAGES);
  check(['GET', 'HEAD'].includes(request.method), 'Method not allowed.', 405);
  check(env.ASSETS, 'Review assets are not configured.', 503);
  url.pathname = url.pathname === PREFIX ? '/index.html' : url.pathname.slice('/admin'.length);
  return env.ASSETS.fetch(new Request(url, request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // A terminal route wildcard also matches prefix lookalikes. Preserve the
    // existing Custom Domain response outside the exact image-manager boundary.
    if (
      url.hostname === 'panel-assistant.io' &&
      url.pathname !== IMAGE_PREFIX.slice(0, -1) &&
      !url.pathname.startsWith(IMAGE_PREFIX)
    )
      return fetch(request);
    let response;
    try {
      response = await handle(request, env);
    } catch (error) {
      const known = error instanceof Problem || error instanceof PublicationError;
      response = json(
        {
          error: known ? error.message : 'The review request could not be completed.',
        },
        known ? error.status : 500,
      );
    }
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(security)) headers.set(key, value);
    if (!headers.has('content-security-policy'))
      headers.set(
        'content-security-policy',
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'self'; form-action 'self'",
      );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
