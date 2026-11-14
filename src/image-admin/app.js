import { sessionInfo, signIn } from './auth.js';
import { reconcileDraft } from './merge.js';

const $ = (id) => document.getElementById(id);
const adminBase = new URL('./', import.meta.url);
const MAX_FILE = 25 * 1024 * 1024;
const MAX_PREVIEW = 5 * 1024 * 1024;
const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jxl']);
const ACCEPT = 'image/jpeg,image/png,image/webp,image/jxl,.jxl';
let library;
let savedLibrary;
let selected;
let dirty = false;
let busy = false;
let conflict = false;
let savedAt;
let previewIndex = 0;
let previewModelId;
let allImages = false;
let publication;
let publicationError = '';
let publicationLoading = false;
let savedModelHashes = new Map();
let publishReview;
let sessionRequired = false;
const selectedSources = new Set();

function signedIn(session) {
  $('session-identity').textContent =
    `Signed in as @${session.login}${session.remembered ? ' · remembered device' : ''}`;
  $('session-identity').title = session.expiresAt
    ? `Session expires ${new Date(session.expiresAt).toLocaleString()}`
    : '';
  $('session-remember').checked = Boolean(session.remembered);
  sessionRequired = false;
  $('session-recovery').hidden = true;
}

function requireSession() {
  sessionRequired = true;
  $('session-identity').textContent = 'GitHub sign-in has expired';
  $('session-recovery').hidden = false;
}

