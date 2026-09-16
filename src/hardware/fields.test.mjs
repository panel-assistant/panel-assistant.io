import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cellText, collectFields, fieldLabel, nearDuplicates } from './fields.mjs';
import { markdownToHtml } from 'satteri';
import { assetUrls, rewriteAssetUrl } from '../plugins/asset-urls.mjs';

test('fields are the union of keys across pages, most used first, page keys excluded', () => {
  const fields = collectFields([
    { title: 'A', description: 'd', sidebar: {}, relays: 2, android: '11', soc: 'rk3566' },
    { title: 'B', soc: 'px30', screen: '4 in' },
    { title: 'C', soc: 'rk3576', android: '12' },
  ]);
  assert.deepEqual(fields, ['soc', 'android', 'relays', 'screen']);
});

test('a key present on one page only still becomes a field', () => {
  assert.ok(collectFields([{ title: 'A' }, { title: 'B', zigbee: true }]).includes('zigbee'));
});

test('photos and photoCredit are page chrome, not table columns', () => {
  const fields = collectFields([
    { title: 'A', photos: [{ src: 'asset:a/front.jpg', alt: 'A, front' }], photoCredit: 'Sonoff' },
  ]);
  assert.deepEqual(fields, []);
});

test('near-duplicate spellings are reported', () => {
  assert.deepEqual(nearDuplicates(['soc', 'SoC']), [['soc', 'SoC']]);
  assert.deepEqual(nearDuplicates(['android_version', 'androidVersion']), [
    ['android_version', 'androidVersion'],
  ]);
  assert.deepEqual(nearDuplicates(['screen', 'sreen']), [['screen', 'sreen']]);
});

test('distinct fields are not reported', () => {
  assert.deepEqual(nearDuplicates(['soc', 'screen', 'root', 'relays', 'android', 'webview']), []);
  assert.deepEqual(nearDuplicates(['led', 'leds']), []);
});

test('labels and cells read as prose', () => {
  assert.equal(fieldLabel('android_version'), 'Android version');
  assert.equal(fieldLabel('webviewVersion'), 'Webview version');
  assert.equal(fieldLabel('soc'), 'SOC');
  assert.equal(cellText(['86P', '120P']), '86P, 120P');
  assert.equal(cellText(true), 'Yes');
  assert.equal(cellText(undefined), '');
  assert.equal(cellText({ light: true, proximity: false }), 'Light: Yes; Proximity: No');
});

test('asset URLs are rewritten to the base and nothing else is touched', () => {
  const base = 'https://assets.example.test/';
  assert.equal(
    rewriteAssetUrl('asset:ui-logs-dark.png', base),
    'https://assets.example.test/ui-logs-dark.png',
  );
  assert.equal(rewriteAssetUrl('/local.png', base), '/local.png');
  assert.equal(
    rewriteAssetUrl('https://other.test/asset:x.png', base),
    'https://other.test/asset:x.png',
  );
  const { html } = markdownToHtml(
    '![a](asset:a.png)\n\n![c][ref]\n\n[ref]: asset:c.png\n\n<img src="asset:b.gif" alt="">\n\n![d](/d.png)\n',
    { mdastPlugins: [assetUrls({ base })] },
  );
  assert.match(html, /src="https:\/\/assets\.example\.test\/a\.png"/);
  assert.match(html, /src="https:\/\/assets\.example\.test\/c\.png"/);
  assert.match(html, /src="https:\/\/assets\.example\.test\/b\.gif"/);
  assert.match(html, /src="\/d\.png"/);
  assert.doesNotMatch(html, /asset:/);
});
