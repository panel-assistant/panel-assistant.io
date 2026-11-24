import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { resolve } from '../../worker/resolve.js';

const topics = JSON.parse(
  readFileSync(new URL('../../worker/topics.json', import.meta.url), 'utf8'),
);
const retired = [
  'home-assistant/move-from-mqtt',
  'home-assistant/migration',
  'manage/upgrade-to-1-0',
];

test('retired transition pages redirect to the release notes in their own language', () => {
  for (const locale of ['', 'de/', 'es/', 'fr/', 'it/', 'nl/', 'pl/', 'uk/', 'zh-hans/']) {
    for (const path of retired) {
      const page = readFileSync(
        new URL(`../../dist/${locale}${path}/index.html`, import.meta.url),
        'utf8',
      );
      assert.ok(page.includes(`url=/${locale}release-notes/`), `${locale}${path}`);
    }
  }
});

test('shipped migration help URLs still resolve and the active Repair keeps its own help', () => {
  const origin = 'https://panel-assistant.io';
  const routes = {
    'move-from-mqtt': '/release-notes/',
    migration: '/release-notes/',
    'repair?issue=mqtt_panel_needs_090': '/release-notes/',
    'repair?issue=old_app_needs_090': '/home-assistant/repairs/#old-app-needs-090',
  };
  for (const [route, path] of Object.entries(routes)) {
    const hit = resolve(`${origin}/go/${route}`, topics);
    assert.equal(hit.known, true, route);
    assert.equal(hit.location, `${origin}${path}`, route);
  }
});
