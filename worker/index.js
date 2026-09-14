// Answers /go/<topic> with a redirect, takes anonymous comments at /comments, signs editors in
// with GitHub at /oauth/, and hands everything else to the static site.
import topics from './topics.json' with { type: 'json' };
import { resolve } from './resolve.js';
import { recordMiss } from './misses.js';
import { handleComment } from './comments.js';
import commentConfig from './comments.json' with { type: 'json' };
import { handleEditorAuth } from './editor-auth.js';
import editorConfig from './editor.json' with { type: 'json' };
// The build facts come from the published directory, which is what the deploy
// job has in hand; the source copy is not part of a checkout.
import build from '../dist/build.json' with { type: 'json' };

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/comments') {
      return handleComment(request, env, commentConfig);
    }
    if (pathname.startsWith(`${editorConfig.authBase}/`)) {
      return handleEditorAuth(request, env, editorConfig);
    }

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
