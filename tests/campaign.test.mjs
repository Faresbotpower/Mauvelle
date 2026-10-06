import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../scripts/build.mjs';

test('campaign never repeats a photograph, including renamed copies', async () => {
  const html = await readFile(new URL('../site-campaign/index.html', import.meta.url), 'utf8');
  const photographs = [...html.matchAll(/<(?:img|image)\b[^>]*?(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(photographs.length > 0);
  assert.equal(new Set(photographs).size, photographs.length, 'Every photo placement must have a unique source');
  const hashes = await Promise.all(photographs.map(async file => createHash('sha256').update(await readFile(new URL(`../site-campaign/${file}`, import.meta.url))).digest('hex')));
  assert.equal(new Set(hashes).size, hashes.length, 'Renaming a repeated image does not make it unique');
  assert.ok(!photographs.some(file => file.includes('quiet-moment')), 'The removed cup photo must stay off the campaign');
});

test('production build publishes only public assets and does not offer a local-only signup', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'mauvelle-build-'));
  const output = join(temp, 'dist');
  try {
    await buildSite(output);
    const html = await readFile(join(output, 'index.html'), 'utf8');
    assert.match(html, /Warmth,/);
    assert.doesNotMatch(html, /<form|Local preview:|Leave your email/);
    for (const file of ['server.mjs', '.local-data', 'business', 'references', 'assets/quiet-moment.webp']) {
      await assert.rejects(access(join(output, file)), { code: 'ENOENT' });
    }
    for (const [, file] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      await access(join(output, file.replace(/^\.\.\//, '')));
    }
    const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
    assert.equal(config.framework, null);
    assert.equal(config.outputDirectory, 'dist');
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
