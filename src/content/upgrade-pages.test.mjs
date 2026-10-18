import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const dist = join(new URL('../..', import.meta.url).pathname, 'dist');
const page = (path) => readFileSync(join(dist, path, 'index.html'), 'utf8');

test('updates and recovery sends readers to the 1.0 going-back steps', () => {
  const updates = page('manage/updates-and-recovery');
  assert.doesNotMatch(updates, /not something the documentation currently describes/);
  assert.match(updates, /href="\/manage\/upgrade-to-1-0\/#going-back"/);
  assert.match(page('manage/upgrade-to-1-0'), /id="going-back"/);
});
