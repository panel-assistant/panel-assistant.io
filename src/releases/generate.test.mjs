import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate } from './generate.mjs';

const tag = 'v1.0.0';
const apk = `panel-assistant-${tag}-manual-setup-required.apk.bin`;
const names = [
  apk,
  `${apk}.idsig`,
  `${apk}.sha256`,
  `${apk}.sha256.sig`,
  ...['install', 'protocol'].flatMap((kind) => [
    `ha-paneld-${tag}-${kind}.json`,
    `ha-paneld-${tag}-${kind}.json.sig`,
  ]),
];
const release = (tag_name = tag) => ({
  tag_name,
  draft: false,
  prerelease: false,
  body: 'private prose never published',
  assets: names.map((name) => ({
    name,
    browser_download_url: `https://github.com/panel-assistant/android/releases/download/${tag_name}/${name}`,
    label: 'omit',
  })),
});
async function run(t, latest, recent, options = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'release-catalogue-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const output = join(dir, 'v1.json');
  const summariesOutput = join(dir, 'summaries-v1.json');
  await writeFile(output, 'previous valid catalogue');
  const fetchImpl = async (url, init) => {
    assert.equal(new URL(url).hostname, 'api.github.com');
    assert.equal(init.headers.Authorization, 'Bearer fixture-token');
    const value = url.endsWith('/latest') ? latest : recent;
    if (value instanceof Error) throw value;
    return value instanceof Response ? value : Response.json(value);
  };
  return {
    output,
    summariesOutput,
    execute: () =>
      generate({ output, summariesOutput, fetchImpl, token: 'fixture-token', ...options }),
  };
}

test('publishes minimal stable independently of recent prereleases without metadata prose', async (t) => {
  const fixture = await run(t, release(), [{ ...release('v2.0.0-rc1'), prerelease: true }]);
  await fixture.execute();
  const result = JSON.parse(await readFile(fixture.output));
  assert.deepEqual(Object.keys(result), ['schema', 'latest', 'releases']);
  assert.equal(result.latest.tag_name, tag);
  assert.equal(result.releases[0].prerelease, true);
  assert.deepEqual(Object.keys(result.latest), ['tag_name', 'draft', 'prerelease', 'assets']);
  assert.deepEqual(Object.keys(result.latest.assets[0]), ['name', 'browser_download_url']);
});

test('404 latest permits a prerelease-only catalogue', async (t) => {
  const fixture = await run(t, new Response('', { status: 404 }), [
    { ...release(), prerelease: true },
  ]);
  await fixture.execute();
  assert.equal(JSON.parse(await readFile(fixture.output)).latest, null);
});

test('dispatch tag must be present with every authenticated install asset', async (t) => {
  for (const value of [
    [],
    ...names.map((name) => [
      { ...release(), assets: release().assets.filter((asset) => asset.name !== name) },
    ]),
  ]) {
    const fixture = await run(t, new Response('', { status: 404 }), value, { expectedTag: tag });
    await assert.rejects(fixture.execute);
    assert.equal(await readFile(fixture.output, 'utf8'), 'previous valid catalogue');
  }
  const fixture = await run(t, release(), [], { expectedTag: tag });
  await fixture.execute();
});

test('network, HTTP and malformed or oversized data fail without publishing empty or stale data', async (t) => {
  const invalid = [
    new Error('offline'),
    new Response('', { status: 403 }),
    {},
    Array(31).fill(release()),
    [{ ...release(), draft: true }],
    [{ ...release(), assets: Array(129).fill(release().assets[0]) }],
    [{ ...release(), tag_name: 'x'.repeat(256 * 1024) }],
    [{ ...release(), assets: [{ name: 'bad', browser_download_url: 'javascript:bad' }] }],
    new Response(' '.repeat(8 * 1024 * 1024 + 1)),
  ];
  for (const recent of invalid) {
    const fixture = await run(t, release(), recent);
    await assert.rejects(fixture.execute);
    assert.equal(await readFile(fixture.output, 'utf8'), 'previous valid catalogue');
  }
});

test('the complete minimized catalogue is bounded to one MiB', async (t) => {
  const big = release();
  big.assets = Array.from({ length: 128 }, (_, i) => ({
    name: `${i}-${'x'.repeat(900)}`,
    browser_download_url: `https://github.com/${'x'.repeat(900)}`,
  }));
  const fixture = await run(
    t,
    new Response('', { status: 404 }),
    Array.from({ length: 5 }, (_, i) => ({ ...big, tag_name: `v${i}` })),
  );
  await assert.rejects(fixture.execute);
});

test('short release bodies are published as summaries apart from the catalogue; long ones are left out', async (t) => {
  const short = {
    ...release('v1.0.1'),
    body: 'Faster panels.\r\n\n[Full release notes](https://panel-assistant.io/go/release-notes)',
  };
  const long = {
    ...release('v1.0.0'),
    body: 'panel-assistant.io/go/release-notes ' + 'x'.repeat(2049),
  };
  const boilerplate = {
    ...release('v0.9.11'),
    body: '## Installation\n\nInstall through Panel Assistant.',
  };
  const released = {
    ...release('v1.0.2'),
    body:
      '## Installation\n\nInstall and update the panel app through Panel Assistant.\n\n' +
      'Quicker updates.\n\n[Full release notes](https://panel-assistant.io/go/release-notes)',
  };
  const { output, summariesOutput, execute } = await run(t, long, [
    released,
    short,
    long,
    boilerplate,
  ]);
  await execute();
  assert.deepEqual(JSON.parse(await readFile(summariesOutput, 'utf8')), {
    schema: 1,
    summaries: {
      'v1.0.2':
        'Quicker updates.\n\n[Full release notes](https://panel-assistant.io/go/release-notes)',
      'v1.0.1':
        'Faster panels.\n\n[Full release notes](https://panel-assistant.io/go/release-notes)',
    },
  });
  assert.doesNotMatch(await readFile(output, 'utf8'), /Faster panels/);
});
