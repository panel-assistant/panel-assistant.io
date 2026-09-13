import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from './resolve.js';

const topics = JSON.parse(readFileSync(new URL('./topics.json', import.meta.url), 'utf8'));
const go = (path) => resolve('https://panel-assistant.io' + path, topics);

// Every non-object, non-$ topic value alongside every entry of the nested
// `docs` map, labelled for failure messages. A nested map value must be
// recursed into, not skipped, or "every topic checked against the built
// pages" silently stops covering it.
function flatTargets(map, prefix = '') {
  const out = [];
  for (const [key, value] of Object.entries(map)) {
    if (key.startsWith('$')) continue;
    if (typeof value === 'object' && value !== null) {
      out.push(...flatTargets(value, `${prefix}${key}.`));
    } else {
      out.push([`${prefix}${key}`, value]);
    }
  }
  return out;
}

// The complete set of old ha-paneld docs/*.md paths as of the docs-hub
// migration (ha-paneld main bbba44ffdcea22f7425b6ea406b8a53e4ddaa4a6, 42
// English pages), normalized the way resolve.js normalizes an incoming
// `page` value. Pinned here so a dropped map entry fails this test even
// though the website repo cannot read the ha-paneld tree.
const OLD_DOCS_PAGES = [
  'adaptive-brightness',
  'adaptive-proximity',
  'api',
  'architecture/device-profiles',
  'architecture/security',
  'building',
  'built-in-renderer',
  'changelog',
  'display-sizing',
  'fdroid',
  'firmware-backup-restore',
  'hardware/nspanel-pro',
  'hardware/nspanel-pro-firmware',
  'hardware/nspanel-pro-firmware-archive',
  'hardware/readme',
  'hardware/s9e',
  'hardware/shelly-wall-display',
  'hardware/smt1019',
  'hardware/tpa10',
  'hardware/wf1589t',
  'hardware/zx-smt156',
  'img/readme',
  'infrastructure',
  'local-builds',
  'performance',
  'profiles/examples/readme',
  'profiles/format',
  'profiles/readme',
  'profiles/sharing',
  'profiles/testing',
  'profiles/unofficial/echo-show-5-gen2',
  'profiles/unofficial/lenovo-thinksmart-view-lineageos',
  'profiles/unofficial/raspberry-pi-4-konstakang',
  'profiles/unofficial/readme',
  'profiles/unofficial/sunworld-yc-sm55p-p76s01',
  'provisioning',
  'provisioning-safety',
  'releasing',
  'roadmap',
  'security-mode',
  'tts',
  'vendor-taming',
];

test('a known topic redirects to its page and keeps every parameter', () => {
  const hit = go('/go/panel-unreachable?v=1.0.0b1&build=37&model=tpa10');
  assert.equal(hit.known, true);
  assert.equal(
    hit.location,
    'https://panel-assistant.io/manage/troubleshooting/?v=1.0.0b1&build=37&model=tpa10#the-installer-cannot-reach-the-panel',
  );
});

test('an off-site topic redirects to the absolute URL and forwards no parameters', () => {
  const hit = go('/go/issues?v=1.0.0b1&build=37&model=tpa10');
  assert.equal(hit.location, 'https://github.com/panel-assistant/ha-integration/issues');
  const discord = go('/go/discord?v=probe&build=0');
  assert.ok(!new URL(discord.location).search, `discord received ${discord.location}`);
});

test('an unknown topic lands on the homepage, named, with its parameters', () => {
  const hit = go('/go/no-such-topic?v=1.0.0b1&build=37');
  assert.equal(hit.known, false);
  assert.equal(hit.location, 'https://panel-assistant.io/?v=1.0.0b1&build=37&go=no-such-topic');
});

test('a trailing slash and an encoded topic still match', () => {
  assert.equal(go('/go/usb-install/').known, true);
  assert.equal(go('/go/usb%2Dinstall').known, true);
});

