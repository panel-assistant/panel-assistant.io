const $ = (id) => document.getElementById(id);
const adminBase = new URL('./', import.meta.url);
const MAX_FILE = 25 * 1024 * 1024;
const MAX_PREVIEW = 5 * 1024 * 1024;
const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jxl']);
const ACCEPT = 'image/jpeg,image/png,image/webp,image/jxl,.jxl';
let library;
let selected;
let dirty = false;
let busy = false;
let conflict = false;
let savedAt;
let previewIndex = 0;
let publication;
let publicationError = '';
let publicationLoading = false;
let savedModelHashes = new Map();
let publishReview;

async function rememberSavedModels() {
  savedModelHashes = new Map(
    await Promise.all(
      library.models.map(async (entry) => {
        const bytes = new TextEncoder().encode(JSON.stringify(entry));
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const hash = Array.from(new Uint8Array(digest), (value) =>
          value.toString(16).padStart(2, '0'),
        ).join('');
        return [entry.id, hash];
      }),
    ),
  );
}

function publicModel() {
  return publication?.models.find((entry) => entry.id === selected);
}

function publishable() {
  return Boolean(
    !busy &&
    !dirty &&
    !conflict &&
    !publicationLoading &&
    publication &&
    model() &&
    savedModelHashes.has(selected) &&
    publicModel()?.draftHash !== savedModelHashes.get(selected),
  );
}

function publicationControls() {
  const published = publicModel();
  const current = published && published.draftHash === savedModelHashes.get(selected);
  $('publish-review').disabled = !publishable();
  $('publication-retry').disabled = busy || publicationLoading || !library;
  $('publication-retry').hidden = !publicationError;
  $('publish-confirm').disabled = !publishReview || !publishable();
  const status = $('publication-status');
  if (publicationLoading) status.textContent = 'Checking published panel images…';
  else if (publicationError) status.textContent = publicationError;
  else if (!publication) status.textContent = 'Publication status is not available yet.';
  else if (dirty || conflict)
    status.textContent =
      'Save and reconcile your private draft before publishing. The website is unchanged.';
  else if (current) status.textContent = 'Published images match this saved panel draft.';
  else if (published) status.textContent = 'This panel has saved changes that are not published.';
  else
    status.textContent =
      'This panel has no image publication yet. Its existing website images are unchanged.';
  $('public-page').hidden = !published;
  if (published)
    $('public-page').href =
      `https://panel-assistant.io/hardware/panels/${selected.split('/').map(encodeURIComponent).join('/')}/`;
}

async function refreshPublication() {
  publicationLoading = true;
  controls();
  try {
    const data = await api('api/publication');
    if (!Array.isArray(data.models) || !('revision' in data))
      throw new Error('The publication response was incomplete.');
    publication = data;
    publicationError = '';
  } catch (error) {
    publicationError =
      error.status === 503
        ? 'Image publishing is not set up yet. You can still edit and save private drafts.'
        : `Could not check published images. Private drafts remain usable. ${error.message}`;
    publication = undefined;
  } finally {
    publicationLoading = false;
    controls();
  }
}

function reviewPublication() {
  if (!publishable()) return;
  const entry = model();
  publishReview = {
    modelId: selected,
    draftRevision: library.revision,
    draftHash: savedModelHashes.get(selected),
    publishedRevision: publication.revision,
  };
  $('publish-model').textContent = entry.title;
  const hero = entry.images.findIndex((image) => image.id === entry.heroImageId);
  $('publish-summary').textContent =
    `${entry.images.length} ${entry.images.length === 1 ? 'image' : 'images'} in the order below. ${hero < 0 ? 'No hero image selected.' : `Image ${hero + 1} is the hero.`}${entry.images.length ? '' : ' Publishing this empty selection removes all public images for this panel.'}`;
  $('publish-images').replaceChildren(
    ...entry.images.map((image, index) => {
      const card = element('li', 'publish-image');
      const img = element('img');
      img.src = fileUrl(image.delivery.thumb);
      img.alt = image.alt;
      img.loading = 'lazy';
      const details = element('div');
      details.append(
        element('h3', '', `Image ${index + 1}${index === hero ? ' · Hero image' : ''}`),
        element('p', '', image.alt || 'No caption recorded.'),
        element('p', '', `Credit: ${image.credit || 'Not recorded'}`),
        element(
          'p',
          'muted',
          `Licence / permission evidence: ${image.source?.licence || 'Unknown'}`,
        ),
      );
      const source = sourceUrl(image.source?.page);
      if (source) {
        const link = element('a', '', 'Image source ↗');
        link.href = source;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        details.append(link);
      } else details.append(element('p', 'muted', 'Source page: not recorded'));
      card.append(img, details);
      return card;
    }),
  );
  controls();
  $('publish-dialog').showModal();
}

