import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const page = (path) => {
  const file = `dist${path}/index.html`;
  assert.ok(existsSync(file), `Owner evidence page missing: ${path}`);
  return readFileSync(file, 'utf8');
};
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('model pages show scoped owner evidence and supported panels counts only working dashboards', () => {
  const first = page('/hardware/panels/sunworld/yc-sm55p');
  const firstText = text(first);
  assert.match(firstText, /Owner testimony/);
  assert.match(firstText, /P76S01-A14-SM55P-JD9365-720x1280-20260612-V0.01/);
  assert.match(firstText, /2026-08-28/);
  assert.match(firstText, /Generic/);
  assert.match(firstText, /Brightness Untested/);
  assert.match(firstText, /Proximity Not fitted/);
  assert.match(first, /href="https:\/\/github.com\/panel-assistant\/android\/issues\/129"/);

  const second = page('/hardware/panels/portworld/yc-sm10p');
  const generic = text(
    second.match(/<article id="report-android-138-generic"[\s\S]*?<\/article>/)?.[0] ?? '',
  );
  const correction = text(
    second.match(/<article id="report-android-138-corrected-hardware"[\s\S]*?<\/article>/)?.[0] ??
      '',
  );
  assert.match(generic, /Owner testimony · Unknown/);
  assert.match(generic, /Dashboard Works/);
  assert.match(generic, /Generic/);
  assert.match(correction, /community.yc-sm10p/);
  assert.match(correction, /Dashboard Untested/);
  assert.match(correction, /Brightness Works/);
  assert.match(correction, /Ambient light Fails/);
  assert.match(correction, /Proximity Fails/);
  assert.match(correction, /helper persistence remained unresolved/);
  assert.match(second, /issuecomment-5570358840/);

  const guide =
    page('/install/supported-panels').match(/<div class="brands[\s\S]*?<\/div>/)?.[0] ?? '';
  assert.ok(guide, 'Supported-panels list missing');
  for (const [brand, model] of [
    ['sunworld', 'yc-sm55p'],
    ['portworld', 'yc-sm10p'],
  ]) {
    const entry = [...guide.matchAll(/<li[^>]*>[\s\S]*?<\/li>/g)]
      .map((match) => match[0])
      .find((html) => html.includes(`href="/hardware/panels/${brand}/${model}/"`));
    assert.ok(entry, `${brand}/${model} entry missing`);
    assert.match(entry, /1 owner dashboard report\(s\)/);
  }
  assert.doesNotMatch(guide, /2 owner dashboard report\(s\)/);
});
