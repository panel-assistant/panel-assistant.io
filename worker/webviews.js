// The private bucket contains only curated APKs, stored under their SHA-256 filename.
export async function handleWebView(request, env) {
  const { pathname } = new URL(request.url);
  const key = pathname.slice('/downloads/webview/'.length);
  if (!/^[a-f0-9]{64}\.apk$/.test(key)) return new Response(null, { status: 404 });
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, { status: 405, headers: { allow: 'GET, HEAD' } });
  }
  const object = await env.WEBVIEWS[request.method === 'HEAD' ? 'head' : 'get'](key);
  if (!object) return new Response(null, { status: 404 });
  const headers = new Headers({
    'content-type': 'application/vnd.android.package-archive',
    'content-length': String(object.size),
    'content-disposition': `attachment; filename="${key}"`,
    'cache-control': 'public, max-age=31536000, immutable',
    'x-content-type-options': 'nosniff',
    etag: object.httpEtag,
  });
  const tags = request.headers
    .get('if-none-match')
    ?.split(',')
    .map((tag) => tag.trim());
  if (tags?.some((tag) => tag === '*' || tag.replace(/^W\//, '') === object.httpEtag)) {
    headers.delete('content-length');
    return new Response(null, { status: 304, headers });
  }
  // Full responses are valid for Range requests; APK clients can always restart a download.
  return new Response(request.method === 'HEAD' ? null : object.body, { headers });
}