async function publishPanel() {
  if (!publishable() || !publishReview) return;
  const review = publishReview;
  if (
    review.modelId !== selected ||
    review.draftRevision !== library.revision ||
    review.draftHash !== savedModelHashes.get(selected) ||
    review.publishedRevision !== publication.revision
  ) {
    $('publish-dialog').close();
    message('The draft or published images changed. Review this panel again before publishing.');
    return;
  }
  busy = true;
  message();
  controls();
  try {
    const updated = await api('api/publish', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        modelId: review.modelId,
        draftRevision: review.draftRevision,
        publishedRevision: review.publishedRevision,
      }),
    });
    if (!updated.revision || !Array.isArray(updated.models))
      throw new Error(
        'The publication response was incomplete. Refresh publication status before trying again.',
      );
    publication = updated;
    publicationError = '';
    $('publish-dialog').close();
  } catch (error) {
    $('publish-dialog').close();
    if (error.status === 409) {
      await refreshPublication();
      message(
        'Publishing was stopped because the saved draft or published images changed. Your tab data is unchanged. Check publication status and reload the saved draft if another editor saved changes, then review again.',
      );
    } else {
      await refreshPublication();
      message(
        `Could not confirm publication. Check publication status before retrying. ${error.message}`,
      );
    }
  } finally {
    publishReview = undefined;
    busy = false;
    controls();
  }
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function message(text = '') {
  $('error').textContent = text;
  $('error').hidden = !text;
}

function model() {
  return library?.models.find((entry) => entry.id === selected);
}

