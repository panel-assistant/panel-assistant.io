// Reader contracts against rendered English pages, including the buying comparisons.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const text = (path) =>
  readFileSync(`dist/${path}/index.html`, 'utf8')
    .split('<main')[1]
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
for (const path of [
  'hardware',
  'install/supported-panels',
  'hardware/panels/shelly/wall-display-x2i',
  'hardware/panels/meta/portal-10-gen2',
]) {
  test(`${path}: reader can identify the vendor-only Chromium 131 limit`, () => {
    const page = text(path);
    assert.match(page, /Can reach/i);
    assert.match(page, /131[^.]*[\s\S]*vendor only/i);
    assert.match(page, /no longer receives Chromium security fixes/i);
  });
}
test('Sonoff reader sees firmware-specific stock and the reachable Android 8/9 ceiling', () => {
  const page = text('hardware/panels/sonoff/nspanel-pro-86p');
  assert.match(page, /Ships with[^]*107[^]*131[^]*4\.0\.12/);
  assert.match(page, /Can reach[^]*138[^]*Android 8\/9/);
});
test('guide explains vendor eligibility independently of Android version', () => {
  const page = text('hardware/guides/update-the-webview');
  assert.match(page, /Android version alone does not establish/);
  assert.match(page, /X2i[^]*131[^]*Meta[^]*131/);
  assert.match(page, /120P[^]*129\.0\.6668\.70/);
});
test('unverified models keep their reachable engine unknown', () => {
  for (const panel of [
    'smatek/s9e',
    'shelly/wall-display-xl',
    'shelly/wall-display-x1i',
    'shelly/wall-display-x2',
    'meta/portal-go',
  ]) {
    assert.match(text(`hardware/panels/${panel}`), /Can reach[^]*Not established/);
  }
});
