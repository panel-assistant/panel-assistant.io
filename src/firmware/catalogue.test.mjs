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

test('built catalogue exposes every source build under each documented model', () => {
  const models = [
    ['sonoff-nspanel-pro-86p', sonoffVersions('fw-86p.dat')],
    ['sonoff-nspanel-pro-120p', sonoffVersions('fw-120p.dat')],
    ['shelly-wall-display', shellyVersions('WallDisplay')],
    ['shelly-wall-display-x2', shellyVersions('WallDisplay')],
    ['shelly-wall-display-x1i', shellyVersions('WallDisplayV2')],
    ['shelly-wall-display-x2i', shellyVersions('WallDisplayV2')],
    ['shelly-wall-display-xl', shellyVersions('WallDisplayV2')],
  ];
  const catalogue = read(join(dist, 'index.html'));
  let pages = 0;
  for (const [model, versions] of models) {
    assert.ok(existsSync(join(dist, model, 'index.html')), `${model} page missing`);
    assert.match(catalogue, new RegExp(`/hardware/firmware/builds/${model}/`));
    for (const [version, objects] of versions) {
      const target = join(dist, model, slug(version), 'index.html');
      assert.ok(existsSync(target), `${model} ${version} page missing`);
      const page = read(target);
      assert.equal(
        (page.match(/Vendor download/g) ?? []).length,
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
