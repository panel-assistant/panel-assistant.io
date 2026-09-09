# panel-assistant.io

Source for the Panel Assistant website: the product pages and documentation for running Home Assistant dashboards on Android wall panels.

The site is a static build made with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/). It is not deployed from this repository yet, and nothing here changes hosting or DNS.

## The project

Panel Assistant is the project around **ha-paneld**, the Android application that runs on a wall panel and turns it into a Home Assistant control surface. ha-paneld is the runtime component; this repository is only the website.

- [maxlyth/ha-paneld](https://github.com/maxlyth/ha-paneld) is the Android app, and the reference documentation lives there.
- [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) is the Home Assistant custom integration. It has not been released.

## Local preview

Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

That serves the site at http://localhost:4321 with live reload. `npm run build` writes the static site to `dist/`, and `npm run preview` serves that build so you can check the production output.

## Checks

```sh
npm run format:check   # Prettier
npm run check          # Astro content and type check
npm run build          # production build, which also validates internal links
```

`npm run format` rewrites files in place. The same three checks run in CI on every push and pull request.

## Layout

| Path                | What it holds                                         |
| ------------------- | ----------------------------------------------------- |
| `src/content/docs/` | Every page, as Markdown. The homepage is `index.mdx`. |
| `src/assets/`       | Images processed at build time.                       |
| `public/`           | Files served as they are, such as the favicon.        |
| `astro.config.mjs`  | Site configuration and the sidebar.                   |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

Free and open source under the Apache License 2.0. See [LICENSE](LICENSE).

The icon and favicon in `src/assets/` and `public/` are the ha-paneld application artwork, shared from [maxlyth/ha-paneld](https://github.com/maxlyth/ha-paneld) as part of the same project. They include the Home Assistant mark, which remains the property of the Home Assistant project and is not covered by this repository's licence. Panel Assistant is an independent project and is not affiliated with or endorsed by Home Assistant. All product names, trademarks and registered trademarks are the property of their respective owners.
