// Records which build this is. Runs before every build and dev server.
//
// The build number is the count of commits reachable from HEAD, so it climbs by
// one for every commit that lands on main, is the same on a laptop and in CI,
// and needs no counter kept anywhere else. The short SHA makes it traceable.
// The channel is "main" for a build of main and "preview" for anything else, so
// a branch build never presents itself as a numbered release of the site.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const git = (...args) => {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
};

const count = git('rev-list', '--count', 'HEAD');
const sha = git('rev-parse', '--short=7', 'HEAD');
const date = git('log', '-1', '--format=%cI');
const branch =
  process.env.BUILD_CHANNEL ??
  (git('rev-parse', '--abbrev-ref', 'HEAD') === 'main' ? 'main' : 'preview');

const info = {
  number: count ? Number(count) : null,
  sha: sha ?? null,
  date: date ?? null,
  channel: branch,
};

const here = fileURLToPath(new URL('.', import.meta.url));
const json = JSON.stringify(info, null, 2) + '\n';
writeFileSync(new URL('./build.json', import.meta.url), json);
mkdirSync(new URL('../../public/', import.meta.url), { recursive: true });
writeFileSync(new URL('../../public/build.json', import.meta.url), json);
console.log(
  `build ${info.number ?? '?'} (${info.sha ?? 'no git'}) ${info.channel}, written from ${here}`,
);
