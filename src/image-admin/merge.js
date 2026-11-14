// Reconcile edits against the exact draft loaded by this tab. Arrays of models/images keep
// their saved order unless only one editor changed that order or membership.
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export function reconcileDraft(base, local, saved) {
  const conflicts = [];
  function merge(before, ours, theirs, path) {
    if (equal(ours, before)) return structuredClone(theirs);
    if (equal(theirs, before) || equal(ours, theirs)) return structuredClone(ours);
    if (record(before) && record(ours) && record(theirs)) {
      const result = {};
      for (const key of new Set([
        ...Object.keys(before),
        ...Object.keys(ours),
        ...Object.keys(theirs),
      ])) {
        const value = merge(before[key], ours[key], theirs[key], [...path, key]);
        if (value !== undefined) result[key] = value;
      }
      return result;
    }
    if (
      ['models', 'images'].includes(path.at(-1)) &&
      [before, ours, theirs].every(
        (items) =>
          Array.isArray(items) &&
          items.every((item) => record(item) && typeof item.id === 'string') &&
          new Set(items.map((item) => item.id)).size === items.length,
      )
    ) {
      const ids = (items) => items.map((item) => item.id);
      const beforeIDs = ids(before),
        ourIDs = ids(ours),
        theirIDs = ids(theirs);
      let order;
      if (equal(ourIDs, beforeIDs)) order = theirIDs;
      else if (equal(theirIDs, beforeIDs) || equal(ourIDs, theirIDs)) order = ourIDs;
      else {
        conflicts.push([...path, 'order or membership'].join(' / '));
        return;
      }
      const maps = [before, ours, theirs].map(
        (items) => new Map(items.map((item) => [item.id, item])),
      );
      const merged = new Map();
      for (const id of new Set([...beforeIDs, ...ourIDs, ...theirIDs])) {
        const value = merge(...maps.map((items) => items.get(id)), [...path, id]);
        if (value !== undefined) merged.set(id, value);
      }
      return order.filter((id) => merged.has(id)).map((id) => merged.get(id));
    }
    conflicts.push(path.join(' / '));
  }
  // Revision identifies the destination snapshot, never a user edit.
  const models = merge(base.models, local.models, saved.models, ['models']);
  return conflicts.length ? { conflicts } : { library: { ...saved, models }, conflicts };
}
