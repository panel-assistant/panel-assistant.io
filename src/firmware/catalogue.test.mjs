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
  const notes = JSON.parse(read(join(source, 'shelly-release-notes.json')));
  for (const version of Object.keys(notes)) if (!versions.has(version)) versions.set(version, 0);
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
      if (objects) {
        assert.match(page, /Full availability history/);
        assert.match(page, /Archive:/);
      } else {
        assert.match(page, /No firmware package has been indexed/);
        assert.doesNotMatch(page, /Original vendor URL/);
      }
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
  assert.equal((catalogue.match(/<table>/g) ?? []).length, models.length + 8);
  const downloads = models.reduce(
    (sum, [, versions]) =>
      sum + [...versions.values()].reduce((count, value) => count + Math.max(1, value), 0),
    0,
  );
  assert.equal((catalogue.match(/<tr>/g) ?? []).length, downloads + models.length + 20);
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

test('Meta retail models expose build metadata, original vendor URLs and archive copies', () => {
  const catalogue = read(join(dist, 'index.html'));
  const metadata = JSON.parse(read(join(source, 'fw-meta-portal.json')));
  const expected = [
    ['meta-portal-10-gen1', '1041515800015050', '1,282,501,712', '9', 28],
    ['meta-portal-plus-gen1', '1041515800015050', '1,282,501,712', '9', 28],
    ['meta-portal-10-gen2', '3051355900018050', '1,243,273,978', '10', 29],
    ['meta-portal-mini-8', '3051355900018050', '1,243,273,978', '10', 29],
    ['meta-portal-tv', '2041515800015050', '1,296,331,187', '9', 28],
    ['meta-portal-go', '5051355900018050', '1,216,232,994', '10', 29],
    ['meta-portal-plus-gen2', '4051355900018050', '1,216,856,452', '10', 29],
  ];
  assert.match(catalogue, /Meta Portal package metadata is checked manually/);
  const buildTimes = {
    1041515800015050: '18:27:50',
    3051355900018050: '18:27:46',
    2041515800015050: '18:26:17',
    5051355900018050: '18:29:24',
    4051355900018050: '18:27:28',
  };
  for (const [model, version, bytes, android, sdk] of expected) {
    assert.ok(catalogue.includes(`/hardware/firmware/builds/${model}/`));
    const modelPage = read(join(dist, model, 'index.html'));
    assert.ok(modelPage.includes(`/hardware/firmware/builds/${model}/${slug(version)}/`));
    const page = read(join(dist, model, slug(version), 'index.html'));
    assert.ok(page.includes(`Build date (UTC): 2025-10-14 ${buildTimes[version]}`));
    assert.match(page, /the release date is not established/);
    assert.ok(page.includes(`${bytes} bytes`));
    assert.ok(page.includes(`Android: ${android} (SDK ${sdk})`));
    assert.match(page, /SHA-256: <code[^>]*>[a-f0-9]{64}<\/code>/);
    const family = metadata.models.find((item) => item.slug === model).family;
    const archive = metadata.families[family].archiveUrl;
    const href = `href="${archive.replaceAll('&', '&amp;')}"`;
    assert.ok(page.includes(href), `${model} build lost its archive download`);
    assert.ok(modelPage.includes(href), `${model} index lost its archive download`);
    assert.ok(catalogue.includes(href), `${model} catalogue lost its archive download`);
    const original = archive.slice(archive.indexOf('https://', 1));
    const originalHref = `href="${original.replaceAll('&', '&amp;')}"`;
    for (const [surface, html] of [
      ['build', page],
      ['index', modelPage],
      ['catalogue', catalogue],
    ]) {
      assert.ok(html.includes(originalHref), `${model} ${surface} lost its original vendor URL`);
      assert.ok(
        html.indexOf(originalHref) < html.indexOf(href),
        `${model} ${surface} must show the vendor before its archive`,
      );
    }
    assert.match(page, /Original Meta download URLs are signed CDN links and can expire/);
    assert.doesNotMatch(page, /No public download URL or confirmed Internet Archive capture/);
    assert.match(page, /not a cross-model installation test/);
    assert.doesNotMatch(page, /drive\.google|gdrive:|access_token/);
  }
});

