// The boot-loop rescue script, driven through stand-ins for adb and fastboot on PATH.
// Each stand-in logs its arguments; fastboot reports the panel once `adb reboot bootloader` has run.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  writeFileSync,
  readFileSync,
  existsSync,
  chmodSync,
  readdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve('public/downloads/shelly-bootloop-rescue.sh');
const SERIAL = 'SAWD0000TEST';

function bench({ inBootloader = false, bootloaderSerial = SERIAL, missedBoots = 0 } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'rescue-'));
  const bin = join(dir, 'bin');
  const log = join(dir, 'calls.log');
  const state = join(dir, 'bootloader');
  const misses = join(dir, 'misses');
  spawnSync('mkdir', ['-p', bin]);
  if (inBootloader) writeFileSync(state, '');
  writeFileSync(misses, String(missedBoots));
  writeFileSync(
    join(bin, 'adb'),
    `#!/usr/bin/env bash
echo "adb $*" >> "${log}"
case "$*" in
  *"shell"*) echo "== /sys/fs/pstore/console-ramoops-0"; echo "Kernel panic - not syncing";;
  *"reboot bootloader"*)
    m=$(cat "${misses}")
    if [ "$m" -gt 0 ]; then echo $((m - 1)) > "${misses}"; else touch "${state}"; fi;;
esac
`,
  );
  writeFileSync(
    join(bin, 'fastboot'),
    `#!/usr/bin/env bash
echo "fastboot $*" >> "${log}"
if [ "$1" = devices ]; then [ -e "${state}" ] && printf '%s\\tfastboot\\n' "${bootloaderSerial}"; fi
exit 0
`,
  );
  chmodSync(join(bin, 'adb'), 0o755);
  chmodSync(join(bin, 'fastboot'), 0o755);
  const run = (args, input = '') =>
    spawnSync('bash', [script, ...args], {
      cwd: dir,
      input,
      encoding: 'utf8',
      env: {
        PATH: `${bin}:/usr/bin:/bin`,
        ANDROID_SERIAL: 'emulator-5554',
        RESCUE_ATTEMPTS: '3',
        RESCUE_FASTBOOT_WAIT: '1',
      },
    });
  const calls = () => (existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n') : []);
  return { dir, run, calls };
}

test('catch reaches the bootloader, saves the crash record and changes nothing', () => {
  const b = bench({ missedBoots: 1 });
  const r = b.run([SERIAL, 'catch']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /in its bootloader after 2 attempt/);
  const record = readdirSync(b.dir).find((f) => f.startsWith(`crash-record-${SERIAL}-`));
  assert.ok(record, 'crash record file written');
  assert.match(readFileSync(join(b.dir, record), 'utf8'), /Kernel panic/);
  assert.ok(
    b.calls().every((c) => !/format|erase|flash/.test(c)),
    'no destructive command',
  );
});

test('every command names the serial, never the inherited ANDROID_SERIAL device', () => {
  const b = bench();
  b.run([SERIAL, 'catch']);
  const adbCalls = b.calls().filter((c) => c.startsWith('adb '));
  assert.ok(adbCalls.length > 0);
  assert.ok(
    adbCalls.every((c) => c.startsWith(`adb -s ${SERIAL} `)),
    adbCalls.join('\n'),
  );
});

test('catch gives up after the attempt budget and names a different bootloader serial', () => {
  const b = bench({ bootloaderSerial: 'OTHER123' });
  const r = b.run([SERIAL, 'catch']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /OTHER123/);
});

test('wipe does nothing without the typed serial', () => {
  const b = bench({ inBootloader: true });
  const r = b.run([SERIAL, 'wipe'], 'yes\n');
  assert.equal(r.status, 1);
  assert.match(r.stdout, /Not confirmed; nothing was changed/);
  assert.ok(
    b.calls().every((c) => !/format|reboot/.test(c)),
    b.calls().join('\n'),
  );
});

test('wipe formats metadata, then userdata, then restarts, after the typed serial', () => {
  const b = bench({ inBootloader: true });
  const r = b.run([SERIAL, 'wipe'], `${SERIAL}\n`);
  assert.equal(r.status, 0, r.stderr);
  const writes = b.calls().filter((c) => /format|reboot|erase/.test(c));
  assert.deepEqual(writes, [
    `fastboot -s ${SERIAL} format:ext4 metadata`,
    `fastboot -s ${SERIAL} format:ext4 userdata`,
    `fastboot -s ${SERIAL} reboot`,
  ]);
});

test('wipe refuses when the panel is not in its bootloader', () => {
  const b = bench();
  const r = b.run([SERIAL, 'wipe'], `${SERIAL}\n`);
  assert.equal(r.status, 1);
  assert.ok(b.calls().every((c) => !/format/.test(c)));
});

test('an unknown step prints usage and changes nothing', () => {
  const b = bench({ inBootloader: true });
  const r = b.run([SERIAL, 'flash']);
  assert.equal(r.status, 2);
  assert.match(r.stdout, /catch/);
  assert.deepEqual(b.calls(), []);
});
