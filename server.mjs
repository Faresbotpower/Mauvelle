import http from 'node:http';
import { readFile, mkdir, appendFile } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
export function createServer({ dataDir = join(root, '.local-data') } = {}) {
  let saving = Promise.resolve();
  return http.createServer(async (req, res) => {
    const json = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname === '/api/waitlist' && req.method === 'POST') {
        if (!req.headers['content-type']?.startsWith('application/json')) return json(415, { error: 'Send your email as JSON.' });
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 8192) return json(413, { error: 'Your submission is too large.' });
        }
        let email;
        try { email = JSON.parse(body).email; } catch { return json(400, { error: 'Please enter a valid email address.' }); }
        if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return json(400, { error: 'Please enter a valid email address.' });
        email = email.trim().toLowerCase();
        const task = saving.then(async () => {
          await mkdir(dataDir, { recursive: true });
          const path = join(dataDir, 'waitlist.jsonl');
          let entries = '';
          try { entries = await readFile(path, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
          if (entries.split('\n').filter(Boolean).some(line => JSON.parse(line).email === email)) return false;
          await appendFile(path, JSON.stringify({ email, createdAt: new Date().toISOString() }) + '\n', { mode: 0o600 });
          return true;
        });
        saving = task.catch(() => {});
        const added = await task;
        return json(added ? 201 : 200, { saved: true, local: true });
      }
      if (!['GET', 'HEAD'].includes(req.method)) return json(405, { error: 'Method not allowed.' });
      let relative;
      if (pathname === '/' || pathname === '/site/' || pathname === '/site/index.html') relative = 'site-campaign/index.html';
      else if (/^\/brand\/(fonts|logo)\/[a-zA-Z0-9/._-]+$/.test(pathname)) relative = pathname.slice(1);
      else if (/^\/(?:site\/)?(?:styles\.css|app\.js|vendor\/[a-zA-Z0-9.-]+\.js|assets\/[a-zA-Z0-9.-]+)$/.test(pathname)) relative = 'site-campaign/' + pathname.replace(/^\/(site\/)?/, '');
      if (!relative || relative.split('/').includes('..')) return json(404, { error: 'Not found.' });
      const file = resolve(root, relative);
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (e) {
      json(e.code === 'ENOENT' ? 404 : e instanceof URIError ? 400 : 500, { error: e.code === 'ENOENT' ? 'Not found.' : 'Could not complete the request. Please try again.' });
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 4173;
  createServer().listen(port, '127.0.0.1', () => console.log(`Mauvelle is ready at http://localhost:${port}`));
}