function controls() {
  document.body.classList.toggle('busy', busy);
  $('main').setAttribute('aria-busy', String(busy));
  document.querySelectorAll('input, textarea, button').forEach((node) => {
    node.disabled = busy;
  });
  $('save').disabled = busy || !library || !dirty || conflict;
  $('export').disabled = busy || !library;
  $('add-files').disabled = busy || !model();
  publicationControls();
  document.querySelectorAll('[data-boundary="true"]').forEach((node) => {
    node.disabled = true;
  });
  const status = $('save-status');
  status.classList.toggle('unsaved', dirty);
  if (busy) return;
  if (conflict)
    status.textContent =
      'A newer saved draft exists. Your changes are still here; export them before reloading.';
  else if (dirty) status.textContent = 'Unsaved changes · kept in this tab until you save';
  else if (savedAt)
    status.textContent = `Private draft saved at ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  else if (library) status.textContent = 'Saved private draft · no website changes';
  $('reload').hidden = !conflict;
}

function changed() {
  dirty = true;
  controls();
}

async function api(path, options = {}) {
  const response = await fetch(new URL(path, adminBase), {
    credentials: 'same-origin',
    ...options,
    headers: { accept: 'application/json', ...options.headers },
  });
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    const error = new Error(
      response.status === 401
        ? 'Your session has expired. Export any unsaved changes, then reload to sign in again.'
        : response.status === 409 && path !== 'api/publish'
          ? 'Someone saved a newer draft. Your changes have not been overwritten. Export your work, then reload the saved draft to reconcile it.'
          : data.message ||
            data.error ||
            `The request failed (${response.status}). Please try again.`,
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

function fileUrl(key) {
  return new URL(`api/file?${new URLSearchParams({ key })}`, adminBase).href;
}

function masterDownload(link, image) {
  link.href = fileUrl(image.original.key);
  link.download = `${image.id}.${image.original.extension}`;
}

function masterFacts(image) {
  const original = image.original;
  return `${original.width} × ${original.height} · ${original.extension.toUpperCase()} · ${(original.bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function sourceUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function renderModels() {
  if (!library) return;
  const search = $('model-search').value.toLowerCase().trim();
  const entries = library.models.filter((entry) =>
    `${entry.title} ${entry.id}`.toLowerCase().includes(search),
  );
  $('model-count').textContent = `${entries.length} of ${library.models.length} models`;
  $('models').replaceChildren(
    ...entries.map((entry) => {
      const button = element('button');
      button.type = 'button';
      button.append(
        element('span', '', entry.title),
        element('span', 'model-badge', entry.images.length),
      );
      if (entry.id === selected) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => {
        selected = entry.id;
        if ($('preview').open) $('preview').close();
        renderModels();
        renderPanel();
        controls();
      });
      return button;
    }),
  );
}

function field(labelText, value, onInput, options = {}) {
  const label = element('label', '', labelText);
  const input = document.createElement(options.multiline ? 'textarea' : 'input');
  if (!options.multiline) input.type = options.url ? 'url' : 'text';
  input.value = value ?? '';
  input.autocomplete = 'off';
  if (options.placeholder) input.placeholder = options.placeholder;
  input.addEventListener('input', () => {
    onInput(input.value);
    changed();
  });
  label.append(input);
  return label;
}

function action(text, label, callback) {
  const button = element('button', '', text);
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.addEventListener('click', callback);
  return button;
}

function renderPanel() {
  const entry = model();
  $('panel').hidden = !entry;
  if (!entry) return;
  $('panel-title').textContent = entry.title;
  $('panel-subtitle').textContent =
    `${entry.id} · ${entry.images.length} ${entry.images.length === 1 ? 'image' : 'images'} selected`;
  const heroIndex = entry.images.findIndex((image) => image.id === entry.heroImageId);
  $('hero-status').textContent =
    heroIndex < 0
      ? 'No hero selected. Choose the image that best represents this product.'
      : `Image ${heroIndex + 1} is the hero for this private draft. Gallery order is unchanged.`;
  $('empty').hidden = entry.images.length !== 0;
  $('gallery').replaceChildren(
    ...entry.images.map((image, index) => {
      const card = element('article', 'image-card');
      card.setAttribute('aria-label', `Image ${index + 1}: ${image.alt || image.id}`);
      const top = element('div', 'image-top');
      top.append(
        element(
          'span',
          image.id === entry.heroImageId ? 'thumbnail-label' : '',
          `${String(index + 1).padStart(2, '0')} · ${image.id === entry.heroImageId ? 'Hero image' : 'Gallery image'}`,
        ),
        element('span', '', 'Private draft'),
      );
      const preview = action('', `Enlarge image ${index + 1}`, () => openPreview(index));
      preview.className = 'image-preview';
      const img = element('img');
      img.src = fileUrl(image.delivery.thumb);
      img.alt = image.alt;
      img.loading = 'lazy';
      preview.append(img);
      const fields = element('div', 'image-fields');
      fields.append(
        field(
          'Caption / alternative text',
          image.alt,
          (value) => {
            image.alt = value;
            img.alt = value;
          },
          { multiline: true },
        ),
        field(
          'Photo credit',
          image.credit,
          (value) => {
            image.credit = value;
          },
          { placeholder: 'Who created or supplied this image?' },
        ),
      );
      const details = element('details');
      details.append(element('summary', '', 'Source, licence & archive details'));
      const sources = element('div', 'source-fields');
      image.source ??= { page: '', url: '', licence: 'unknown', notes: '' };
      for (const [key, label, options] of [
        ['page', 'Source page URL', { url: true, placeholder: 'https://… or unknown' }],
        ['url', 'Original image URL', { url: true, placeholder: 'https://… or unknown' }],
        [
          'licence',
          'Licence / permission evidence',
          {
            multiline: true,
            placeholder: 'Record the permission or licence; use unknown when unestablished.',
          },
        ],
        ['notes', 'Provenance notes', { multiline: true }],
      ])
        sources.append(
          field(
            label,
            image.source[key],
            (value) => {
              image.source[key] = value;
            },
            options,
          ),
        );
      const original = image.original;
      sources.append(
        element(
          'p',
          'image-facts',
          `Archived original: ${original.width} × ${original.height} · ${(original.bytes / 1024 / 1024).toFixed(2)} MiB · ${original.extension.toUpperCase()}`,
        ),
        element('p', 'image-facts', `SHA-256: ${original.sha256}`),
        element(
          'p',
          'image-facts',
          `Publication review: ${image.review || 'pending'}. Saving does not approve publication.`,
        ),
      );
      if (image.source.discovered)
        sources.append(
          element('p', 'image-facts', `Discovery recorded: ${image.source.discovered}`),
        );
      details.append(sources);
      fields.append(details);
      const master = element('div', 'master-tools');
      const download = element('a', 'button', '↓ Download full-resolution master');
      download.setAttribute('aria-label', `Download full-resolution master for image ${index + 1}`);
      masterDownload(download, image);
      const editLabel = element('label', 'button', 'Upload edited master');
      const edit = element('input', 'visually-hidden');
      edit.type = 'file';
      edit.accept = ACCEPT;
      edit.setAttribute('aria-label', `Upload edited master for image ${index + 1}`);
      edit.addEventListener('change', () => {
        if (edit.files[0]) uploadFiles([edit.files[0]], entry, index, true);
        edit.value = '';
      });
      editLabel.append(edit);
      master.append(download, element('p', 'image-facts', masterFacts(image)), editLabel);
      const actions = element('div', 'card-actions');
      const isHero = image.id === entry.heroImageId;
      const hero = action(
        isHero ? '★ Hero · Clear' : '☆ Use as hero',
        isHero ? `Clear hero image ${index + 1}` : `Use image ${index + 1} as hero`,
        () => {
          entry.heroImageId = isHero ? null : image.id;
          dirty = true;
          renderPanel();
          controls();
          $('gallery').children[index].querySelector('[aria-pressed]').focus();
        },
      );
      hero.setAttribute('aria-pressed', String(isHero));
      const move = (to) => {
        entry.images.splice(index, 1);
        entry.images.splice(to, 0, image);
        dirty = true;
        renderPanel();
        controls();
      };
      const up = action('↑', `Move image ${index + 1} earlier`, () => move(index - 1));
      const down = action('↓', `Move image ${index + 1} later`, () => move(index + 1));
      up.dataset.boundary = String(index === 0);
      down.dataset.boundary = String(index === entry.images.length - 1);
      const replaceLabel = element('label', 'button', 'Replace original');
      const replace = element('input', 'visually-hidden');
      replace.type = 'file';
      replace.accept = ACCEPT;
      replace.setAttribute('aria-label', `Replace original for image ${index + 1}`);
      replace.addEventListener('change', () => {
        if (replace.files[0]) uploadFiles([replace.files[0]], entry, index);
        replace.value = '';
      });
      replaceLabel.append(replace);
      const remove = action('Remove', `Remove image ${index + 1} from this panel`, () => {
        if (
          !confirm(
            'Remove this image from the panel gallery? Its archived original and replacement history will be retained. Save the private draft to keep this selection change.',
          )
        )
          return;
        entry.images.splice(index, 1);
        if (entry.heroImageId === image.id) entry.heroImageId = null;
        dirty = true;
        renderModels();
        renderPanel();
        controls();
      });
      remove.className = 'remove';
      actions.append(hero, up, down, replaceLabel, remove);
      card.append(top, preview, master, fields, actions);
      return card;
    }),
  );
}

function openPreview(index) {
  previewIndex = index;
  updatePreview();
  $('preview').showModal();
}

function updatePreview() {
  const entry = model();
  const image = entry.images[previewIndex];
  $('preview-title').textContent = entry.title;
  $('preview-image').src = fileUrl(image.delivery.large);
  $('preview-image').alt = image.alt;
  $('preview-alt').textContent = image.alt;
  $('preview-credit').textContent = image.credit;
  masterDownload($('preview-download'), image);
  $('preview-master-facts').textContent = masterFacts(image);
  const source = sourceUrl(image.source?.page);
  $('preview-source').hidden = !source;
  if (source) $('preview-source').href = source;
  else $('preview-source').removeAttribute('href');
  $('preview-position').textContent =
    `${previewIndex + 1} of ${entry.images.length} · Private preview`;
  $('preview-previous').hidden = $('preview-next').hidden = entry.images.length < 2;
}

function advancePreview(direction) {
  previewIndex = (previewIndex + direction + model().images.length) % model().images.length;
  updatePreview();
}

async function renditions(file) {
  const isJxl =
    file.type === 'image/jxl' ||
    ((!file.type || file.type === 'application/octet-stream') && /\.jxl$/i.test(file.name));
  if (!TYPES.has(file.type) && !isJxl)
    throw new Error(`${file.name}: choose a JPEG, PNG, WebP or JPEG XL original.`);
  if (file.size === 0 || file.size > MAX_FILE)
    throw new Error(`${file.name}: originals must be between 1 byte and 25 MiB.`);
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    const encode = async (maximum, quality) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('This browser could not prepare the image previews.');
      const toBlob = (type) =>
        new Promise((resolve) => {
          try {
            canvas.toBlob(resolve, type, quality);
          } catch {
            resolve(null);
          }
        });
      let edge = Math.min(maximum, Math.max(image.naturalWidth, image.naturalHeight));
      while (true) {
        const scale = edge / Math.max(image.naturalWidth, image.naturalHeight);
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let blob = await toBlob('image/webp');
        if (!blob || blob.type !== 'image/webp' || blob.size === 0) {
          blob = await toBlob('image/png');
          if (!blob || blob.type !== 'image/png')
            throw new Error('This browser could not prepare WebP or PNG image previews.');
        }
        if (blob.size > 0 && blob.size <= MAX_PREVIEW) return blob;
        if (blob.size === 0 || edge <= 1)
          throw new Error(`${file.name}: each image preview must be between 1 byte and 5 MiB.`);
        edge = Math.max(1, Math.floor(edge * 0.8));
      }
    };
    return { thumb: await encode(480, 0.82), large: await encode(2400, 0.9) };
  } catch (error) {
    if (error instanceof DOMException)
      throw new Error(
        isJxl
          ? `${file.name}: this browser could not decode the JPEG XL master. JPEG XL decoder support is required to prepare its previews; the master has not been uploaded.`
          : `${file.name}: the browser could not decode this image.`,
      );
    throw error;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function uploadFiles(files, entry, replacing, editedMaster = false) {
  if (busy || !files.length) return;
  busy = true;
  message();
  $('upload-notice').hidden = true;
  controls();
  try {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const previous = replacing === undefined ? null : entry.images[replacing];
      $('save-status').textContent =
        `Preparing and privately archiving ${index + 1} of ${files.length}: ${file.name}…`;
      const views = await renditions(file);
      const meta = {
        alt: previous?.alt ?? file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
        credit: '',
        source: { page: 'unknown', url: 'unknown', licence: 'unknown', notes: '' },
      };
      if (previous && editedMaster) {
        meta.credit = previous.credit;
        meta.source = { ...previous.source };
        meta.source.notes = [
          previous.source.notes,
          `Maintainer-edited master derived from archived image ${previous.id} (SHA-256 ${previous.original.sha256}). Prior source and licence details are retained; this edit does not establish additional reuse permission.`,
        ]
          .filter(Boolean)
          .join('\n');
      } else if (previous)
        meta.source.notes = `Replaces archived image ${previous.id} (SHA-256 ${previous.original.sha256}). Source and permission details for this replacement have not been established.`;
      const form = new FormData();
      form.append('original', file, file.name);
      form.append(
        'thumb',
        views.thumb,
        `thumb.${views.thumb.type === 'image/png' ? 'png' : 'webp'}`,
      );
      form.append(
        'large',
        views.large,
        `large.${views.large.type === 'image/png' ? 'png' : 'webp'}`,
      );
      form.append('meta', JSON.stringify(meta));
      const result = await api('api/upload', { method: 'POST', body: form });
      const image = result.image ?? result;
      if (!image.id || !image.original?.key || !image.delivery?.thumb || !image.delivery?.large)
        throw new Error('The archive response was incomplete. Reload before trying again.');
      if (replacing === undefined) entry.images.push(image);
      else {
        entry.images.splice(replacing, 1, image);
        if (entry.heroImageId === previous.id) entry.heroImageId = image.id;
        $('upload-notice').textContent = editedMaster
          ? 'Edited master archived. Caption, credit and source details were kept, and the previous master is retained. Save the private draft to use this version.'
          : 'Replacement archived. Its caption was kept; credit, source and licence start unknown. Enter this photograph’s details before saving. The previous original is retained.';
        $('upload-notice').hidden = false;
      }
      dirty = true;
    }
  } catch (error) {
    message(error.message);
  } finally {
    busy = false;
    renderModels();
    renderPanel();
    controls();
  }
}

async function save() {
  if (busy || !dirty || conflict) return;
  busy = true;
  controls();
  message();
  $('save-status').textContent = 'Saving your private draft…';
  try {
    const updated = await api('api/library', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(library),
    });
    if (!updated.revision || !Array.isArray(updated.models))
      throw new Error(
        'The save response was incomplete. Reload the saved draft before making further changes.',
      );
    library = updated;
    await rememberSavedModels();
    dirty = false;
    savedAt = new Date();
    renderModels();
    renderPanel();
  } catch (error) {
    conflict = error.status === 409;
    message(error.message);
  } finally {
    busy = false;
    controls();
  }
}

