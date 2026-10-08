import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolve } from '../../worker/resolve.js';

test('a historical release omits the retired allowed-app list from pages and settings links', () => {
  const root = mkdtempSync(join(tmpdir(), 'settings-reference-'));
  try {
    const source = join(root, 'android');
    const site = join(root, 'site');
    const kotlin = join(source, 'app/src/main/kotlin/io/github/maxlyth/hapaneld/config');
    const assets = join(source, 'app/src/main/assets/i18n');
    mkdirSync(kotlin, { recursive: true });
    mkdirSync(assets, { recursive: true });
    mkdirSync(join(site, 'src/settings'), { recursive: true });
    mkdirSync(join(site, 'public'), { recursive: true });
    for (const file of ['generate.mjs', 'extract.mjs', 'render.mjs'])
      cpSync(new URL(file, import.meta.url), join(site, 'src/settings', file));
    writeFileSync(
      join(kotlin, 'SettingsRegistry.kt'),
      `object SettingsRegistry {
    val SPECS: List<SettingSpec> = listOf(
        SettingSpec(key = "kiosk_lock", group = "Dashboard", tier = Tier.BASIC),
        SettingSpec(key = "kiosk_companion_packages", group = "Dashboard")
    )
}`,
    );
    writeFileSync(
      join(assets, 'en.json'),
      JSON.stringify({
        strings: {
          'settings.kiosk_lock.label': { text: 'Lock Android to dashboard' },
          'settings.kiosk_companion_packages.label': { text: 'Apps the lock allows' },
          'settings.kiosk_companion_packages.help': { text: 'Allowed package names' },
        },
      }),
    );
    const git = (...args) => execFileSync('git', args, { cwd: source, stdio: 'pipe' });
    git('init', '--quiet');
    git('add', '.');
    git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'fixture');
    git('tag', 'v0.9.8');
    execFileSync(process.execPath, ['src/settings/generate.mjs'], {
      cwd: site,
      env: { ...process.env, SETTINGS_SOURCE: source },
      stdio: 'pipe',
    });
    const page = readFileSync(join(site, 'src/content/docs/reference/settings/v0-9-8.md'), 'utf8');
    assert.match(page, /id="kiosk_lock"/);
    assert.doesNotMatch(
      page,
      /kiosk_companion_packages|Apps the lock allows|Allowed package names/,
    );
    const manifest = JSON.parse(readFileSync(join(site, 'public/settings-versions.json'), 'utf8'));
    assert.deepEqual(manifest.versions['0.9.8'].keys, ['kiosk_lock']);
    const link = resolve(
      'https://panel-assistant.io/go/settings?v=0.9.8&section=kiosk_companion_packages',
      { settings: '/reference/settings/' },
      manifest,
    );
    assert.equal(new URL(link.location).pathname, '/reference/settings/v0-9-8/');
    assert.equal(new URL(link.location).hash, '');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('each release is read from its own registry path across the package move', () => {
  const root = mkdtempSync(join(tmpdir(), 'settings-reference-'));
  try {
    const source = join(root, 'android');
    const site = join(root, 'site');
    mkdirSync(join(source, 'app/src/main/assets/i18n'), { recursive: true });
    mkdirSync(join(site, 'src/settings'), { recursive: true });
    mkdirSync(join(site, 'public'), { recursive: true });
    for (const file of ['generate.mjs', 'extract.mjs', 'render.mjs'])
      cpSync(new URL(file, import.meta.url), join(site, 'src/settings', file));
    const git = (...args) => execFileSync('git', args, { cwd: source, stdio: 'pipe' });
    const release = (pkg, key, tag) => {
      rmSync(join(source, 'app/src/main/kotlin'), { recursive: true, force: true });
      const dir = join(source, 'app/src/main/kotlin', pkg, 'config');
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, 'SettingsRegistry.kt'),
        `object SettingsRegistry {
    val SPECS: List<SettingSpec> = listOf(
        SettingSpec(key = "${key}", group = "Dashboard", tier = Tier.BASIC)
    )
}`,
      );
      writeFileSync(
        join(source, 'app/src/main/assets/i18n/en.json'),
        JSON.stringify({ strings: { [`settings.${key}.label`]: { text: key } } }),
      );
      git('add', '-A');
      git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', tag);
      git('tag', tag);
    };
    git('init', '--quiet');
    release('io/github/maxlyth/hapaneld', 'old_key', 'v0.9.9');
    release('io/panelassistant/android', 'new_key', 'v0.9.10');
    execFileSync(process.execPath, ['src/settings/generate.mjs'], {
      cwd: site,
      env: { ...process.env, SETTINGS_SOURCE: source },
      stdio: 'pipe',
    });
    const manifest = JSON.parse(readFileSync(join(site, 'public/settings-versions.json'), 'utf8'));
    assert.deepEqual(manifest.versions['0.9.9'].keys, ['old_key']);
    assert.deepEqual(manifest.versions['0.9.10'].keys, ['new_key']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
