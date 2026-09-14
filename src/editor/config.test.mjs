import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { editorConfig, fieldFor } from './config.mjs';
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
