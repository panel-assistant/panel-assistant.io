import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from './resolve.js';
import worker from './index.js';

const topics = JSON.parse(readFileSync(new URL('./topics.json', import.meta.url), 'utf8'));
const origin = 'https://panel-assistant.io';

test('every Repair opens its own documentation section, preserving version and language', () => {
  assert.equal(Object.keys(topics.repair).length, 35);
  assert.equal(new Set(Object.values(topics.repair)).size, 35);
  for (const [issue, destination] of Object.entries(topics.repair)) {
    const hit = resolve(`${origin}/go/repair?issue=${issue}&v=1.0.0-rc1&build=824&lang=de`, topics);
    const url = new URL(hit.location);
    assert.equal(hit.known, true, issue);
    assert.equal(url.pathname + url.hash, destination, issue);
    assert.deepEqual(
      [...url.searchParams],
      [
        ['v', '1.0.0-rc1'],
        ['build', '824'],
        ['lang', 'de'],
      ],
    );
    assert.equal(hit.missKey, undefined);
  }
});

test('unknown, missing and invalid Repair keys open the index and record bounded misses', async () => {
  for (const query of [
    '',
    '?issue=',
    '?issue=future_issue',
    '?issue=__proto__',
    '?issue=$comment',
  ]) {
    const points = [];
    const response = await worker.fetch(new Request(`${origin}/go/repair${query}`), {
      GO_MISSES: { writeDataPoint: (point) => points.push(point) },
    });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('location'), `${origin}/home-assistant/repairs/`);
    assert.equal(points.length, 1);
    assert.match(points[0].indexes[0], /^repair-[a-z0-9-]+$/);
    assert.ok(points[0].indexes[0].length <= 48);
    assert.deepEqual(points[0].blobs, points[0].indexes);
    assert.deepEqual(points[0].doubles, [1]);
  }
});

test('a known Repair records no miss and consumes only its issue selector', async () => {
  const points = [];
  const response = await worker.fetch(
    new Request(`${origin}/go/repair/?issue=panel_permissions&v=1&build=2`),
    { GO_MISSES: { writeDataPoint: (point) => points.push(point) } },
  );
  assert.equal(
    response.headers.get('location'),
    `${origin}/home-assistant/repairs/?v=1&build=2#panel-permissions`,
  );
  assert.deepEqual(points, []);
});

test('Repair forwarding keeps parameters on site and sends none to an off-site destination', () => {
  const local = resolve(`${origin}/go/repair?issue=future_issue&v=1&build=2`, topics);
  assert.equal(local.location, `${origin}/home-assistant/repairs/?v=1&build=2`);
  assert.equal(local.missKey, 'repair-future-issue');
  const remote = resolve(`${origin}/go/repair?issue=panel_permissions&v=1&build=2`, {
    repair: { panel_permissions: 'https://example.org/help#permissions' },
  });
  assert.equal(remote.location, 'https://example.org/help#permissions');
});