test('a bare /go lands on the homepage without a go parameter', () => {
  assert.equal(go('/go').location, 'https://panel-assistant.io/');
  assert.equal(go('/go/').location, 'https://panel-assistant.io/');
});

test('the comment key is not a topic', () => {
  assert.equal(go('/go/$comment').known, false);
});

test("paths outside /go are not the router's business", () => {
  assert.equal(go('/start/getting-started/'), null);
  assert.equal(go('/gone'), null);
});

test('every topic, including every entry of the docs map, points at a page in the build', () => {
  for (const [topic, target] of flatTargets(topics)) {
    if (!target.startsWith('/')) continue;
    const page = target.split('#')[0];
    assert.doesNotThrow(
      () => readFileSync(new URL('../dist' + page + 'index.html', import.meta.url)),
      `${topic} -> ${page} is not in dist/`,
    );
  }
});

test('every anchor on the site, including in the docs map, exists in the built page', () => {
  for (const [topic, target] of flatTargets(topics)) {
    if (!target.includes('#')) continue;
    const [page, anchor] = target.split('#');
    const html = readFileSync(new URL('../dist' + page + 'index.html', import.meta.url), 'utf8');
    assert.ok(html.includes(`id="${anchor}"`), `${topic} -> #${anchor} is not in ${page}`);
  }
});

test('every old ha-paneld docs/*.md path resolves to a site page, never the homepage', () => {
  for (const page of OLD_DOCS_PAGES) {
    const hit = go(`/go/docs?page=${encodeURIComponent(page)}`);
    assert.equal(
      hit.known,
      true,
      `docs?page=${page} did not resolve (fell through to the homepage)`,
    );
    assert.ok(hit.location.startsWith('https://panel-assistant.io/'), hit.location);
    assert.notEqual(
      new URL(hit.location).pathname,
      '/',
      `docs?page=${page} landed on the homepage`,
    );
  }
});

test('the old-path map has exactly the pinned set of keys — a dropped or added entry fails here', () => {
  const keys = Object.keys(topics.docs)
    .filter((k) => !k.startsWith('$'))
    .sort();
  assert.deepEqual(keys, [...OLD_DOCS_PAGES].sort());
});

test('the docs page value is normalized before lookup: prefix, extension, case and slashes are all ignored', () => {
  const canonical = go('/go/docs?page=hardware/nspanel-pro').location;
  for (const variant of [
    'docs/hardware/nspanel-pro.md',
    'docs/hardware/nspanel-pro',
    'Hardware/NSPanel-Pro.MD',
    '/hardware/nspanel-pro/',
  ]) {
    assert.equal(go(`/go/docs?page=${encodeURIComponent(variant)}`).location, canonical, variant);
  }
});

test('a known docs page forwards every other parameter but consumes page itself', () => {
  const hit = go('/go/docs?page=hardware/nspanel-pro&v=1.0.0b1&build=37');
  assert.equal(
    hit.location,
    'https://panel-assistant.io/hardware/panels/sonoff-nspanel-pro/?v=1.0.0b1&build=37',
  );
});

test('an unknown docs page mirrors the unknown-topic contract: homepage, go=docs, page echoed back', () => {
  const hit = go('/go/docs?page=hardware/nspanel-pro-old&v=1.0.0b1');
  assert.equal(hit.known, false);
  assert.equal(
    hit.location,
    'https://panel-assistant.io/?v=1.0.0b1&go=docs&page=hardware%2Fnspanel-pro-old',
  );
  assert.equal(hit.missKey, 'docs-hardware-nspanel-pro-old');
});

test('a missing page on the docs topic also falls through, with no page parameter to echo', () => {
  const hit = go('/go/docs?v=1.0.0b1');
  assert.equal(hit.known, false);
  assert.equal(hit.location, 'https://panel-assistant.io/?v=1.0.0b1&go=docs');
  assert.equal(hit.missKey, 'docs-malformed');
});

test('a known topic and a known docs page record no missKey', () => {
  assert.equal(go('/go/usb-install').missKey, undefined);
  assert.equal(go('/go/docs?page=api').missKey, undefined);
});
