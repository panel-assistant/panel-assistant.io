// Build-time publication only; installed clients still authenticate downloaded assets.
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const API = 'https://api.github.com/repos/panel-assistant/android/releases';
const MAX_CATALOGUE = 1024 * 1024;

async function readResponse(response) {
  // GitHub includes release notes and other metadata that never enter the catalogue.
  const limit = 8 * MAX_CATALOGUE;
  let size = 0;
  const chunks = [];
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > limit) throw new Error('Release API response exceeds 8 MiB');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function minimalRelease(value) {
  if (
    !value ||
    typeof value.tag_name !== 'string' ||
    !value.tag_name ||
    value.draft !== false ||
    typeof value.prerelease !== 'boolean' ||
    !Array.isArray(value.assets) ||
    value.assets.length > 128
  )
    throw new Error('Malformed release');
  const names = new Set();
  const assets = value.assets.map((asset) => {
    if (
      !asset ||
      typeof asset.name !== 'string' ||
      !asset.name ||
      names.has(asset.name) ||
      typeof asset.browser_download_url !== 'string' ||
      !asset.browser_download_url.startsWith('https://github.com/')
    )
      throw new Error('Malformed or duplicate release asset');
    names.add(asset.name);
    return { name: asset.name, browser_download_url: asset.browser_download_url };
  });
  const result = { tag_name: value.tag_name, draft: false, prerelease: value.prerelease, assets };
  if (Buffer.byteLength(JSON.stringify(result)) > 256 * 1024) {
    throw new Error('Release exceeds 256 KiB');
  }
  return result;
}

export async function generate({
  fetchImpl = fetch,
  output = new URL('../../public/releases/v1.json', import.meta.url),
  token = process.env.GITHUB_TOKEN,
  expectedTag = process.env.EXPECTED_RELEASE_TAG,
} = {}) {
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const request = async (url, allowMissing = false) => {
    const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(30_000) });
    if (allowMissing && response.status === 404) return undefined;
    if (!response.ok) throw new Error(`Release API returned HTTP ${response.status}`);
    return readResponse(response);
  };
  const [latestValue, recent] = await Promise.all([
    request(`${API}/latest`, true),
    request(`${API}?per_page=30`),
  ]);
  if (!Array.isArray(recent) || recent.length > 30) throw new Error('Malformed release list');
  const latest = latestValue === undefined ? null : minimalRelease(latestValue);
  if (latest?.prerelease) throw new Error('Latest stable release is a prerelease');
  const releases = recent.map(minimalRelease);
  if (new Set(releases.map((release) => release.tag_name)).size !== releases.length) {
    throw new Error('Duplicate release tags');
  }
  if (expectedTag) {
    const release = [latest, ...releases].find((release) => release?.tag_name === expectedTag);
    if (!release) throw new Error('Requested release tag is absent');
    const apk = `panel-assistant-${expectedTag}-manual-setup-required.apk.bin`;
    const required = [apk, `${apk}.idsig`, `${apk}.sha256`, `${apk}.sha256.sig`];
    for (const kind of ['install', 'protocol']) {
      required.push(
        `ha-paneld-${expectedTag}-${kind}.json`,
        `ha-paneld-${expectedTag}-${kind}.json.sig`,
      );
    }
    const names = new Set(release.assets.map((asset) => asset.name));
    if (required.some((name) => !names.has(name)))
      throw new Error('Requested release assets incomplete');
  }
  const json = JSON.stringify({ schema: 1, latest, releases }) + '\n';
  if (Buffer.byteLength(json) > MAX_CATALOGUE) throw new Error('Release catalogue exceeds 1 MiB');
  const target = output instanceof URL ? output : pathToFileURL(output);
  await mkdir(new URL('.', target), { recursive: true });
  const temporary = new URL(`${target.pathname}.tmp`, target);
  await writeFile(temporary, json);
  await rename(temporary, target);
  console.log(
    `Published release catalogue: ${releases.length} recent, stable ${latest?.tag_name ?? 'none'}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generate();
}
