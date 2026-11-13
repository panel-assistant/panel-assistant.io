// GitHub repository writers receive opaque, revocable sessions in private storage.
const COOKIE = '__Host-image-session';
const SESSION_SECONDS = 8 * 60 * 60;
const REMEMBER_SECONDS = 30 * 24 * 60 * 60;
const AUTHORIZATION_SECONDS = 5 * 60;
const REPOSITORY = 'panel-assistant/panel-assistant.io';

export class ImageAuthError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
const check = (condition, message, status = 401) => {
  if (!condition) throw new ImageAuthError(message, status);
};
const now = () => Math.floor(Date.now() / 1000);
const sessionId = (request) => {
  const value = request.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  return /^[a-f0-9]{64}$/.test(value ?? '') ? value : null;
};
const sessionKey = async (id) => {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
  return `sessions/${[...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}.json`;
};
export const imageSessionCookie = (id, age) =>
  `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
export const sessionDetails = (session) => ({
  authenticated: true,
  login: session.login,
  expiresAt: new Date(session.expiresAt * 1000).toISOString(),
  remembered: session.remembered,
});

async function github(path, token) {
  let response, body;
  try {
    response = await fetch(`https://api.github.com${path}`, {
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'user-agent': 'Panel-Assistant-image-manager',
        'x-github-api-version': '2022-11-28',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(10000),
    });
    body = await response.json();
  } catch {
    throw new ImageAuthError('GitHub could not be reached. Try signing in again shortly.', 503);
  }
  check(
    response.status !== 429 &&
      !(
        response.status === 403 &&
        (response.headers.get('x-ratelimit-remaining') === '0' ||
          response.headers.has('retry-after') ||
          /rate limit|abuse detection/i.test(body?.message ?? ''))
      ),
    'GitHub is temporarily limiting sign-in requests. Try again shortly.',
    503,
  );
  check(response.status !== 401, 'GitHub sign-in expired. Sign in again.', 401);
  check(![403, 404].includes(response.status), `Write access to ${REPOSITORY} is required.`, 403);
  check(response.ok, 'GitHub authorization is temporarily unavailable. Try again shortly.', 503);
  return body;
}

async function authorize(token) {
  const user = await github('/user', token);
  check(
    Number.isSafeInteger(user?.id) &&
      user.id > 0 &&
      typeof user.login === 'string' &&
      /^[a-z\d][a-z\d-]{0,38}$/i.test(user.login),
    'GitHub returned an invalid identity. Try signing in again.',
    503,
  );
  const repository = await github(`/repos/${REPOSITORY}`, token);
  check(repository?.permissions?.push === true, `Write access to ${REPOSITORY} is required.`, 403);
  return { userId: user.id, login: user.login };
}

export async function createSession(input, store) {
  check(
    typeof input?.token === 'string' &&
      input.token.length > 0 &&
      input.token.length <= 4096 &&
      /^[\x21-\x7e]+$/.test(input.token),
    'Sign in with GitHub to manage images.',
    401,
  );
  check(
    input.remember === undefined || typeof input.remember === 'boolean',
    'Choose whether to remember this device.',
    400,
  );
  const identity = await authorize(input.token);
  const remembered = input.remember === true;
  const age = remembered ? REMEMBER_SECONDS : SESSION_SECONDS;
  const record = {
    ...identity,
    token: input.token,
    remembered,
    expiresAt: now() + age,
    checkedAt: now(),
  };
  const id = [...crypto.getRandomValues(new Uint8Array(32))]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  check(
    await store.put(await sessionKey(id), JSON.stringify(record), {
      httpMetadata: { contentType: 'application/json' },
      onlyIf: { etagDoesNotMatch: '*' },
    }),
    'The sign-in session could not be stored. Try again.',
    503,
  );
  return { details: sessionDetails(record), cookie: imageSessionCookie(id, age) };
}

export async function readSession(request, store) {
  const id = sessionId(request);
  if (!id) return null;
  const key = await sessionKey(id);
  const object = await store.get(key);
  if (!object) return null;
  const record = JSON.parse(await object.text());
  if (!Number.isSafeInteger(record.expiresAt) || record.expiresAt <= now()) {
    await store.delete(key);
    return null;
  }
  check(
    typeof record.token === 'string' &&
      typeof record.login === 'string' &&
      Number.isSafeInteger(record.userId) &&
      Number.isSafeInteger(record.checkedAt) &&
      typeof record.remembered === 'boolean',
    'The sign-in session could not be read. Sign in again.',
    503,
  );
  if (record.checkedAt > now() || now() - record.checkedAt >= AUTHORIZATION_SECONDS) {
    let identity;
    try {
      identity = await authorize(record.token);
      check(identity.userId === record.userId, 'GitHub identity changed. Sign in again.', 401);
    } catch (error) {
      if (error instanceof ImageAuthError && [401, 403].includes(error.status))
        await store.delete(key);
      throw error;
    }
    if (record.expiresAt <= now()) {
      await store.delete(key);
      return null;
    }
    const refreshed = { ...record, ...identity, checkedAt: now() };
    // Logout may delete the record while GitHub is responding. Never recreate it.
    const saved = await store.put(key, JSON.stringify(refreshed), {
      httpMetadata: { contentType: 'application/json' },
      onlyIf: { etagMatches: object.etag },
    });
    if (!saved) {
      // A concurrent refresh may have won; reread once without recreating a logged-out session.
      const current = await store.get(key);
      if (!current) return null;
      const latest = JSON.parse(await current.text());
      return latest.userId === record.userId &&
        latest.token === record.token &&
        latest.expiresAt === record.expiresAt &&
        latest.remembered === record.remembered &&
        typeof latest.login === 'string' &&
        Number.isSafeInteger(latest.checkedAt) &&
        latest.expiresAt > now() &&
        latest.checkedAt <= now() &&
        now() - latest.checkedAt < AUTHORIZATION_SECONDS
        ? latest
        : null;
    }
    return refreshed;
  }
  return record;
}

export async function deleteSession(request, store) {
  const id = sessionId(request);
  if (id) await store.delete(await sessionKey(id));
}
