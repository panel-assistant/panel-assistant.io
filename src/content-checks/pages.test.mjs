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
const elements = (path, tags = 'p|li') =>
  [...content(path).matchAll(new RegExp(`<(${tags})\\b[^>]*>([\\s\\S]*?)<\\/\\1>`, 'g'))].map((m) =>
    plain(m[2]),
  );
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

test('the page the 0.9 panel notice links names that notice and leads on to 1.0', () => {
  // The 0.9.8 to 0.9.11 panel apps show "Panel Assistant is required" with panel-assistant.io/go/migration.
  const page = html('/home-assistant/migration/');
  assert.match(page, /<title>Panel Assistant is required/);
  assert.ok(!text('/home-assistant/migration/').includes('After the 0.9.8 update'));
  assert.match(content('/home-assistant/migration/'), /href="\/manage\/upgrade-to-1-0\/"/);
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

test('the install-recovery topic Panel Assistant links from its install failures lands on a section for each way an install stops', () => {
  const topics = JSON.parse(readFileSync('worker/topics.json', 'utf8'));
  const [page, anchor] = topics['install-recovery'].split('#');
  const section = content(page).split(`id="${anchor}"`)[1]?.split('<h2')[0];
  assert.ok(section, `${page} has no #${anchor}`);
  for (const id of [
    'no-apk-was-installed',
    'installed-but-not-started-or-checked',
    'the-install-may-have-changed-the-panel',
  ])
    assert.ok(section.includes(`id="${id}"`), `#${anchor} has no #${id}`);
});

test('Move a panel from MQTT sends a reader already on 1.0 to the unfinished-move steps, not back to 0.9.0', () => {
  // Downloading 0.9.0 again over 1.0 hands moved panels back to MQTT; the upgrade page restores the backup instead.
  const pages = localized('/home-assistant/move-from-mqtt/');
  assert.ok(pages.length > 1);
  for (const path of pages)
    assert.deepEqual(
      elements(path).filter((e) => e.includes('0.9.0') && e.includes('HACS')),
      [],
      path,
    );
  assert.match(
    content('/home-assistant/move-from-mqtt/'),
    /href="\/manage\/upgrade-to-1-0\/#if-a-move-was-not-finished"/,
  );
  assert.match(html('/manage/upgrade-to-1-0/'), /id="if-a-move-was-not-finished"/);
});

test('the control reference offers the Volume number only on a panel without a speaker', () => {
  // Panel Assistant 1.0 creates no number.<panel>_volume on a panel with a speaker, and removes an old one.
  const rows = elements('/reference/api/', 'p|li|tr');
  const volume = rows.filter((e) => /number\.&lt;panel&gt;_volume|Volume number/.test(e));
  assert.ok(volume.length > 0);
  for (const row of volume) assert.match(row, /without a speaker/, row);
  const set = rows.find((e) => e.startsWith('Set the volume.'));
  assert.match(
    set ?? '',
    /speaker[^.]*media_player\.volume_set|media_player\.volume_set[^.]*speaker/,
  );
});

test('no instruction for a Configure page setting asks the reader to save', () => {
  // The 1.0 Configure page sends each change as it is made and has no Save button. Settings reference
  // pages exist only for 0.9 releases, which had one, so their Save steps stay, except the Zigbee
  // router's: a preview reader follows the newest page, and the 0.9 app's own hint still says to save.
  const step = /^save\b|\band save\b|\bbefore you save\b|\bsave any\b/i;
  for (const path of [
    '/manage/voice-assistant/',
    '/manage/custom-wake-words/',
    '/manage/built-in-renderer/',
  ])
    assert.deepEqual(
      elements(path).filter((e) => step.test(e.trim())),
      [],
      path,
    );
  const settings = englishPages().filter((p) => p.startsWith('/reference/settings/v'));
  const zigbee = settings.filter((p) => content(p).includes('<h3 id="zigbee_router"'));
  assert.ok(zigbee.length > 0);
  for (const path of zigbee) {
    const section = content(path).split('<h3 id="zigbee_router"')[1].split('<h3 ')[0];
    const steps = [...section.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => plain(m[1]));
    assert.deepEqual(
      steps.filter((e) => step.test(e.trim())),
      [],
      path,
    );
  }
});
