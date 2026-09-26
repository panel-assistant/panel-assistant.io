// The site's own interface strings, typed from the English file so Astro.locals.t() accepts them.
declare namespace StarlightApp {
  type SiteStrings = typeof import('./content/i18n/en.json');
  interface I18n extends SiteStrings {}
}
