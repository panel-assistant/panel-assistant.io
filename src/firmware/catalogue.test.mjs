import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = new URL('../..', import.meta.url).pathname;
const source = join(root, 'tools/firmware-index');
const dist = join(root, 'dist/hardware/firmware/builds');
const slug = (version) => `v${version.replaceAll('.', '-').toLowerCase()}`;
const read = (path) => readFileSync(path, 'utf8');

function sonoffVersions(file) {
  const versions = new Map();
  for (const line of read(join(source, file)).split('\n')) {
    if (!/^(full|diff|apk)\|/.test(line)) continue;
    const [type, version, , ...objects] = line.split('|');
    versions.set(version, (versions.get(version) ?? 0) + (type === 'diff' ? objects.length : 1));
  }
  return versions;
}

function shellyVersions(track) {
  const versions = new Map();
  for (const line of read(join(source, 'fw-shelly-walldisplay.dat')).split('\n')) {
    if (!line.startsWith(`${track}|`)) continue;
    const version = line.split('|')[1];
    versions.set(version, (versions.get(version) ?? 0) + 1);
  }
  return versions;
}

const models = [
  ['sonoff-nspanel-pro-86p', sonoffVersions('fw-86p.dat')],
  ['sonoff-nspanel-pro-120p', sonoffVersions('fw-120p.dat')],
  ['shelly-wall-display', shellyVersions('WallDisplay')],
  ['shelly-wall-display-x2', shellyVersions('WallDisplay')],
  ['shelly-wall-display-x1i', shellyVersions('WallDisplayV2')],
  ['shelly-wall-display-x2i', shellyVersions('WallDisplayV2')],
  ['shelly-wall-display-xl', shellyVersions('WallDisplayV2')],
];

test('built catalogue exposes every source build under each documented model', () => {
  const catalogue = read(join(dist, 'index.html'));
  let pages = 0;
  for (const [model, versions] of models) {
    const modelPage = join(dist, model, 'index.html');
    assert.ok(existsSync(modelPage), `${model} page missing`);
    const modelHtml = read(modelPage);
    assert.match(catalogue, new RegExp(`/hardware/firmware/builds/${model}/`));
    for (const [version, objects] of versions) {
      const target = join(dist, model, slug(version), 'index.html');
      assert.ok(existsSync(target), `${model} ${version} page missing`);
      assert.ok(modelHtml.includes(`/hardware/firmware/builds/${model}/${slug(version)}/`));
      const page = read(target);
      assert.equal(
        (page.match(/<h2 id="(?!starlight__|comments-heading)[^"]+"/g) ?? []).length,
        objects,
        `${model} ${version} lost objects`,
      );
      assert.match(page, /Full availability history/);
      assert.match(page, /Archive:/);
      pages++;
    }
  }
  assert.ok(pages > 50, 'catalogue unexpectedly small');
});

test('built version pages carry the source downloads, capture links and older checks', () => {
  const sonoff = read(join(dist, 'sonoff-nspanel-pro-120p/v4-8-4/index.html'));
  assert.match(sonoff, /nspanel-pro-ver120\/apk\/75\/228V4\.8\.4\.apk/);
  assert.match(sonoff, /web\.archive\.org\/web\/\d{14}\//);

  const shellyRow = read(join(source, 'fw-shelly-walldisplay.dat'))
    .split('\n')
    .find((line) => line.startsWith('WallDisplayV2|2.7.4|'));
  assert.ok(shellyRow);
  const [, , , , , cdn, capture] = shellyRow.split('|');
  const shelly = read(join(dist, 'shelly-wall-display-x2i/v2-7-4/index.html'));
  assert.ok(shelly.includes(cdn));
  assert.ok(shelly.includes(`web/${capture}/`));

  const older = read(join(dist, 'sonoff-nspanel-pro-86p/v4-8-0/index.html'));
  assert.match(older, /2026-08:/);
  assert.match(older, /2026-09:/);
});

test('built catalogue compares download sizes and observed availability dates', () => {
  const catalogue = read(join(dist, 'index.html'));
  assert.equal((catalogue.match(/<table>/g) ?? []).length, models.length + 7);
  const downloads = models.reduce(
    (sum, [, versions]) => sum + [...versions.values()].reduce((count, value) => count + value, 0),
    0,
  );
  assert.equal((catalogue.match(/<tr>/g) ?? []).length, downloads + models.length + 14);
  assert.match(catalogue, /<th[^>]*>Size<\/th>/);
  assert.match(catalogue, /<th[^>]*>First seen<\/th>/);
  assert.match(catalogue, /<th[^>]*>Last seen<\/th>/);
  assert.ok(
    /v4-8-0\/[^<]*<\/a><\/td>\s*<td>Diff from 4\.0\.12<\/td>\s*<td[^>]*>223\.5 MiB<\/td>\s*<td>2026-08-20<\/td>\s*<td>\d{4}-\d\d-\d\d<\/td>/.test(
      catalogue,
    ),
    '86P diff row lost its size or successful-check dates',
  );
  const model = read(join(dist, 'sonoff-nspanel-pro-86p/index.html'));
  assert.match(model, /<th[^>]*>First seen<\/th>/);
  assert.match(model, /<th[^>]*>Last seen<\/th>/);
});

test('built catalogue presents Shelly models before the longer Sonoff histories', () => {
  const catalogue = read(join(dist, 'index.html'));
  const headings = [...catalogue.matchAll(/<h2 id="(shelly-[^"]+|sonoff-[^"]+)"/g)].map(
    ([, slug]) => slug,
  );
  assert.deepEqual(headings, [
    'shelly-wall-display',
    'shelly-wall-display-x2',
    'shelly-wall-display-x1i',
    'shelly-wall-display-x2i',
    'shelly-wall-display-xl',
    'sonoff-nspanel-pro-86p',
    'sonoff-nspanel-pro-120p',
  ]);
});

test('Meta retail models expose verified build metadata without private download links', () => {
  const catalogue = read(join(dist, 'index.html'));
  const expected = [
    ['meta-portal-10-gen1', '1041515800015050', '1,282,501,712', '9', 28],
    ['meta-portal-plus-gen1', '1041515800015050', '1,282,501,712', '9', 28],
    ['meta-portal-10-gen2', '3051355900018050', '1,243,273,978', '10', 29],
    ['meta-portal-mini-8', '3051355900018050', '1,243,273,978', '10', 29],
    ['meta-portal-tv', '2041515800015050', '1,296,331,187', '9', 28],
    ['meta-portal-go', '5051355900018050', '1,216,232,994', '10', 29],
    ['meta-portal-plus-gen2', '4051355900018050', '1,216,856,452', '10', 29],
  ];
  for (const [model, version, bytes, android, sdk] of expected) {
    assert.ok(catalogue.includes(`/hardware/firmware/builds/${model}/`));
    const modelPage = read(join(dist, model, 'index.html'));
    assert.ok(modelPage.includes(`/hardware/firmware/builds/${model}/${slug(version)}/`));
    const page = read(join(dist, model, slug(version), 'index.html'));
    assert.ok(page.includes(`${bytes} bytes`));
    assert.ok(page.includes(`Android: ${android} (SDK ${sdk})`));
    assert.match(page, /SHA-256: <code[^>]*>[a-f0-9]{64}<\/code>/);
    assert.match(page, /No public download URL or confirmed Internet Archive capture is recorded/);
    assert.match(page, /not a cross-model installation test/);
    assert.doesNotMatch(
      page,
      /drive\.google|gdrive:|fbcdn|access_token|Original vendor URL|web\.archive\.org/,
    );
  }
});
