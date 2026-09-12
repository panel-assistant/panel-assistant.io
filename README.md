# panel-assistant.io

Source for [panel-assistant.io](https://panel-assistant.io), the website for Panel Assistant, the Home Assistant integration that turns Android wall panels into fast, dependable appliances running your existing dashboards.

The site is a static build made with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/). Every push to `main` builds the site and publishes it to Cloudflare through GitHub Actions.

## The project

Panel Assistant has two parts. This repository is only the website.

- [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) is the Home Assistant integration: the installer, the per-panel devices and the page that shows all of your panels. It is installed through HACS.
- [maxlyth/ha-paneld](https://github.com/maxlyth/ha-paneld) is the app the integration puts on each panel, and the reference documentation lives there.

## Help links: `/go/<topic>`

Software that ships a link to this site never links to a page path, because a link inside a released integration outlives any page layout. It links to `https://panel-assistant.io/go/<topic>`, and the site answers with a redirect to whatever the current best page for that topic is. The table of topics is [worker/topics.json](worker/topics.json), served by the small Worker in [worker/index.js](worker/index.js). Re-pointing a topic is a one-line change there; removing one is not allowed, because links already shipped depend on it. Query parameters such as the caller's version travel through untouched to the site's own pages, and are never forwarded to a destination off the site, and an unknown topic lands on the homepage with the topic named in a `go` parameter rather than on a 404. `npm test` checks every topic against the pages and anchors the build actually produced. A request for a topic the table does not know is counted, topic name only and never its parameters, in a Workers Analytics Engine dataset, so a topic that ships in software before the site learns it shows up rather than going unnoticed; `node worker/misses-report.mjs` prints the last week's misses given a Cloudflare token with account analytics read access.

## Build numbers

Every page ends with a build line, and the same facts are published at [/build.json](https://panel-assistant.io/build.json). The number is the count of commits reachable from the built commit, so it climbs by one for every commit that lands on `main`, is the same on a laptop and in CI, and needs no counter kept anywhere else; the short SHA beside it makes any build traceable. A build of anything other than `main` is marked `preview`. After publishing, CI fetches the live `/build.json` and fails if it does not name the commit just published, so a green deploy run means the site really changed.

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
npm test               # the /go redirect table against the pages the build produced
```

`npm run format` rewrites files in place. The same checks run in CI on every push and pull request. To exercise the redirect Worker itself, `npx wrangler dev --config worker/wrangler.jsonc` serves the built site with the router in front of it.

## Layout

| Path                | What it holds                                                                         |
| ------------------- | ------------------------------------------------------------------------------------- |
| `src/content/docs/` | Every page, as Markdown. The homepage is `index.mdx`.                                 |
| `src/assets/`       | Images processed at build time.                                                       |
| `public/`           | Files served as they are, such as the favicon.                                        |
| `astro.config.mjs`  | Site configuration and the sidebar.                                                   |
| `worker/`           | The `/go/<topic>` redirect router, its topic table, and the Cloudflare configuration. |
| `src/build-info/`   | Writes the build number before every build; see below.                                |

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Licence

Free and open source under the Apache License 2.0. See [LICENSE](LICENSE).

The icon and favicon in `src/assets/` and `public/` are the project's application artwork, shared from [maxlyth/ha-paneld](https://github.com/maxlyth/ha-paneld) as part of the same project. They include the Home Assistant mark, which remains the property of the Home Assistant project and is not covered by this repository's licence. Panel Assistant is an independent project and is not affiliated with or endorsed by Home Assistant. All product names, trademarks and registered trademarks are the property of their respective owners.
