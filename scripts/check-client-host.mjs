import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--fixture-root') {
  throw new Error('Usage: node scripts/check-client-host.mjs --fixture-root test/fixtures/client-host-VERSION');
}
const fixtureRoot = resolve(root, args[1]);
const fixture = JSON.parse(await readFile(join(fixtureRoot, 'package.json'), 'utf8'));
for (const name of ['@deepseek-ai/cordis', '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-slots', '@deepseek-ai/dsh-client-ui-renderer', '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-modules']) {
  const actual = JSON.parse(await readFile(join(fixtureRoot, 'node_modules', name, 'package.json'), 'utf8'));
  if (actual.version !== fixture.dependencies[name]) throw new Error(`${name}: expected ${fixture.dependencies[name]}, found ${actual.version}`);
}
const run = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/client-host-compat.test.mjs'], {
  cwd: root, env: { ...process.env, DSH_CLIENT_MODULE_ROOT: join(fixtureRoot, 'node_modules') }, encoding: 'utf8',
});
process.stdout.write(run.stdout ?? '');
process.stderr.write(run.stderr ?? '');
if (run.error) throw run.error;
if (run.status !== 0) process.exit(run.status ?? 1);
if (!/^# tests 4$/m.test(run.stdout) || !/^# pass 4$/m.test(run.stdout) || !/^# skipped 0$/m.test(run.stdout)) {
  throw new Error('All four published client contract tests must run and pass without skips');
}
