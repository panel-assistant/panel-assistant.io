// The page editor's configuration, generated at build time from the panel pages themselves. The
// editor needs a declared field list; the site has none. So the list follows the pages: each
// front-matter key the hardware table already discovers becomes a form field when every page that
// carries it agrees on one simple type. A key whose values disagree, or hold anything richer than a
// string, number, yes/no or list of strings, gets no field and stays as raw front matter, which the
// editor keeps untouched when it saves.
import { collectFields } from '../hardware/fields.mjs';

const kindOf = (value) => {
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float';
  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) return 'list';
  return 'raw';
};

/** The form field for one key, or null when the pages do not agree on a simple type. */
export function fieldFor(key, entries) {
  const kinds = new Set(
    entries
      .map((data) => data?.[key])
      .filter((v) => v !== undefined && v !== null)
      .map(kindOf),
  );
  if (kinds.has('int') && kinds.has('float')) kinds.delete('int');
  if (kinds.size !== 1) return null;
  const [kind] = kinds;
  const base = { name: key, required: false };
  switch (kind) {
    case 'string':
      return { ...base, widget: 'string' };
    case 'boolean':
      return { ...base, widget: 'boolean' };
    case 'int':
    case 'float':
      return { ...base, widget: 'number', value_type: kind };
    case 'list':
      return { ...base, widget: 'list' };
    default:
      return null;
  }
}

/** Sveltia CMS configuration for the panel pages. `entries` is each panel page's front matter. */
export function editorConfig(entries, settings) {
  const discovered = collectFields(entries)
    .map((key) => fieldFor(key, entries))
    .filter(Boolean);
  return {
    backend: {
      name: 'github',
      repo: settings.repo,
      branch: settings.branch,
      base_url: `${settings.siteOrigin}${settings.authBase}`,
      auth_endpoint: 'auth',
      auth_scope: settings.scope,
      // Everyone, with or without write access, ends in a pull request reviewed on GitHub.
      open_authoring: true,
    },
    publish_mode: 'editorial_workflow',
    // Deliberately unservable: an image attached in the editor lands here in the pull request and
    // renders as a broken image until a reviewer moves it to the asset host and writes `asset:<key>`,
    // so a forgotten move shows on the page instead of a binary quietly reaching main.
    media_folder: 'src/assets/uploads',
    public_folder: '/uploads',
    collections: [
      {
        name: 'panels',
        label: 'Panels',
        label_singular: 'Panel',
        folder: settings.panelsFolder,
        extension: 'md',
        format: 'frontmatter',
        create: true,
        identifier_field: 'title',
        slug: '{{slug}}',
        fields: [
          { name: 'title', widget: 'string' },
          { name: 'description', widget: 'text', required: false },
          ...discovered,
          { name: 'body', widget: 'markdown' },
        ],
      },
    ],
  };
}
