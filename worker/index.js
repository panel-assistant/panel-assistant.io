// Answers /go/<topic> with a redirect and hands everything else to the static site.
import topics from './topics.json' with { type: 'json' };
import { resolve } from './resolve.js';
import { recordMiss } from './misses.js';
// The build facts come from the published directory, which is what the deploy
// job has in hand; the source copy is not part of a checkout.
import build from '../dist/build.json' with { type: 'json' };

export default {
  async fetch(request, env) {
    const hit = resolve(request.url, topics);
    if (!hit) return env.ASSETS.fetch(request);

    if (!hit.known && hit.topic) recordMiss(env.GO_MISSES, hit.missKey ?? hit.topic);
    return new Response(null, {
      status: 302,
      headers: {
        location: hit.location,
        // A topic may be re-pointed at any time, so nothing may remember the answer.
        'cache-control': 'no-store',
        'x-panel-assistant-build': `${build.number ?? 'local'} ${build.sha ?? ''}`.trim(),
      },
    });
  },
};
