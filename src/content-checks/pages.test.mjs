// Checks the built site against what Panel Assistant and the panel app do: run after `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LOCALES = ['de', 'es', 'fr', 'it', 'nl', 'pl', 'uk', 'zh-hans'];

// Panel Assistant's `options.step.init.menu_options.remove_app` in translations/en.json, at 1.0.0-preview1.
const REMOVE_OPTION = 'Remove Panel Assistant from this panel';
// The broadcast that frees an ADB uninstall of the panel app, as Panel Assistant's own removal sends it.
const RELEASE_RECEIVER = 'ReleaseDeviceAdminReceiver';

const html = (path) => readFileSync(`dist${path}index.html`, 'utf8');
const plain = (fragment) =>
  fragment
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
// The page's own content, without the navigation, which names every page.
const content = (path) => html(path).split('<main')[1] ?? '';
const text = (path) => plain(content(path));
const elements = (path) =>
  [...content(path).matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => plain(m[2]));
const localized = (path) =>
  ['', ...LOCALES.map((l) => `/${l}`)]
    .filter((p) => existsSync(`dist${p}${path}index.html`))
    .map((p) => p + path);

const englishPages = (dir = 'dist') =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return dir === 'dist' && LOCALES.includes(name) ? [] : englishPages(path);
    }
    return name === 'index.html' ? [path.slice('dist'.length, -'index.html'.length)] : [];
  });

test('a page that tells the reader to uninstall the panel app names how to release its device admin', () => {
  const tellsToUninstall = (t) =>
    /\buninstalling first\b|\b(adb|pm) uninstall\b/i.test(t) || /^Uninstall\b/.test(t);
  const instructing = englishPages().filter((path) =>
    elements(path).some((t) => tellsToUninstall(t.trim())),
  );
  assert.ok(
    instructing.includes('/reference/development-environment/'),
    'the check no longer sees the developer page',
  );
  const missing = instructing.filter((path) => {
    const t = text(path);
    return !t.includes(RELEASE_RECEIVER) && !t.includes(REMOVE_OPTION);
  });
  assert.deepEqual(missing, []);
});

test('the removal-risks page names the remove option as Panel Assistant labels it', () => {
  const labels = [
    ...content('/manage/removal-risks/').matchAll(/<strong>([^<]*from this panel)<\/strong>/g),
  ].map((m) => m[1]);
  assert.deepEqual(labels, [REMOVE_OPTION]);
});

test('no display-sizing page says no standard values ship, and the English page says what setup applies', () => {
  const removed = [
    'no standard values ship',
    'keine Standardwerte',
    'no se incluyen valores estándar',
    'aucune valeur standard',
    'non vengono forniti valori standard',
    '不提供统一的标准数值',
  ];
  const pages = localized('/manage/display-sizing/');
  assert.ok(pages.length > 1);
  for (const path of pages) {
    const t = text(path);
    for (const phrase of removed) assert.ok(!t.includes(phrase), `${path} still says "${phrase}"`);
  }
  const english = text('/manage/display-sizing/');
  assert.match(english, /recommended density/);
  assert.match(english, /once over its ADB connection/);
  assert.match(english, /puts the previous values back/);
});

test('the migration page and the 0.1.0 section give the old-app route in order', () => {
  const route = /old ha-paneld app[\s\S]*?0\.9\.0[\s\S]*?Repair[\s\S]*?1\.0/;
  assert.match(text('/home-assistant/migration/'), route);
  // The heading's own anchor link repeats its text, so take what follows the last copy.
  const section = text('/home-assistant/custom-integration/')
    .split('If you used the earlier 0.1.0 integration')
    .at(-1);
  assert.match(section, route);
  assert.ok(
    !text('/home-assistant/migration/').includes('connects to the app already on the panel'),
  );
  const unchanged = [
    'Nothing on the panel itself changes',
    'Op het paneel zelf verandert niets',
    'Na samym panelu nic się nie zmienia',
    'На самій панелі нічого не змінюється',
  ];
  for (const path of localized('/home-assistant/custom-integration/')) {
    for (const phrase of unchanged)
      assert.ok(!text(path).includes(phrase), `${path} still says "${phrase}"`);
  }
});

test('no prepare-a-panel page asks for a fixed address, and the English page says a moved panel is followed', () => {
  const pages = localized('/install/prepare-a-panel/');
  assert.ok(pages.length > 1);
  for (const path of pages)
    assert.ok(!text(path).includes('DHCP'), `${path} still asks for a DHCP reservation`);
  assert.match(text('/install/prepare-a-panel/'), /follows a panel whose address changes/);
});

test('the Dutch, Polish and Ukrainian setup pages no longer send readers to wireless debugging', () => {
  const wireless = [
    'draadloze foutopsporing',
    'debugowanie bezprzewodowe',
    'debugowania bezprzewodowego',
    'бездротове налагодження',
  ];
  for (const locale of ['nl', 'pl', 'uk']) {
    for (const page of ['/install/prepare-a-panel/', '/start/getting-started/']) {
      const t = text(`/${locale}${page}`).toLowerCase();
      for (const phrase of wireless)
        assert.ok(!t.includes(phrase), `/${locale}${page} still says "${phrase}"`);
    }
  }
});
