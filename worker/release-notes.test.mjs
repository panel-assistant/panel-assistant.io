import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from './resolve.js';
import topics from './topics.json' with { type: 'json' };

const go = (query) =>
  resolve(`https://panel-assistant.io/go/release-notes${query}`, topics).location;

test('a Panel Assistant version lands on its section', () => {
  assert.equal(
    go('?v=1.0.0'),
    'https://panel-assistant.io/release-notes/?v=1.0.0#panel-assistant-1-0-0',
  );
});

test('a panel app rc lands on its block, with or without a leading v', () => {
  assert.equal(
    go('?v=v1.0.0-rc1&component=panel-app'),
    'https://panel-assistant.io/release-notes/?v=v1.0.0-rc1#panel-app-1-0-0-rc1',
  );
});

test('an unreadable version or no version lands at the top of the page', () => {
  assert.equal(go('?v=latest'), 'https://panel-assistant.io/release-notes/?v=latest');
  assert.equal(go(''), 'https://panel-assistant.io/release-notes/');
});
