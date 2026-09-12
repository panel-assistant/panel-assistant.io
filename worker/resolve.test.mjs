import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from './resolve.js';

const topics = JSON.parse(readFileSync(new URL('./topics.json', import.meta.url), 'utf8'));
const go = (path) => resolve('https://panel-assistant.io' + path, topics);

test('a known topic redirects to its page and keeps every parameter', () => {
  const hit = go('/go/panel-unreachable?v=1.0.0b1&build=37&model=tpa10');
  assert.equal(hit.known, true);
  assert.equal(
    hit.location,
    'https://panel-assistant.io/manage/troubleshooting/?v=1.0.0b1&build=37&model=tpa10#the-installer-cannot-reach-the-panel',
  );
});

test('an off-site topic redirects to the absolute URL', () => {
  const hit = go('/go/issues?v=1.0.0b1');
  assert.equal(hit.location, 'https://github.com/panel-assistant/ha-integration/issues?v=1.0.0b1');
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

test('every topic on the site points at a page that exists in the build', () => {
  for (const [topic, target] of Object.entries(topics)) {
    if (topic.startsWith('$') || !target.startsWith('/')) continue;
    const page = target.split('#')[0];
    assert.doesNotThrow(
      () => readFileSync(new URL('../dist' + page + 'index.html', import.meta.url)),
      `${topic} -> ${page} is not in dist/`,
    );
  }
});

test('every anchor on the site exists in the built page', () => {
  for (const [topic, target] of Object.entries(topics)) {
    if (topic.startsWith('$') || !target.includes('#')) continue;
    const [page, anchor] = target.split('#');
    const html = readFileSync(new URL('../dist' + page + 'index.html', import.meta.url), 'utf8');
    assert.ok(html.includes(`id="${anchor}"`), `${topic} -> #${anchor} is not in ${page}`);
  }
});
