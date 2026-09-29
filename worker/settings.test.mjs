import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from './resolve.js';
import { extractSettings, publishedVersions } from '../src/settings/extract.mjs';

const topics = JSON.parse(readFileSync(new URL('./topics.json', import.meta.url), 'utf8'));
const settings = {
  versions: {
    '0.9.8': { path: '/reference/settings/v0-9-8/', keys: ['panel_id', 'auto_sleep'] },
    '0.9.9-rc1': { path: '/reference/settings/v0-9-9-rc1/', keys: ['panel_id', 'voice'] },
    '1.0.0': { path: '/reference/settings/v1-0-0/', keys: ['panel_id'] },
  },
};
const go = (query) => resolve(`https://panel-assistant.io/go/settings?${query}`, topics, settings);
const landing = (query) => {
  const url = new URL(go(query).location);
  return url.pathname + url.hash;
};

test('a published version lands on its own page at the setting', () => {
  assert.equal(
    landing('v=0.9.8&lang=en&section=auto_sleep'),
    '/reference/settings/v0-9-8/#auto_sleep',
  );
  assert.equal(landing('v=0.9.9-rc1&section=voice'), '/reference/settings/v0-9-9-rc1/#voice');
});

test('an unpublished version lands on the nearest published one at or below it', () => {
  assert.equal(landing('v=0.9.9-rc2'), '/reference/settings/v0-9-9-rc1/');
  assert.equal(landing('v=0.9.9'), '/reference/settings/v0-9-9-rc1/');
  assert.equal(landing('v=1.0.1-rc1'), '/reference/settings/v1-0-0/');
  assert.equal(landing('v=1.0.0-rc3'), '/reference/settings/v0-9-9-rc1/');
});

test('a version older than every page gets the oldest, and an unreadable or missing one the newest', () => {
  assert.equal(landing('v=0.9.5'), '/reference/settings/v0-9-8/');
  assert.equal(landing('v=nonsense'), '/reference/settings/v1-0-0/');
  assert.equal(landing(''), '/reference/settings/v1-0-0/');
});

test('any interface language lands on the English page and keeps its parameters', () => {
  const url = new URL(go('v=0.9.8&lang=de&section=panel_id').location);
  assert.equal(url.pathname + url.hash, '/reference/settings/v0-9-8/#panel_id');
  assert.equal(url.searchParams.get('lang'), 'de');
  assert.equal(url.searchParams.get('v'), '0.9.8');
  assert.equal(url.searchParams.has('section'), false);
});

test('a setting that version does not have lands at the top of its page and is recorded', () => {
  const hit = go('v=0.9.8&section=voice');
  assert.equal(new URL(hit.location).hash, '');
  assert.equal(hit.known, false);
  assert.equal(hit.missKey, 'settings-voice');
  assert.equal(go('v=0.9.8').known, true);
});

test('with no published versions the topic still lands on the reference index', () => {
  const hit = resolve('https://panel-assistant.io/go/settings?v=0.9.8', topics, undefined);
  assert.equal(new URL(hit.location).pathname, '/reference/settings/');
});

test('rcs collapse into their release; a line with no release yet keeps its rcs', () => {
  const tags = ['v0.9.6', 'v0.9.7', 'v0.9.8-rc1', 'v0.9.8-rc2', 'v0.9.8', 'v0.9.9-rc1', 'rescue/x'];
  assert.deepEqual(publishedVersions(tags), ['0.9.9-rc1', '0.9.8', '0.9.7']);
});

const kotlin = (specs) => `object SettingsRegistry {
    const val WAKE_KEY = "wake"
    val SPECS: List<SettingSpec> = listOf(
${specs}
    )
}`;
const en = (keys) =>
  JSON.stringify({
    strings: Object.fromEntries(
      keys.flatMap((k) => [
        [`settings.${k}.label`, { text: `Label ${k}` }],
        [`settings.${k}.help`, { text: `Help (for ${k})` }],
      ]),
    ),
  });

test('a version lists the visible settings in app order by card, with English text', () => {
  const source = kotlin(`
        SettingSpec(key = "panel_id", group = "Identity", tier = Tier.BASIC, help = "a ) b"),
        SettingSpec(key = "token", group = "Identity", hidden = true),
        SettingSpec(key = WAKE_KEY, group = "Voice", validate = { raw -> check(raw) }),`);
  assert.deepEqual(extractSettings(source, en(['panel_id', 'token', 'wake'])), [
    {
      name: 'Identity',
      settings: [
        { key: 'panel_id', label: 'Label panel_id', help: 'Help (for panel_id)', advanced: false },
      ],
    },
    {
      name: 'Voice',
      settings: [{ key: 'wake', label: 'Label wake', help: 'Help (for wake)', advanced: true }],
    },
  ]);
});

test('a tag whose strings and registry disagree fails the build', () => {
  const source = kotlin(`        SettingSpec(key = "panel_id", group = "Identity"),`);
  assert.throws(() => extractSettings(source, en([])), /no label for setting panel_id/);
  assert.throws(() => extractSettings(source, en(['panel_id', 'gone'])), /registry lacks: gone/);
});

test('every published version has its page, and every setting its anchor, in the build', () => {
  const built = JSON.parse(
    readFileSync(new URL('../dist/settings-versions.json', import.meta.url), 'utf8'),
  );
  assert.ok(Object.keys(built.versions).length > 0, 'no settings versions were published');
  for (const [version, { path, keys }] of Object.entries(built.versions)) {
    const html = readFileSync(new URL(`../dist${path}index.html`, import.meta.url), 'utf8');
    assert.ok(keys.length > 0, `${version} lists no settings`);
    for (const key of keys) assert.ok(html.includes(`id="${key}"`), `${version} has no #${key}`);
  }
});
