// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import { satteri } from '@astrojs/markdown-satteri';
import { assetUrls, ASSET_BASE } from './src/plugins/asset-urls.mjs';

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
      plugins: [starlightLinksValidator()],
      credits: false,
      lastUpdated: true,
      sidebar: [
        {
          label: 'Documentation',
          items: [
            {
              label: 'Start here',
              items: [
                { label: 'Getting started', slug: 'start/getting-started' },
                { label: 'How it works', slug: 'start/what-it-is' },
                { label: 'Community', slug: 'start/community' },
              ],
            },
            {
              label: 'Install',
              items: [
                { label: 'Choose a panel', slug: 'install/supported-panels' },
                { label: 'Prepare the panel', slug: 'install/prepare-a-panel' },
                { label: 'Add a panel', slug: 'install/installing-ha-paneld' },
                { label: 'Install over USB', slug: 'install/install-over-usb' },
                { label: 'How installs stay safe', slug: 'manage/install-safety' },
              ],
            },
            {
              label: 'Home Assistant',
              items: [
                { label: 'Install the integration', slug: 'home-assistant/custom-integration' },
                { label: 'Connect a panel', slug: 'home-assistant/connect-a-panel' },
                { label: 'Move a panel from MQTT', slug: 'home-assistant/move-from-mqtt' },
              ],
            },
            {
              label: 'Features',
              items: [
                { label: 'Built-in renderer', slug: 'manage/built-in-renderer' },
                { label: 'Adaptive brightness', slug: 'manage/adaptive-brightness' },
                { label: 'Adaptive proximity', slug: 'manage/adaptive-proximity' },
                { label: 'Display sizing', slug: 'manage/display-sizing' },
                { label: 'Text-to-speech', slug: 'manage/text-to-speech' },
                { label: 'Vendor packages', slug: 'manage/vendor-packages' },
                { label: 'Security mode', slug: 'manage/security-mode' },
              ],
            },
            {
              label: 'Keep it running',
              items: [
                { label: 'Updates and recovery', slug: 'manage/updates-and-recovery' },
                { label: 'Performance', slug: 'manage/performance' },
                { label: 'Troubleshooting', slug: 'manage/troubleshooting' },
                { label: 'Command-line install', slug: 'manage/command-line-install' },
              ],
            },
          ],
        },
        {
          label: 'Hardware',
          items: [
            { label: 'Overview', slug: 'hardware' },
            { label: 'Panels', items: [{ autogenerate: { directory: 'hardware/panels' } }] },
            { label: 'Firmware', items: [{ autogenerate: { directory: 'hardware/firmware' } }] },
            { label: 'Guides', items: [{ autogenerate: { directory: 'hardware/guides' } }] },
            { label: 'Third-party tools', slug: 'hardware/tools' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Overview', slug: 'reference' },
            { label: 'API', slug: 'reference/api' },
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
              link: 'https://deepwiki.com/maxlyth/ha-paneld',
              attrs: { target: '_blank', rel: 'noopener' },
            },
          ],
        },
      ],
    }),
  ],
});
