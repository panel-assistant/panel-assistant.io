import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('the shipped Pickles artwork is the pinned upstream file', () => {
  execFileSync(process.execPath, [new URL('./sync.mjs', import.meta.url).pathname, '--check'], {
    stdio: 'pipe',
  });
});
