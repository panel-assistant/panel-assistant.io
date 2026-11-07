import { z } from 'astro/zod';

export const BEHAVIORS = [
  'dashboard',
  'brightness',
  'sleep-wake',
  'light',
  'proximity',
  'buttons',
  'leds',
  'relays',
  'speaker',
  'microphone',
  'restart',
];
const fact = z.string().trim().min(1).max(512);
const source = z
  .url()
  .refine((value) => new URL(value).protocol === 'https:', 'Use an HTTPS source');
const date = z.union([z.literal('unknown'), z.iso.date()]);
export const ownerReportSchema = z.strictObject({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  source,
  observed: date,
  model: z.strictObject({ manufacturer: fact, name: fact }),
  firmware: z.strictObject({ build: fact, android: fact }),
  software: z.strictObject({
    appVersion: fact,
    appBuild: fact,
    integrationVersion: fact,
    integrationBuild: fact,
  }),
  profile: z.strictObject({
    level: z.enum(['unknown', 'generic', 'community', 'built-in']),
    id: fact,
    revision: fact,
  }),
  results: z
    .array(
      z.strictObject({
        behavior: z.enum(BEHAVIORS),
        outcome: z.enum(['works', 'fails', 'untested', 'not-fitted']),
        notes: z.string().max(2000),
      }),
    )
    .min(1)
    .max(BEHAVIORS.length)
    .refine(
      (items) => new Set(items.map((item) => item.behavior)).size === items.length,
      'Duplicate behavior',
    ),
  limitations: z.array(z.string().trim().min(1).max(2000)).max(20),
});
export const ownerReportsSchema = z
  .array(ownerReportSchema)
  .max(100)
  .refine(
    (reports) => new Set(reports.map((report) => report.id)).size === reports.length,
    'Duplicate report ID',
  );

/** Only an explicit working dashboard earns basic compatibility evidence. */
export function dashboardReports(data) {
  return (data.ownerReports ?? []).filter((report) =>
    report.results.some((result) => result.behavior === 'dashboard' && result.outcome === 'works'),
  );
}
