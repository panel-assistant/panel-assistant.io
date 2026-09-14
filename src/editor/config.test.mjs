import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { editUrlFor, editorConfig, fieldFor } from './config.mjs';
import { collectFields } from '../hardware/fields.mjs';
import settings from '../../worker/editor.json' with { type: 'json' };

const fieldsOf = (config) => config.collections[0].fields;
const names = (config) => fieldsOf(config).map((f) => f.name);

test('form fields follow the keys the pages carry, between title/description and the body', () => {
  const config = editorConfig(
    [
      { title: 'A', description: 'd', sidebar: { label: 'A' }, soc: 'rk3566', android: '11' },
      { title: 'B', soc: 'px30', zigbee: true },
    ],
    settings,
  );
  assert.deepEqual(names(config), ['title', 'description', 'soc', 'android', 'zigbee', 'body']);
});

test('a new key on one page becomes a field with no change to the configuration code', () => {
  const before = names(editorConfig([{ title: 'A', soc: 'x' }], settings));
  const after = names(
    editorConfig(
      [
        { title: 'A', soc: 'x' },
        { title: 'B', relays: 2 },
      ],
      settings,
    ),
  );
  assert.ok(!before.includes('relays'));
  assert.ok(after.includes('relays'));
});

test('each simple type gets its own widget', () => {
  assert.equal(fieldFor('k', [{ k: 'a' }]).widget, 'string');
  assert.equal(fieldFor('k', [{ k: true }]).widget, 'boolean');
  assert.deepEqual(fieldFor('k', [{ k: 2 }, { k: 3 }]), {
    name: 'k',
    required: false,
    widget: 'number',
    value_type: 'int',
  });
  assert.equal(fieldFor('k', [{ k: 2 }, { k: 2.5 }]).value_type, 'float');
  assert.equal(fieldFor('k', [{ k: ['a', 'b'] }]).widget, 'list');
  assert.equal(fieldFor('k', [{ k: 'a' }, {}, { k: null }]).widget, 'string');
});

test('keys whose pages disagree, or hold richer values, stay raw front matter', () => {
  assert.equal(fieldFor('k', [{ k: 'a' }, { k: 2 }]), null);
  assert.equal(fieldFor('k', [{ k: { a: 1 } }]), null);
  assert.equal(fieldFor('k', [{ k: [1, 2] }]), null);
  assert.equal(fieldFor('k', [{ k: new Date(0) }]), null);
  const config = editorConfig([{ title: 'A', soc: 'x', ports: { usb: 1 } }], settings);
  assert.ok(!names(config).includes('ports'));
});

test('the editor accepts no images and saves the body as typed', () => {
  const body = fieldsOf(editorConfig([], settings)).at(-1);
  assert.equal(body.name, 'body');
  assert.deepEqual(body.modes, ['raw']);
  assert.deepEqual(body.editor_components, []);
  assert.ok(
    !fieldsOf(editorConfig([{ title: 'A', photo: 'x.png' }], settings)).some((f) =>
      ['image', 'file'].includes(f.widget),
    ),
  );
});

test('every save is a pull request: open authoring, editorial workflow, public scope only', () => {
  const { backend, publish_mode } = editorConfig([], settings);
  assert.equal(backend.open_authoring, true);
  assert.equal(publish_mode, 'editorial_workflow');
  assert.equal(backend.auth_scope, 'public_repo');
  assert.equal(backend.base_url, 'https://panel-assistant.io/oauth');
  assert.equal(backend.repo, 'panel-assistant/panel-assistant.io');
});

// The published configuration, read from dist/, against the panel pages in the repository.
test('the built editor configuration declares every front-matter key the panel pages use', () => {
  const built = JSON.parse(readFileSync(new URL('../../dist/admin/config.json', import.meta.url)));
  const dir = new URL(`../../${settings.panelsFolder}/`, import.meta.url);
  const entries = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const front = readFileSync(new URL(f, dir), 'utf8').split(/^---$/m)[1];
      return Object.fromEntries([...front.matchAll(/^([A-Za-z_][\w-]*):/gm)].map((m) => [m[1], 1]));
    });
  assert.ok(entries.length > 0);
  const declared = new Set(names(built));
  for (const key of collectFields(entries)) {
    assert.ok(declared.has(key), `panel key "${key}" has no editor field`);
  }
  assert.equal(built.collections[0].folder, settings.panelsFolder);
});

test('panel pages, and only panel pages, get an edit link to their editor entry', () => {
  assert.equal(
    editUrlFor('hardware/panels/tuya-tpa10', settings),
    'https://panel-assistant.io/admin/#/collections/panels/entries/tuya-tpa10',
  );
  for (const id of [
    'start/getting-started',
    'hardware',
    'hardware/panels',
    'hardware/panels/',
    'hardware/firmware/nspanel-pro',
    'hardware/panels/a/b',
    undefined,
  ]) {
    assert.equal(editUrlFor(id, settings), null, String(id));
  }
});

test('the built panel pages carry the edit link and other pages do not', () => {
  const page = (p) => readFileSync(new URL(`../../dist/${p}index.html`, import.meta.url), 'utf8');
  const dir = new URL(`../../${settings.panelsFolder}/`, import.meta.url);
  const slugs = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.slice(0, -3));
  for (const slug of slugs) {
    assert.ok(
      page(`hardware/panels/${slug}/`).includes(
        `href="https://panel-assistant.io/admin/#/collections/panels/entries/${slug}"`,
      ),
      `${slug} has no edit link`,
    );
  }
  for (const other of ['start/getting-started/', 'hardware/', '']) {
    assert.ok(!page(other).includes('/admin/'), `${other || '/'} links to the editor`);
  }
});
