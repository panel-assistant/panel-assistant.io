// Accepts a comment from someone without a GitHub account and posts it into the page's
// discussion through the bot account, so it lives in GitHub Discussions beside every other
// comment. Nothing about the comment or its poster is kept here: the only state touched is the
// rate limiter's per-address counter, which Cloudflare holds and expires.

const GRAPHQL = 'https://api.github.com/graphql';
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

// The discussion title giscus uses for a page under `data-mapping="pathname"`.
export function termFor(pathname) {
  return pathname.length < 2 ? 'index' : pathname.substring(1).replace(/\.\w+$/, '');
}

export async function sha1(text) {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// A reader's text must not ping people or carry raw HTML into the repository. GitHub decodes
// entities before it looks for mentions, and an HTML comment between `@` and a name still
// mentions inside a table cell, so every `@` becomes the fullwidth at sign, which GitHub never
// reads as a mention in any context. `&` is escaped first so no entity can decode back to `@`.
export function commentBody(text, name) {
  const safe = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('@', '\uff20');
  const who = name ? `**${safe(name)}**` : 'A reader';
  return `${safe(text)}\n\n<sub>${who} posted this on panel-assistant.io without a GitHub account.</sub>`;
}

function cleanName(value, max) {
  return String(value ?? '')
    .replace(/[^\p{L}\p{N} .'_-]/gu, '')
    .trim()
    .slice(0, max);
}

function ogDescription(html) {
  const m = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/);
  if (!m) return '';
  return m[1]
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

async function graphql(fetcher, token, query, variables) {
  const res = await fetcher(GRAPHQL, {
    method: 'POST',
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'panel-assistant.io comments',
    },
    body: JSON.stringify({ query, variables }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || out.errors || !out.data) throw new Error('github');
  return out.data;
}

// Finds the discussion giscus would show for this term: strict mapping matches the SHA-1 marker
// in the body. Search lags behind a fresh discussion, so recent discussions are checked too.
async function findDiscussion(fetcher, token, config, hash) {
  const marker = `<!-- sha1: ${hash} -->`;
  const q = `repo:${config.repo.toLowerCase()} category:${JSON.stringify(config.category)} in:body ${JSON.stringify(hash)}`;
  const found = await graphql(
    fetcher,
    token,
    'query($q: String!) { search(type: DISCUSSION, first: 1, query: $q) { nodes { ... on Discussion { id body } } } }',
    { q },
  );
  const hit = found.search.nodes.find((n) => n?.body?.includes(marker));
  if (hit) return hit.id;

  const [owner, name] = config.repo.split('/');
  const recent = await graphql(
    fetcher,
    token,
    'query($owner: String!, $name: String!, $cat: ID!) { repository(owner: $owner, name: $name) { discussions(first: 50, categoryId: $cat, orderBy: { field: CREATED_AT, direction: DESC }) { nodes { id body } } } }',
    { owner, name, cat: config.categoryId },
  );
  return recent.repository.discussions.nodes.find((n) => n?.body?.includes(marker))?.id ?? null;
}

export async function handleComment(request, env, config, fetcher = fetch) {
  if (request.method !== 'POST') return json(405, { error: 'method' });

  const url = new URL(request.url);
  if (request.headers.get('origin') !== url.origin) return json(403, { error: 'origin' });
  if (!env.COMMENT_RATE || !env.TURNSTILE_SECRET_KEY || !env.GITHUB_BOT_TOKEN) {
    return json(503, { error: 'unavailable' });
  }

  const address = request.headers.get('cf-connecting-ip') ?? '';
  const { success: allowed } = await env.COMMENT_RATE.limit({ key: address });
  if (!allowed) return json(429, { error: 'rate' });

  let form;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: 'form' });
  }
  const text = String(form.get('body') ?? '').trim();
  const name = cleanName(form.get('name'), config.maxName);
  const page = String(form.get('page') ?? '');
  const token = String(form.get('cf-turnstile-response') ?? '');
  if (!text) return json(400, { error: 'empty' });
  if (text.length > config.maxBody) return json(413, { error: 'long' });
  // Every page ends in a slash; the same page without one would name a discussion giscus never shows.
  if (!/^\/([a-z0-9_-]+\/)*$/.test(page)) return json(400, { error: 'page' });

  const verify = await fetcher(SITEVERIFY, {
    method: 'POST',
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: address,
    }),
  });
  const verdict = await verify.json().catch(() => ({}));
  if (verdict.success !== true || !config.turnstileHostnames.includes(verdict.hostname)) {
    return json(403, { error: 'challenge' });
  }

  // Only a page the site actually serves gets a discussion, so the form cannot mint arbitrary ones.
  const pageUrl = new URL(page, url.origin);
  const served = await env.ASSETS.fetch(new Request(pageUrl));
  if (served.status !== 200) return json(400, { error: 'page' });

  const term = termFor(pageUrl.pathname);
  const hash = await sha1(term);
  const bot = env.GITHUB_BOT_TOKEN;
  try {
    let discussionId = await findDiscussion(fetcher, bot, config, hash);
    if (!discussionId) {
      // The same body giscus writes when a signed-in reader starts a page's discussion.
      const description = ogDescription(await served.text());
      const body = `# ${term}\n\n${description}\n\n${pageUrl.href}\n\n<!-- sha1: ${hash} -->`;
      const created = await graphql(
        fetcher,
        bot,
        'mutation($input: CreateDiscussionInput!) { createDiscussion(input: $input) { discussion { id } } }',
        {
          input: { repositoryId: config.repoId, categoryId: config.categoryId, title: term, body },
        },
      );
      discussionId = created.createDiscussion.discussion.id;
    }
    const added = await graphql(
      fetcher,
      bot,
      'mutation($input: AddDiscussionCommentInput!) { addDiscussionComment(input: $input) { comment { url } } }',
      { input: { discussionId, body: commentBody(text, name) } },
    );
    return json(201, { url: added.addDiscussionComment.comment.url });
  } catch {
    return json(502, { error: 'github' });
  }
}