async function renewSession() {
  if (busy) return;
  busy = true;
  message();
  controls();
  try {
    signedIn(
      await signIn({
        remember: $('session-remember').checked,
        onStatus: (text) => ($('session-status').textContent = text),
      }),
    );
    message(
      library
        ? 'Signed in with GitHub. Your edits are still here. Retry your previous action when ready.'
        : 'Signed in with GitHub. Choose Reload saved draft to load the catalogue.',
    );
  } catch (error) {
    $('session-status').textContent = error.message;
  } finally {
    busy = false;
    controls();
  }
}

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
    !allImages &&
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
  const images = entry.images.filter((image) => !image.archiveOnly);
  const hero = images.findIndex((image) => image.id === entry.heroImageId);
  const sources = entry.images.length - images.length;
  $('publish-summary').textContent =
    `${images.length} ${images.length === 1 ? 'image' : 'images'} in the order below. ${hero < 0 ? 'No hero image selected.' : `Image ${hero + 1} is the hero.`} ${sources} source ${sources === 1 ? 'master stays' : 'masters stay'} private and excluded.${images.length ? '' : ' Publishing this empty selection removes all public images for this panel.'}`;
  $('publish-images').replaceChildren(
    ...images.map((image, index) => {
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
  document.querySelectorAll('input, textarea, select, button').forEach((node) => {
    node.disabled = busy;
  });
  document.querySelectorAll('[data-master-download]').forEach((node) => {
    node.setAttribute('aria-disabled', String(busy));
  });
  $('all-images-link').disabled = busy || !library;
  $('save').disabled = busy || !library || !dirty || conflict;
  $('export').disabled = busy || !library;
  $('add-files').disabled = busy || !model();
  $('add-sources').disabled = busy || !model();
  sourceSelectionControls();
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
  $('reload').hidden = !conflict && Boolean(library);
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
  if (!response.ok) throw responseError(response, data, path);
  return data;
}

function responseError(response, data = {}, path = '') {
  if (response.status === 401) requireSession();
  const error = new Error(
    response.status === 401
      ? 'Your session has expired. Sign in again with GitHub below; your edits stay in this tab.'
      : data.code === 'library_revision_conflict' && path === 'api/library'
        ? 'Someone saved a newer draft. Your changes have not been overwritten. Export your work, then reload the saved draft to reconcile it.'
        : data.message ||
          data.error ||
          `The request failed (${response.status}). Please try again.`,
  );
  error.status = response.status;
  error.code = data.code;
  return error;
}

function fileUrl(key) {
  return new URL(`api/file?${new URLSearchParams({ key })}`, adminBase).href;
}

function masterDownload(link, image) {
  link.href = fileUrl(image.original.key);
  link.download = `${image.id}.${image.original.extension}`;
  link.dataset.masterDownload = '';
  link.setAttribute('aria-disabled', String(busy));
  link.onclick = (event) => {
    event.preventDefault();
    downloadMaster(image);
  };
}

async function downloadMaster(image) {
  if (busy) return;
  busy = true;
  message();
  controls();
  $('save-status').textContent = 'Downloading full-resolution master…';
  try {
    const response = await fetch(fileUrl(image.original.key), { credentials: 'same-origin' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw responseError(response, data, 'api/file');
    }
    const url = URL.createObjectURL(await response.blob());
    const link = element('a');
    link.href = url;
    link.download = `${image.id}.${image.original.extension}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    if ($('preview').open) $('preview').close();
    message(error.message);
    $('error').scrollIntoView({ block: 'nearest' });
  } finally {
    busy = false;
    controls();
  }
}

function masterFacts(image) {
  const original = image.original;
  return `${original.width} × ${original.height} · ${original.extension.toUpperCase()} · ${(original.bytes / 1024 / 1024).toFixed(2)} MiB. The private master is unchanged and may contain location, software and Photoshop editing metadata. Public previews have nonvisual metadata removed by the server; colour profiles and transparency are kept.`;
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
        element(
          'span',
          'model-badge',
          `${entry.images.filter((image) => !image.archiveOnly).length} gallery · ${entry.images.filter((image) => image.archiveOnly).length} sources`,
        ),
      );
      if (!allImages && entry.id === selected) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => {
        openPanel(entry);
      });
      return button;
    }),
  );
}

function openPanel(entry, image) {
  if (busy) return;
  if (selected !== entry.id) selectedSources.clear();
  selected = entry.id;
  allImages = false;
  if ($('preview').open) $('preview').close();
  renderModels();
  renderPanel();
  controls();
  if (image) {
    const card = [...document.querySelectorAll('#panel [data-image-id]')].find(
      (node) => node.dataset.imageId === image.id,
    );
    card?.querySelector('.image-preview').focus();
    card?.scrollIntoView({ block: 'center' });
  }
}

function storageSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KiB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function renderAllImages() {
  const rows = library.models.flatMap((entry) =>
    entry.images.map((image, index) => ({ entry, image, index })),
  );
  const unique = new Map(rows.map(({ image }) => [image.original.sha256, image.original.bytes]));
  const total = [...unique.values()].reduce((sum, bytes) => sum + bytes, 0);
  $('panel-title').textContent = 'All images';
  $('panel-subtitle').textContent =
    `${rows.length} images across ${library.models.length} panels in this private draft`;
  $('master-storage').textContent = `${storageSize(total)} · ${unique.size} unique masters`;
  $('master-storage').title =
    `${total.toLocaleString()} bytes; duplicate master hashes counted once`;
  const search = $('image-search').value.trim().toLowerCase();
  const filtered = rows.filter(({ entry, image }) =>
    `${entry.title} ${entry.id} ${image.alt}`.toLowerCase().includes(search),
  );
  const order = $('image-sort').value;
  if (order !== 'panel')
    filtered.sort((a, b) =>
      order === 'smallest'
        ? a.image.original.bytes - b.image.original.bytes
        : b.image.original.bytes - a.image.original.bytes,
    );
  const filteredUnique = new Map(
    filtered.map(({ image }) => [image.original.sha256, image.original.bytes]),
  );
  $('image-results').textContent =
    `Showing ${filtered.length} of ${rows.length} images · ${storageSize([...filteredUnique.values()].reduce((sum, bytes) => sum + bytes, 0))} in ${filteredUnique.size} unique matching masters`;
  $('all-images-empty').hidden = filtered.length !== 0;
  $('all-images-grid').replaceChildren(
    ...filtered.map(({ entry, image, index }) => {
      const card = element('article', 'image-card storage-card');
      card.dataset.imageId = image.id;
      card.dataset.modelId = entry.id;
      const role = image.archiveOnly
        ? 'Source master'
        : image.id === entry.heroImageId
          ? 'Hero'
          : 'Gallery';
      const top = element('div', 'image-top');
      top.append(element('span', 'thumbnail-label', role));
      const preview = action('', `Preview ${image.alt || image.id} · ${entry.title}`, () =>
        openPreview(index, entry),
      );
      preview.className = 'image-preview';
      const img = element('img');
      img.src = fileUrl(image.delivery.thumb);
      img.alt = image.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      preview.append(img);
      const details = element('div', 'storage-details');
      const size = element('p', 'storage-size', storageSize(image.original.bytes));
      size.title = `${image.original.bytes.toLocaleString()} bytes`;
      details.append(
        element('h3', '', entry.title),
        element('p', 'image-facts', entry.id),
        element('p', '', image.alt || 'No caption recorded'),
        size,
        element(
          'p',
          'image-facts',
          `${image.original.width} × ${image.original.height} · ${image.original.extension.toUpperCase()} · original master`,
        ),
      );
      const actions = element('div', 'card-actions');
      const download = element('a', 'button', '↓ Download original');
      masterDownload(download, image);
      actions.append(
        download,
        action('Open panel', `Open ${entry.title} at ${image.alt || image.id}`, () =>
          openPanel(entry, image),
        ),
      );
      card.append(top, preview, details, actions);
      return card;
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

function sourceSelectionControls() {
  const sources = model()?.images.filter((image) => image.archiveOnly) ?? [];
  const ids = new Set(sources.map((image) => image.id));
  for (const id of selectedSources) if (!ids.has(id)) selectedSources.delete(id);
  const count = selectedSources.size;
  $('sources-select-all').disabled = busy || !sources.length;
  $('sources-select-all').checked = sources.length > 0 && count === sources.length;
  $('sources-select-all').indeterminate = count > 0 && count < sources.length;
  $('sources-selected-count').textContent = `${count} of ${sources.length} selected`;
  $('sources-remove-selected').disabled = busy || !count;
  document.querySelectorAll('[data-source-select]').forEach((checkbox) => {
    checkbox.checked = selectedSources.has(checkbox.dataset.sourceSelect);
    checkbox.closest('.image-card').classList.toggle('source-selected', checkbox.checked);
  });
}

function removeSelectedSources() {
  if (busy || !selectedSources.size) return;
  const entry = model();
  const count = entry.images.filter(
    (image) => image.archiveOnly && selectedSources.has(image.id),
  ).length;
  if (
    !count ||
    !confirm(
      `Remove ${count} selected source ${count === 1 ? 'master' : 'masters'} from ${entry.title}? Their bytes and previous saved history stay in storage. Save the private draft to keep this change.`,
    )
  )
    return;
  entry.images = entry.images.filter(
    (image) => !image.archiveOnly || !selectedSources.has(image.id),
  );
  selectedSources.clear();
  dirty = true;
  renderModels();
  renderPanel();
  controls();
  ($('sources').querySelector('[data-source-select]') ?? $('sources-empty')).focus();
}

function renderPanel() {
  const entry = model();
  $('panel').hidden = allImages || !entry;
  $('all-images').hidden = !allImages || !library;
  $('all-images-link').setAttribute('aria-current', allImages ? 'page' : 'false');
  $('publish-review').hidden = allImages;
  document.querySelector('.publication-line').hidden = allImages;
  if (allImages && library) {
    renderAllImages();
    return;
  }
  if (!entry) return;
  $('panel-title').textContent = entry.title;
  const gallery = entry.images.filter((image) => !image.archiveOnly);
  const sourceMasters = entry.images.filter((image) => image.archiveOnly);
  $('panel-subtitle').textContent =
    `${entry.id} · ${gallery.length} gallery images · ${sourceMasters.length} private source masters`;
  const heroIndex = gallery.findIndex((image) => image.id === entry.heroImageId);
  $('hero-status').textContent =
    heroIndex < 0
      ? 'No hero selected. Choose the image that best represents this product.'
      : `Image ${heroIndex + 1} is the hero for this private draft. Gallery order is unchanged.`;
  $('empty').hidden = gallery.length !== 0;
  $('sources-empty').hidden = sourceMasters.length !== 0;
  $('gallery').replaceChildren();
  $('sources').replaceChildren();
  entry.images.forEach((image, index) => {
    const container = image.archiveOnly ? $('sources') : $('gallery');
    const group = image.archiveOnly ? sourceMasters : gallery;
    const position = group.indexOf(image);
    const focusCard = () =>
      [...container.children].find((card) => card.dataset.imageId === image.id);
    const card = element('article', 'image-card');
    card.dataset.imageId = image.id;
    card.setAttribute('aria-label', `Image ${index + 1}: ${image.alt || image.id}`);
    const top = element('div', 'image-top');
    top.append(
      element(
        'span',
        image.id === entry.heroImageId ? 'thumbnail-label' : '',
        `${String(position + 1).padStart(2, '0')} · ${image.archiveOnly ? 'Private source master' : image.id === entry.heroImageId ? 'Hero image' : 'Gallery image'}`,
      ),
      element('span', '', 'Private draft'),
    );
    if (image.archiveOnly) {
      const label = element('label', 'source-select', 'Select');
      const checkbox = element('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.sourceSelect = image.id;
      checkbox.setAttribute('aria-label', `Select source image ${position + 1}`);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selectedSources.add(image.id);
        else selectedSources.delete(image.id);
        sourceSelectionControls();
      });
      label.prepend(checkbox);
      top.append(label);
    }
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
      sources.append(element('p', 'image-facts', `Discovery recorded: ${image.source.discovered}`));
    details.append(sources);
    fields.append(details);
    const master = element('div', 'master-tools');
    const download = element('a', 'button', '↓ Download full-resolution master');
    download.setAttribute('aria-label', `Download full-resolution master for image ${index + 1}`);
    masterDownload(download, image);
    const editLabel = element(
      'label',
      'button',
      image.archiveOnly ? 'Upload edited version to gallery' : 'Upload edited master',
    );
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
        focusCard().querySelector('[aria-pressed]').focus();
      },
    );
    hero.setAttribute('aria-pressed', String(isHero));
    const move = (neighbor) => {
      const to = entry.images.indexOf(neighbor);
      entry.images.splice(index, 1);
      entry.images.splice(to, 0, image);
      dirty = true;
      renderPanel();
      controls();
      const card = focusCard();
      (
        card.querySelector(`[data-move="${to < index ? 'earlier' : 'later'}"]:not(:disabled)`) ??
        card.querySelector('[data-move]:not(:disabled)') ??
        card.querySelector('[aria-pressed]')
      ).focus();
    };
    const up = action('↑', `Move image ${index + 1} earlier`, () => move(group[position - 1]));
    const down = action('↓', `Move image ${index + 1} later`, () => move(group[position + 1]));
    up.dataset.boundary = String(position === 0);
    down.dataset.boundary = String(position === group.length - 1);
    up.dataset.move = 'earlier';
    down.dataset.move = 'later';
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
    const remove = action(
      'Remove source',
      `Remove source image ${index + 1} from this panel`,
      () => {
        if (
          !confirm(
            'Remove this source master from the browsable library? Its bytes and previous saved history stay in storage. Save the private draft to keep this change.',
          )
        )
          return;
        entry.images.splice(index, 1);
        dirty = true;
        renderModels();
        renderPanel();
        controls();
        const neighbor = $('sources').children[Math.min(position, sourceMasters.length - 2)];
        (neighbor?.querySelector('[data-gallery-toggle]') ?? $('sources-empty')).focus();
      },
    );
    remove.className = 'remove';
    const toggle = action(
      image.archiveOnly ? 'Add to gallery' : 'Keep as source master',
      image.archiveOnly
        ? `Add source image ${index + 1} to gallery`
        : `Keep image ${index + 1} as a private source master`,
      () => {
        image.archiveOnly = !image.archiveOnly;
        if (entry.heroImageId === image.id) entry.heroImageId = null;
        dirty = true;
        renderModels();
        renderPanel();
        controls();
        const destination = image.archiveOnly ? $('sources') : $('gallery');
        [...destination.children]
          .find((node) => node.dataset.imageId === image.id)
          .querySelector('[data-gallery-toggle]')
          .focus();
      },
    );
    toggle.dataset.galleryToggle = '';
    if (image.archiveOnly) actions.append(toggle, up, down, remove);
    else actions.append(hero, up, down, replaceLabel, toggle);
    card.append(top, preview, master, fields, actions);
    container.append(card);
  });
  sourceSelectionControls();
}

function openPreview(index, entry = model()) {
  previewModelId = entry.id;
  previewIndex = index;
  updatePreview();
  $('preview').showModal();
}

function updatePreview() {
  const entry = library.models.find((entry) => entry.id === previewModelId);
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
    `${previewIndex + 1} of ${entry.images.length} · ${image.archiveOnly ? 'Private source master · excluded from publication' : 'Private gallery preview'}`;
  $('preview-previous').hidden = $('preview-next').hidden = entry.images.length < 2;
}

function advancePreview(direction) {
  const entry = library.models.find((entry) => entry.id === previewModelId);
  previewIndex = (previewIndex + direction + entry.images.length) % entry.images.length;
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

async function uploadFiles(files, entry, replacing, editedMaster = false, archiveOnly = false) {
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
      if (archiveOnly) image.archiveOnly = true;
      if (replacing === undefined) entry.images.push(image);
      else {
        if (previous.archiveOnly && editedMaster) entry.images.push(image);
        else {
          previous.archiveOnly = true;
          entry.images.splice(replacing, 1, image, previous);
          if (entry.heroImageId === previous.id) entry.heroImageId = image.id;
        }
        $('upload-notice').textContent = editedMaster
          ? 'Edited version added to the gallery. Caption, credit and source details were kept. The previous master remains in Source masters for future edits. Save the private draft to keep both.'
          : 'Replacement added to the gallery. Its caption was kept; credit, source and licence start unknown. Enter this photograph’s details before saving. The previous original remains in Source masters.';
      }
      const archived =
        replacing === undefined
          ? archiveOnly
            ? 'Source master archived privately and excluded from publication. Save the private draft to keep it in the source library.'
            : 'Master archived. Save the private draft to use this image.'
          : $('upload-notice').textContent;
      $('upload-notice').textContent =
        `${archived} Editing metadata is retained in the exact private master, which may also contain location or software details. The server removes nonvisual metadata from public previews.`;
      $('upload-notice').hidden = false;
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
    let pending = library;
    let baseline = savedLibrary;
    let reconciled = false;
    let updated;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        updated = await api('api/library', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(pending),
        });
        break;
      } catch (error) {
        if (error.code !== 'library_revision_conflict') throw error;
        if (attempt === 2)
          throw new Error(
            'The catalogue is still changing. Your edits are kept in this tab. Try Save private draft again shortly.',
          );
        const latest = await api('api/library');
        if (!latest.revision || !Array.isArray(latest.models))
          throw new Error(
            'The saved draft response was incomplete. Your edits are kept in this tab; try saving again.',
          );
        const result = reconcileDraft(baseline, pending, latest);
        if (result.conflicts.length) {
          conflict = true;
          throw new Error(
            `Both drafts changed the same information (${result.conflicts.slice(0, 3).join('; ')}). Nothing from this tab was saved. Your edits are still here; export them before reloading the saved draft.`,
          );
        }
        pending = result.library;
        baseline = latest;
        reconciled = true;
      }
    }
    if (!updated?.revision || !Array.isArray(updated.models))
      throw new Error(
        'The save response was incomplete. Reload the saved draft before making further changes.',
      );
    library = updated;
    savedLibrary = structuredClone(updated);
    if (reconciled)
      message(
        'Private draft saved. Independent changes from the newer saved draft were kept. No website images were published.',
      );
    await rememberSavedModels();
    dirty = false;
    savedAt = new Date();
    renderModels();
    renderPanel();
  } catch (error) {
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
    savedLibrary = structuredClone(data);
    selectedSources.clear();
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
$('all-images-link').addEventListener('click', () => {
  if (busy || !library) return;
  allImages = true;
  if ($('preview').open) $('preview').close();
  renderModels();
  renderPanel();
  controls();
});
$('image-search').addEventListener('input', renderAllImages);
$('image-sort').addEventListener('change', renderAllImages);
$('sources-select-all').addEventListener('change', () => {
  selectedSources.clear();
  if ($('sources-select-all').checked)
    for (const image of model().images) if (image.archiveOnly) selectedSources.add(image.id);
  sourceSelectionControls();
});
$('sources-remove-selected').addEventListener('click', removeSelectedSources);
$('session-sign-in').addEventListener('click', renewSession);
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
$('add-sources').addEventListener('change', () => {
  uploadFiles([...$('add-sources').files], model(), undefined, false, true);
  $('add-sources').value = '';
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
sessionInfo()
  .then((session) => {
    if (!sessionRequired) signedIn(session);
  })
  .catch((error) => {
    if (error.status === 401) requireSession();
    else $('session-identity').textContent = 'Could not check GitHub sign-in';
  });
load();
