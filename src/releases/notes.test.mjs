import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNote, readNotes, render } from './notes.mjs';

const note = (v, date, extra = '') =>
  `---\nversion: ${v}\ndate: ${date}\nprerelease: ${v.includes('-')}\n${extra}---\n### New\n\n- Thing in ${v}.\n`;

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), 'notes-'));
  for (const c of ['panel-assistant', 'panel-app']) mkdirSync(join(dir, c));
  for (const [path, text] of Object.entries(files)) writeFileSync(join(dir, path), text);
  return dir;
}

test('the published notes all parse and every pairing resolves', () => {
  const notes = readNotes(fileURLToPath(new URL('./notes', import.meta.url)));
  assert.ok(notes['panel-assistant'].has('1.0.0'));
  assert.match(render(notes), /id="panel-app-1-0-0"/);
});

test('releases are newest first and app notes sit inside their Panel Assistant release, marked', () => {
  const page = render(
    readNotes(
      fixture({
        'panel-assistant/1.0.0.md': note('1.0.0', '2026-11-06', 'app: [1.0.0]\n'),
        'panel-assistant/1.0.1-rc1.md': note('1.0.1-rc1', '2026-11-20', 'app: [1.0.1-rc1]\n'),
        'panel-app/1.0.0.md': note('1.0.0', '2026-11-06'),
        'panel-app/1.0.1-rc1.md': note('1.0.1-rc1', '2026-11-20'),
      }),
    ),
  );
  const rc = page.indexOf('id="panel-assistant-1-0-1-rc1"');
  const stable = page.indexOf('id="panel-assistant-1-0-0"');
  assert.ok(rc > 0 && stable > rc);
  assert.ok(page.indexOf('(panel app 1.0.0)') > stable);
  assert.match(page, /data-prerelease="true"/);
  assert.match(page, /#### New/);
  // Without JavaScript the controls stay hidden and every release is open.
  assert.match(page, /<form class="release-controls" hidden>/);
  assert.equal(page.match(/<details open>/g).length, 2);
});

test('a pairing with missing app notes, a misnamed file or a wrong prerelease flag fails the build', () => {
  assert.throws(
    () =>
      readNotes(
        fixture({ 'panel-assistant/1.0.0.md': note('1.0.0', '2026-11-06', 'app: [1.0.0]\n') }),
      ),
    /no notes/,
  );
  assert.throws(
    () => readNotes(fixture({ 'panel-app/1.0.1.md': note('1.0.0', '2026-11-06') })),
    /must match/,
  );
  assert.throws(
    () => parseNote('---\nversion: 1.0.0-rc1\ndate: 2026-01-01\nprerelease: false\n---\nx', 'f'),
    /prerelease must be true/,
  );
});

test('an app release no Panel Assistant release pairs with gets its own section', () => {
  const page = render(readNotes(fixture({ 'panel-app/1.0.2.md': note('1.0.2', '2026-12-01') })));
  assert.match(page, /id="panel-app-1-0-2"/);
});
