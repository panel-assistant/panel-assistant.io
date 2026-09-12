import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const built = JSON.parse(readFileSync(new URL('../dist/build.json', import.meta.url), 'utf8'));

test('the published build.json names the commit the site was built from', () => {
  assert.equal(built.number, Number(git('rev-list', '--count', 'HEAD')));
  assert.equal(built.sha, git('rev-parse', '--short=7', 'HEAD'));
  assert.ok(['main', 'preview'].includes(built.channel));
});

test('every page carries the build line', () => {
  for (const page of ['/', '/start/getting-started/']) {
    const html = readFileSync(new URL('../dist' + page + 'index.html', import.meta.url), 'utf8');
    assert.ok(
      html.includes(`Build ${built.number} · ${built.sha}`),
      `${page} lacks the build line`,
    );
  }
});