test('every Shelly release displays its original summary and pinned vendor and confirmed archive links', () => {
  const notes = JSON.parse(read(join(source, 'shelly-release-notes.json')));
  const hardware = read(join(root, 'dist/hardware/panels/shelly/index.html'));
  const catalogue = read(join(dist, 'index.html'));
  assert.ok(Object.keys(notes).length >= 27);
  for (const [version, note] of Object.entries(notes)) {
    const page = `https://github.com/ShellyGroup/Wall-Display-Changelog/blob/${note.commit}/README.md`;
    const anchor = `#${version.replaceAll('.', '')}`;
    for (const [model] of models.filter(([name]) => name.startsWith('shelly-'))) {
      const versionHtml = read(join(dist, model, slug(version), 'index.html'));
      const modelHtml = read(join(dist, model, 'index.html'));
      for (const html of [versionHtml, modelHtml, catalogue, hardware]) {
        assert.ok(html.includes(note.summary), `${model} ${version} summary missing`);
        assert.ok(
          html.includes(`href="${page}${anchor}"`),
          `${model} ${version} vendor permalink missing`,
        );
        if (note.wayback_ts) {
          assert.ok(
            html.includes(`href="https://web.archive.org/web/${note.wayback_ts}/${page}${anchor}"`),
          );
        } else {
          assert.match(html, /Archived copy pending/);
          assert.ok(!html.includes(`web/undefined/${page}`));
        }
      }
      const raw = `https://raw.githubusercontent.com/ShellyGroup/Wall-Display-Changelog/${note.commit}/README.md`;
      assert.ok(versionHtml.includes(`href="${raw}"`));
      if (note.raw_wayback_ts) assert.ok(versionHtml.includes(`web/${note.raw_wayback_ts}/${raw}`));
      else assert.match(versionHtml, /Source file capture pending/);
    }
  }
});

test('every firmware family exposes vendor notes or an explicit search outcome', () => {
  const notes = JSON.parse(read(join(source, 'vendor-release-notes.json')));
  const catalogue = read(join(dist, 'index.html'));
  for (const [model, versions] of models.filter(([name]) => name.startsWith('sonoff-'))) {
    const modelHtml = read(join(dist, model, 'index.html'));
    assert.match(modelHtml, /Release notes/);
    for (const version of versions.keys()) {
      const note = notes.sonoff.supplements[version] ?? notes.sonoff.versions[version];
      const url = note?.url ?? notes.sonoff.url;
      for (const html of [
        catalogue,
        modelHtml,
        read(join(dist, model, slug(version), 'index.html')),
      ]) {
        assert.ok(html.includes(`href="${url}"`), `${model} ${version} lost the vendor source`);
        assert.ok(html.includes(note?.summary ?? notes.sonoff.notice));
        if (note?.wayback_ts) assert.ok(html.includes(`web/${note.wayback_ts}/${url}`));
      }
    }
  }
  const metadata = JSON.parse(read(join(source, 'fw-meta-portal.json')));
  for (const model of metadata.models) {
    const version = metadata.families[model.family].version;
    for (const html of [
      catalogue,
      read(join(dist, model.slug, 'index.html')),
      read(join(dist, model.slug, slug(version), 'index.html')),
    ])
      assert.ok(html.includes(notes.meta.notice), `${model.slug} has an unexplained notes gap`);
  }
  const reports = {
    'smatek-s9e': 'smatek/s9e',
    'electron-wf2489t': 'electron/wf2489t',
    'electron-smt156': 'electron/smt156',
    'electron-wf1589t': 'electron/wf1589t',
    'tuya-tpa10': 'tuya/tpa10',
  };
  for (const [vendor, path] of Object.entries(reports)) {
    assert.ok(catalogue.includes(notes[vendor].name));
    assert.match(
      read(join(root, 'dist/hardware/panels', path, 'index.html')),
      /No vendor firmware release notes were found/,
    );
  }
});