function exportLibrary() {
  if (!library) return;
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(library, null, 2) + '\n'], { type: 'application/json' }),
  );
  const anchor = element('a');
  anchor.href = url;
  anchor.download = `panel-images-private-draft-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function load() {
  busy = true;
  controls();
  message();
  $('save-status').textContent = 'Loading saved private catalogue…';
  try {
    const data = await api('api/library');
    if (!data.revision || !Array.isArray(data.models))
      throw new Error('The catalogue response was incomplete. Reload to try again.');
    library = data;
    await rememberSavedModels();
    selected = library.models.some((entry) => entry.id === selected)
      ? selected
      : library.models[0]?.id;
    dirty = false;
    conflict = false;
    savedAt = null;
    renderModels();
    renderPanel();
    await refreshPublication();
  } catch (error) {
    message(error.message);
    $('save-status').textContent = 'Could not load the catalogue. Reload to retry.';
  } finally {
    busy = false;
    controls();
  }
}

$('model-search').addEventListener('input', renderModels);
$('save').addEventListener('click', save);
$('publish-review').addEventListener('click', reviewPublication);
$('publish-confirm').addEventListener('click', publishPanel);
$('publication-retry').addEventListener('click', refreshPublication);
$('publish-cancel').addEventListener('click', () => $('publish-dialog').close());
$('publish-dialog').addEventListener('close', () => {
  publishReview = undefined;
});
$('publish-dialog').addEventListener('cancel', (event) => {
  if (busy) event.preventDefault();
});
$('export').addEventListener('click', exportLibrary);
$('reload').addEventListener('click', () => {
  if (
    !dirty ||
    confirm(
      'Discard the changes in this tab and reload the saved draft? Export JSON first if you need to keep them.',
    )
  )
    load();
});
$('add-files').addEventListener('change', () => {
  uploadFiles([...$('add-files').files], model());
  $('add-files').value = '';
});
$('logout').addEventListener('click', async () => {
  if (
    dirty &&
    !confirm(
      'Sign out and leave unsaved changes? Export JSON or save the private draft first to keep them.',
    )
  )
    return;
  try {
    await api('session', { method: 'DELETE' });
    dirty = false;
    window.location.assign(adminBase.href);
  } catch (error) {
    message(error.message);
  }
});
$('preview-close').addEventListener('click', () => $('preview').close());
$('preview-previous').addEventListener('click', () => advancePreview(-1));
$('preview-next').addEventListener('click', () => advancePreview(1));
$('preview').addEventListener('keydown', (event) => {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    advancePreview(event.key === 'ArrowRight' ? 1 : -1);
  }
});
window.addEventListener('beforeunload', (event) => {
  if (dirty || busy) {
    event.preventDefault();
    event.returnValue = '';
  }
});
load();
