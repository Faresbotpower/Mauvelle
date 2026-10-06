import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('local preview serves assets and saves validated, unique waitlist entries', async () => {
  let createServer;
  try { ({ createServer } = await import('../server.mjs')); } catch {}
  assert.equal(typeof createServer, 'function', 'Local preview server must be implemented');
  const dataDir = await mkdtemp(join(tmpdir(), 'mauvelle-test-'));
  const server = createServer({ dataDir });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const post = body => fetch(`${origin}/api/waitlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await fetch(origin)).status, 200);
    assert.equal((await fetch(`${origin}/brand/logo/wordmark-plum.svg`)).status, 200);
    assert.equal((await fetch(`${origin}/business/unit-economics.csv`)).status, 404);
    assert.equal((await fetch(`${origin}/%2e%2e%2fCLAUDE.md`)).status, 404);
    assert.equal((await post({ email: 'not-an-email' })).status, 400);
    assert.equal((await post({ email: ' preview@example.com ' })).status, 201);
    assert.equal((await post({ email: 'PREVIEW@example.com' })).status, 200);
    const entries = (await readFile(join(dataDir, 'waitlist.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].email, 'preview@example.com');
    const invalid = await fetch(`${origin}/api/waitlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{invalid' });
    assert.equal(invalid.status, 400);
    assert.equal((await post({ email: 'a'.repeat(20000) })).status, 413);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(dataDir, { recursive: true, force: true });
  }
});
