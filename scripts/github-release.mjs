import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// npm publication is deliberately outside this script. Never retry it here.
export async function syncRelease({ repository, tag, notes, token, request = fetch }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || !/^v\d+\.\d+\.\d+$/.test(tag ?? '') || !token) {
    throw new Error('repository, stable release tag and token are required');
  }
  const base = `https://api.github.com/repos/${repository}/releases`;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' };
  const existing = await request(`${base}/tags/${encodeURIComponent(tag)}`, { headers });
  let url = base;
  let method = 'POST';
  const body = { name: tag, body: notes, make_latest: 'true' };
  if (existing.ok) {
    const release = await existing.json();
    if (release.tag_name !== tag || !Number.isSafeInteger(release.id) || release.id <= 0) throw new Error('release identity mismatch');
    url = `${base}/${release.id}`;
    method = 'PATCH';
  } else if (existing.status === 404) {
    body.tag_name = tag;
  } else {
    throw new Error(`release lookup failed: HTTP ${existing.status}`);
  }
  const result = await request(url, { method, headers, body: JSON.stringify(body) });
  if (!result.ok) throw new Error(`release write failed: HTTP ${result.status}`);
  return result.json();
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await syncRelease({ repository: process.env.GITHUB_REPOSITORY, tag: process.env.GITHUB_REF_NAME, token: process.env.GH_TOKEN, notes: await readFile('release-notes.md', 'utf8') });
    console.log(`GitHub release synchronized: ${result.html_url}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
