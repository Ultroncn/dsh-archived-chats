import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { sectionFor } from '../scripts/release-notes.mjs';

const changelog = `# Changelog

Intro.

## 2.0.1 — 2026-11-10

### 中文

- Fixed the thing.

### English

- Fixed the thing.

## 2.0.0 — 2026-11-07

- Older entry.
`;

test('release notes come from the changelog section of the released version', () => {
  assert.equal(
    sectionFor(changelog, '2.0.1'),
    '### 中文\n\n- Fixed the thing.\n\n### English\n\n- Fixed the thing.',
  );
});

test('a section stops at the next release heading', () => {
  assert.equal(sectionFor(changelog, '2.0.0'), '- Older entry.');
  assert.ok(!sectionFor(changelog, '2.0.0').includes('2.0.1'));
});

test('a version without a section yields nothing instead of a neighbouring entry', () => {
  // A dot in the version is a regex wildcard unless escaped; 2x0x1 must not
  // match the 2.0.1 heading and borrow its notes.
  assert.equal(sectionFor(changelog, '2.0.9'), undefined);
  assert.equal(sectionFor(changelog, '2x0x1'), undefined);
  assert.equal(sectionFor(changelog, '1.0.0'), undefined);
});

test('an empty section is treated as missing', () => {
  assert.equal(sectionFor('## 3.0.0\n\n## 2.0.0\n- x\n', '3.0.0'), undefined);
});

test('the script refuses a tag that does not match the package version', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'dac-release-notes-'));
  const manifest = join(fixture, 'package.json');
  const notes = join(fixture, 'notes.md');
  writeFileSync(manifest, `${JSON.stringify({ name: 'dsh-archived-chats', version: '2.0.1' })}\n`);

  const run = (tag, output) => spawnSync(process.execPath, [
    'scripts/release-notes.mjs',
    '--tag', tag,
    '--package', manifest,
    '--output', output,
  ], { cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8' });

  const matched = run('v2.0.1', notes);
  assert.equal(matched.status, 0, matched.stderr);
  assert.match(readFileSync(notes, 'utf8'), /Restore the pre-2\.0\.0 Host compatibility range/);

  // A failed run must not write anything, so a stale notes file can never be
  // published under a mismatched tag.
  const unmatchedNotes = join(fixture, 'unmatched.md');
  const mismatched = run('v2.0.0', unmatchedNotes);
  assert.equal(mismatched.status, 1);
  assert.match(mismatched.stderr, /does not match/);
  assert.ok(!existsSync(unmatchedNotes));
});
