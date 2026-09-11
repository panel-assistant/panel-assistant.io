// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

const integrationRepo = 'https://github.com/panel-assistant/ha-integration';

export default defineConfig({
  site: 'https://panel-assistant.io',
  integrations: [
    starlight({
      title: 'Panel Assistant',
      description:
        'The universal wall panel product for Home Assistant. Fast, dependable Android wall panels that run your existing dashboards, set up and managed from Home Assistant itself.',
      logo: {
        src: './src/assets/icon.svg',
        alt: '',
      },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'Panel Assistant on GitHub', href: integrationRepo }],
      components: { SiteTitle: './src/components/SiteTitle.astro' },
      plugins: [starlightLinksValidator()],
      credits: false,
      lastUpdated: true,
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Getting started', slug: 'start/getting-started' },
            { label: 'How it works', slug: 'start/what-it-is' },
          ],
        },
        {
          label: 'Install',
          items: [
            { label: 'Choose a panel', slug: 'install/supported-panels' },
            { label: 'Prepare the panel', slug: 'install/prepare-a-panel' },
            { label: 'Add a panel', slug: 'install/installing-ha-paneld' },
            { label: 'Install over USB', slug: 'install/install-over-usb' },
          ],
        },
        {
          label: 'Home Assistant',
          items: [
            { label: 'Install the integration', slug: 'home-assistant/custom-integration' },
            { label: 'Connect a panel', slug: 'home-assistant/connect-a-panel' },
          ],
        },
        {
          label: 'Keep it running',
          items: [
            { label: 'Updates and recovery', slug: 'manage/updates-and-recovery' },
            { label: 'Troubleshooting', slug: 'manage/troubleshooting' },
            { label: 'Command-line install', slug: 'manage/command-line-install' },
          ],
        },
      ],
    }),
  ],
});
