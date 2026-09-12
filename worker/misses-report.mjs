// Prints the /go topics that missed over the last week, most missed first.
// Needs CLOUDFLARE_API_TOKEN with Account Analytics Read and CLOUDFLARE_ACCOUNT_ID.
// Usage: node worker/misses-report.mjs [days]
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const days = Number(process.argv[2] ?? 7);
if (!token || !account) {
  console.error('Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.');
  process.exit(2);
}
// _sample_interval weights each row by how many requests it stands for, so the
// sum is the estimated miss count even when the engine sampled under load.
const sql = `
  SELECT index1 AS topic,
         SUM(_sample_interval) AS misses,
         MIN(timestamp) AS first_seen,
         MAX(timestamp) AS last_seen
  FROM panel_assistant_go_misses
  WHERE timestamp > NOW() - INTERVAL '${Math.max(1, Math.min(days, 90))}' DAY
  GROUP BY topic
  ORDER BY misses DESC
  LIMIT 100`;
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`,
  {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: sql,
  },
);
if (!response.ok) {
  console.error(`query failed: ${response.status} ${await response.text()}`);
  process.exit(1);
}
const { data } = await response.json();
if (!data.length) {
  console.log(`no missed topics in the last ${days} day(s)`);
} else {
  console.table(data);
}
