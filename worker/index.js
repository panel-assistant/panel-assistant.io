// Answers /go/<topic> with a redirect and hands everything else to the static site.
import topics from './topics.json';
import { resolve } from './resolve.js';

export default {
  async fetch(request, env) {
    const hit = resolve(request.url, topics);
    if (!hit) return env.ASSETS.fetch(request);
    return new Response(null, {
      status: 302,
      headers: {
        location: hit.location,
        // A topic may be re-pointed at any time, so nothing may remember the answer.
        'cache-control': 'no-store',
      },
    });
  },
};
