import { test } from 'node:test';
import assert from 'node:assert/strict';
import { missKey, recordMiss } from './misses.js';
import worker from './index.js';

const sink = () => {
  const points = [];
  return { points, writeDataPoint: (p) => points.push(p) };
};
const env = (misses) => ({ MISSES: misses, ASSETS: { fetch: async () => new Response('site') } });
const go = (path, e) => worker.fetch(new Request('https://panel-assistant.io' + path), e);

test('a plausible topic is recorded as itself, lowercased', () => {
  assert.equal(missKey('Panel-Access'), 'panel-access');
});

test('anything else collapses to one malformed bucket', () => {
  assert.equal(missKey(''), 'malformed');
  assert.equal(missKey('a'.repeat(49)), 'malformed');
  assert.equal(missKey('../etc/passwd'), 'malformed');
  assert.equal(missKey('topic?x=1'), 'malformed');
  assert.equal(missKey('%00'), 'malformed');
});

test('an unknown topic is recorded once, without its parameters', async () => {
  const s = sink();
  const r = await go('/go/no-such-topic?v=1.0.0b1&build=37&secret=x', env(s));
  assert.equal(r.status, 302);
  assert.deepEqual(s.points, [
    { indexes: ['no-such-topic'], blobs: ['no-such-topic'], doubles: [1] },
  ]);
});

test('the recorded key is the sanitised one, not what was asked for', async () => {
  const s = sink();
  await go('/go/Not-Known?v=1', env(s));
  await go('/go/' + 'a'.repeat(49), env(s));
  assert.deepEqual(
    s.points.map((p) => p.indexes[0]),
    ['not-known', 'malformed'],
  );
});

test('a known topic, a bare /go and a site page record nothing', async () => {
  const s = sink();
  assert.equal((await go('/go/usb-install?v=1', env(s))).status, 302);
  assert.equal((await go('/go', env(s))).status, 302);
  assert.equal((await go('/start/getting-started/', env(s))).status, 200);
  assert.deepEqual(s.points, []);
});

test('a broken or absent sink never breaks the redirect', async () => {
  const broken = {
    writeDataPoint: () => {
      throw new Error('down');
    },
  };
  assert.equal((await go('/go/nope', env(broken))).status, 302);
  assert.equal((await go('/go/nope', env(undefined))).status, 302);
  assert.equal(recordMiss(undefined, 'nope'), null);
});
