import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reconcileDraft } from '../src/image-admin/merge.js';

const draft = () => ({
  revision: 'base',
  models: [
    {
      id: 'vendor/panel',
      title: 'Panel',
      heroImageId: 'front',
      images: [
        {
          id: 'front',
          credit: 'Original',
          alt: 'Front',
          source: { notes: 'Source' },
          original: { sha256: 'master' },
        },
        { id: 'rear', credit: 'Rear credit', alt: 'Rear' },
      ],
    },
  ],
});
const image = (library) => library.models[0].images[0];

test('credit edits reconcile with newer metadata, additions and image order without mutating drafts', () => {
  const base = draft(),
    local = structuredClone(base),
    saved = structuredClone(base);
  image(local).credit = 'New credit';
  image(saved).source.notes = 'New source notes';
  saved.models[0].images.reverse();
  saved.models[0].images.push({ id: 'pcb', credit: 'Technical photo' });
  saved.models.push({ id: 'vendor/other', title: 'Other', images: [] });
  saved.models[0].heroImageId = null;
  saved.revision = 'latest';
  const inputs = structuredClone([base, local, saved]);
  const result = reconcileDraft(base, local, saved);
  assert.deepEqual(result.conflicts, []);
  assert.equal(result.library.revision, 'latest');
  assert.deepEqual(
    result.library.models[0].images.map((entry) => entry.id),
    ['rear', 'front', 'pcb'],
  );
  assert.equal(result.library.models[0].images[1].credit, 'New credit');
  assert.equal(result.library.models[0].images[1].source.notes, 'New source notes');
  assert.equal(result.library.models[0].heroImageId, null);
  assert.equal(result.library.models[1].id, 'vendor/other');
  assert.deepEqual([base, local, saved], inputs);
});

test('divergent credit edits refuse reconciliation and identify the field', () => {
  const base = draft(),
    local = structuredClone(base),
    saved = structuredClone(base);
  image(local).credit = 'Our credit';
  image(saved).credit = 'Their credit';
  const result = reconcileDraft(base, local, saved);
  assert.equal(result.library, undefined);
  assert.match(result.conflicts[0], /front.*credit/);
  assert.equal(image(local).credit, 'Our credit');
  assert.equal(image(saved).credit, 'Their credit');
});

test('identical concurrent credit edits converge', () => {
  const base = draft(),
    local = structuredClone(base),
    saved = structuredClone(base);
  image(local).credit = image(saved).credit = 'Agreed credit';
  assert.equal(image(reconcileDraft(base, local, saved).library).credit, 'Agreed credit');
});

for (const side of ['local', 'saved']) {
  test(`image deletion on ${side} conflicts with an edit by the other writer`, () => {
    const base = draft(),
      local = structuredClone(base),
      saved = structuredClone(base);
    const removed = side === 'local' ? local : saved;
    const edited = side === 'local' ? saved : local;
    removed.models[0].images.shift();
    image(edited).credit = 'Edited';
    assert.equal(reconcileDraft(base, local, saved).library, undefined);
  });
}

test('model deletion cannot silently discard a local credit edit', () => {
  const base = draft(),
    local = structuredClone(base),
    saved = structuredClone(base);
  image(local).credit = 'Edited';
  saved.models = [];
  assert.equal(reconcileDraft(base, local, saved).library, undefined);
});

test('competing membership or order changes refuse instead of guessing order', () => {
  const base = draft(),
    local = structuredClone(base),
    saved = structuredClone(base);
  local.models[0].images.push({ id: 'ours' });
  saved.models[0].images.push({ id: 'theirs' });
  const result = reconcileDraft(base, local, saved);
  assert.equal(result.library, undefined);
  assert.match(result.conflicts[0], /order or membership/);
});
