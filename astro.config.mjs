// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import { satteri } from '@astrojs/markdown-satteri';
import { assetUrls, ASSET_BASE } from './src/plugins/asset-urls.mjs';
import en from './src/content/i18n/en.json' with { type: 'json' };
import nl from './src/content/i18n/nl.json' with { type: 'json' };
import pl from './src/content/i18n/pl.json' with { type: 'json' };
import uk from './src/content/i18n/uk.json' with { type: 'json' };

// A sidebar label and its translations, from the same files as the rest of the site's own text.
/** @type {Record<string, Record<string, string>>} */
const others = { nl, pl, uk };
/** @param {keyof typeof en} key */
const label = (key) => ({
  label: en[key],
  translations: Object.fromEntries(
    Object.entries(others)
      .filter(([, strings]) => strings[key])
      .map(([lang, strings]) => [lang, strings[key]]),
  ),
});

const integrationRepo = 'https://github.com/panel-assistant/ha-integration';

// Images and other binaries live in one R2 bucket. Pages write `asset:<key>`.
const assetBase = ASSET_BASE;

export default defineConfig({
  site: 'https://panel-assistant.io',
  markdown: {
    processor: satteri({ mdastPlugins: [assetUrls({ base: assetBase })] }),
  },
  integrations: [
    starlight({
      title: 'Panel Assistant',
      description:
        'Home Assistant, on the wall, done properly. Fast, dependable Android wall panels for your Home Assistant dashboards, installed and managed from Home Assistant itself.',
      logo: {
        src: './src/assets/icon.svg',
        alt: '',
      },
      favicon: '/favicon.svg',
      // English is the source and lives at the root. A page not yet translated is served at its
      // localized path in English, with Starlight's notice saying so.
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        nl: { label: 'Nederlands', lang: 'nl' },
        pl: { label: 'Polski', lang: 'pl' },
        uk: { label: 'Українська', lang: 'uk' },
      },
      social: [
        {
          icon: 'discord',
          label: 'Panel Assistant on Discord',
          href: 'https://panel-assistant.io/go/discord',
        },
        { icon: 'github', label: 'Panel Assistant on GitHub', href: integrationRepo },
      ],
      customCss: [
        '@fontsource-variable/manrope',
        '@fontsource-variable/source-sans-3',
        './src/styles/theme.css',
      ],
      components: {
        Head: './src/components/Head.astro',
        Header: './src/components/Header.astro',
        Hero: './src/components/Hero.astro',
        PageTitle: './src/components/PageTitle.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        Footer: './src/components/Footer.astro',
        LastUpdated: './src/components/LastUpdated.astro',
      },
      // Panel pages link to their entry in the page editor at /admin/.
      routeMiddleware: './src/editor/route-data.ts',
      // Untranslated pages are served as English fallbacks, and a translated page must link inside
      // its own language.
      plugins: [
        starlightLinksValidator({ errorOnFallbackPages: false, errorOnInconsistentLocale: true }),
      ],
      credits: false,
      lastUpdated: true,
      sidebar: [
        {
          ...label('sidebar.documentation'),
          items: [
            {
              ...label('sidebar.start'),
              items: [
                { ...label('sidebar.getting_started'), slug: 'start/getting-started' },
                { ...label('sidebar.how_it_works'), slug: 'start/what-it-is' },
                { ...label('sidebar.community'), slug: 'start/community' },
              ],
            },
            {
              ...label('sidebar.install'),
              items: [
                { ...label('sidebar.choose_panel'), slug: 'install/supported-panels' },
                { ...label('sidebar.prepare_panel'), slug: 'install/prepare-a-panel' },
                { ...label('sidebar.add_panel'), slug: 'install/installing-ha-paneld' },
                { ...label('sidebar.install_usb'), slug: 'install/install-over-usb' },
                { label: 'How installs stay safe', slug: 'manage/install-safety' },
              ],
            },
            {
              label: 'Home Assistant',
              items: [
                {
                  ...label('sidebar.install_integration'),
                  slug: 'home-assistant/custom-integration',
                },
                { label: 'After the 0.9.8 update', slug: 'home-assistant/migration' },
                { ...label('sidebar.connect_panel'), slug: 'home-assistant/connect-a-panel' },
                { label: 'Understand a support report', slug: 'home-assistant/support-report' },
                { ...label('sidebar.move_from_mqtt'), slug: 'home-assistant/move-from-mqtt' },
              ],
            },
            {
              ...label('sidebar.features'),
              items: [
                { label: 'Built-in renderer', slug: 'manage/built-in-renderer' },
                { label: 'Adaptive brightness', slug: 'manage/adaptive-brightness' },
                { label: 'Adaptive proximity', slug: 'manage/adaptive-proximity' },
                { label: 'Display sizing', slug: 'manage/display-sizing' },
                { label: 'Text-to-speech', slug: 'manage/text-to-speech' },
                { label: 'Voice assistant', slug: 'manage/voice-assistant' },
                { label: 'Custom wake words', slug: 'manage/custom-wake-words' },
                { label: 'Vendor packages', slug: 'manage/vendor-packages' },
                { label: 'Panel account and network security', slug: 'manage/panel-security' },
                { label: 'Security mode', slug: 'manage/security-mode' },
              ],
            },
            {
              ...label('sidebar.keep_running'),
              items: [
                { label: 'Updates and recovery', slug: 'manage/updates-and-recovery' },
                { label: 'Performance', slug: 'manage/performance' },
                { label: 'Troubleshooting', slug: 'manage/troubleshooting' },
                { label: 'Install script (retired)', slug: 'manage/command-line-install' },
              ],
            },
          ],
        },
        {
          ...label('sidebar.hardware'),
          items: [
            { label: 'Overview', slug: 'hardware' },
            {
              label: 'Panels',
              // Mostly autogenerated (add a page, it appears), but Starlight's nested autogenerate
              // groups take their label from the raw directory name with no override, so the two
              // multi-model vendors get an explicit label wrapping their own subfolder autogenerate.
              // Adding a model to Shelly or Sonoff needs no edit here; adding a new vendor does.
              items: [
                { slug: 'hardware/panels/electron-wf1589t' },
                {
                  label: 'Shelly Wall Display',
                  items: [{ autogenerate: { directory: 'hardware/panels/shelly' } }],
                },
                { slug: 'hardware/panels/smatek-s9e' },
                {
                  label: 'Sonoff NSPanel Pro',
                  items: [{ autogenerate: { directory: 'hardware/panels/sonoff-nspanel-pro' } }],
                },
                { slug: 'hardware/panels/tuya-tpa10' },
                { slug: 'hardware/panels/zhicai-smt1019' },
                { slug: 'hardware/panels/zx-smt156' },
              ],
            },
            {
              label: 'Firmware',
              items: [
                { label: 'Overview', slug: 'hardware/firmware' },
                { label: 'Browse builds', slug: 'hardware/firmware/builds' },
                { label: 'NSPanel Pro guide', slug: 'hardware/firmware/nspanel-pro' },
              ],
            },
            { label: 'Guides', items: [{ autogenerate: { directory: 'hardware/guides' } }] },
            { label: 'Third-party tools', slug: 'hardware/tools' },
          ],
        },
        {
          ...label('sidebar.reference'),
          items: [
            { label: 'Overview', slug: 'reference' },
            { label: 'API', slug: 'reference/api' },
            {
              label: 'Settings',
              items: [{ autogenerate: { directory: 'reference/settings' } }],
            },
            {
              label: 'Profiles',
              items: [
                { label: 'Overview', slug: 'reference/profiles' },
                { label: 'Format', slug: 'reference/profiles/format' },
                { label: 'Testing', slug: 'reference/profiles/testing' },
                { label: 'Sharing', slug: 'reference/profiles/sharing' },
                { label: 'Architecture', slug: 'reference/profiles/architecture' },
                {
                  label: 'Community profiles',
                  items: [{ autogenerate: { directory: 'reference/profiles/community' } }],
                },
              ],
            },
            { label: 'Security', slug: 'reference/security' },
            { label: 'Development environment', slug: 'reference/development-environment' },
            {
              label: 'Code tour on DeepWiki',
              link: 'https://deepwiki.com/panel-assistant/android',
              attrs: { target: '_blank', rel: 'noopener' },
            },
          ],
        },
      ],
    }),
  ],
});
