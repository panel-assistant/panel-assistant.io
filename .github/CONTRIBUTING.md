# Contributing

This repository holds the source of the Panel Assistant website. It is documentation and site code, not the application; changes to ha-paneld itself belong in [maxlyth/ha-paneld](https://github.com/maxlyth/ha-paneld), and changes to the Home Assistant integration in [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration).

## Getting set up

Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:4321 and reloads as you edit.

## Before you open a pull request

```sh
npm run format:check
npm run check
npm run build
```

These are the same three checks CI runs. `npm run format` fixes formatting in place. The build fails on a broken internal link, so a page that links to one that does not exist yet will not pass.

The built site loads nothing from anywhere else and contains no analytics. Astro's build tooling reports anonymous usage data by default; CI turns that off with `ASTRO_TELEMETRY_DISABLED=1`, and `npx astro telemetry disable` turns it off for your own machine.

## Writing for this site

- The reference documentation lives with the code in the ha-paneld repository. Pages here should summarise and link onward rather than restate detail that will drift out of date.
- Say what is true today. Anything unreleased or unfinished is labelled as such, in the page and not only in a commit message.
- No forecasts, dates or promises about future functionality.
- Write prose as continuous paragraphs. Do not wrap lines at a fixed column.
- Use British spelling.

## Commits

Conventional commit subjects: `feat:`, `fix:`, `docs:`, `chore:`, `build:`, `ci:`. Keep the subject in the imperative and explain the reasoning in the body when it is not obvious.

## Reporting a problem with the site

Open an issue in this repository. Problems with a panel, an installation or the app itself belong in the [ha-paneld issues](https://github.com/maxlyth/ha-paneld/issues), where the people who can answer them are looking.

If you attach a diagnostic report to an issue, read it through first and remove anything that identifies your panel, your network, your Home Assistant setup or your dashboard content. An issue is public.

## Licence

Contributions are made under the Apache License 2.0, the same licence as the rest of this repository.
