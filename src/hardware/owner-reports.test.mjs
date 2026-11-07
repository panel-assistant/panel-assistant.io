import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { ownerReportSchema, ownerReportsSchema } from './owner-reports.mjs';
import { confidence, confidenceChecklist } from './catalogue.mjs';
const data = parse(
  readFileSync('src/content/docs/hardware/panels/sunworld/yc-sm55p.md', 'utf8').split(/^---$/m)[1],
);
const report = data.ownerReports[0];

test('curated report schema rejects ambiguous or unsafe evidence records', () => {
  assert.ok(ownerReportSchema.safeParse(report).success);
  const invalid = [
    { schemaVersion: 2 },
    { source: 'javascript:alert(1)' },
    { observed: '2026-02-30' },
    { profile: { ...report.profile, level: 'certified' } },
    { results: [{ behavior: 'root', outcome: 'works', notes: '' }] },
    { results: [...report.results, report.results[0]] },
    { model: { ...report.model, serial: 'private' } },
  ];
  for (const change of invalid)
    assert.equal(ownerReportSchema.safeParse({ ...report, ...change }).success, false);
  assert.equal(ownerReportsSchema.safeParse([report, report]).success, false);
});

test('working dashboard evidence has the legacy owners weight once; other hardware and drafts do not qualify', () => {
  const base = { android: '14', evidence: [] };
  assert.equal(
    confidence({ ...base, ownerReports: [report] }).score,
    confidence({ ...base, evidence: ['owners'] }).score,
  );
  assert.equal(
    confidence({ ...base, evidence: ['owners'], ownerReports: [report] }).score,
    confidence({ ...base, evidence: ['owners'] }).score,
  );
  const hardware = {
    ...report,
    results: [{ behavior: 'brightness', outcome: 'works', notes: '' }],
  };
  const draft = { ...report, results: [{ behavior: 'dashboard', outcome: 'untested', notes: '' }] };
  for (const unqualified of [hardware, draft]) {
    assert.equal(
      confidence({ ...base, ownerReports: [unqualified] }).score,
      confidence(base).score,
    );
    assert.equal(
      confidenceChecklist({ ...base, ownerReports: [unqualified] }).find(
        (item) => item.key === 'confidence.owners',
      ).state,
      'miss',
    );
  }
});
