// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

const paneldRepo = 'https://github.com/maxlyth/ha-paneld';

export default defineConfig({
  site: 'https://panel-assistant.io',
  integrations: [
    starlight({
      title: 'Panel Assistant',
      description:
        'Documentation for Panel Assistant, the project behind ha-paneld, the Home Assistant dashboard app for Android wall panels.',
      logo: {
        src: './src/assets/icon.svg',
        alt: '',
      },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'ha-paneld on GitHub', href: paneldRepo }],
      plugins: [starlightLinksValidator()],
      credits: false,
      lastUpdated: true,
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Getting started', slug: 'start/getting-started' },
            { label: 'What Panel Assistant is', slug: 'start/what-it-is' },
          ],
        },
        {
          label: 'Install',
          items: [
            { label: 'Choose a panel', slug: 'install/supported-panels' },
            { label: 'Prepare the panel', slug: 'install/prepare-a-panel' },
            { label: 'Install ha-paneld', slug: 'install/installing-ha-paneld' },
          ],
        },
        {
          label: 'Home Assistant',
          items: [
            { label: 'Connect a panel', slug: 'home-assistant/connect-a-panel' },
            { label: 'Custom integration', slug: 'home-assistant/custom-integration' },
          ],
        },
        {
          label: 'Keep it running',
          items: [
            { label: 'Updates and recovery', slug: 'manage/updates-and-recovery' },
            { label: 'Troubleshooting', slug: 'manage/troubleshooting' },
          ],
        },
      ],
    }),
  ],
});
