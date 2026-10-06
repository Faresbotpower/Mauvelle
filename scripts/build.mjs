import { readFile, writeFile, mkdir, cp, copyFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

export async function buildSite(output = join(root, 'dist')) {
  const site = join(root, 'site-campaign');
  let html = await readFile(join(site, 'index.html'), 'utf8');
  // A serverless filesystem cannot persist the local preview signup list.
  // Publish the campaign without collecting emails until a real service is connected.
  html = html.replace(/<form class="form">[\s\S]*?<\/form>/,
    '<div class="launch-notice"><p>Something lovely is on its way.</p><a class="text-link" href="#faq">Explore the launch details <span aria-hidden="true">↗</span></a></div>');
  html = html.replace('Leave your email for a little warmth to look forward to.', 'Our UAE launch is taking shape. Come back for the latest details.');
  html = html.replace('href="#waitlist">Be the first to know', 'href="#how">Discover the ritual');
  await rm(output, { recursive: true, force: true });
  await mkdir(join(output, 'assets'), { recursive: true });
  await writeFile(join(output, 'index.html'), html);
  for (const file of ['styles.css', 'app.js']) await copyFile(join(site, file), join(output, file));
  for (const folder of ['vendor']) await cp(join(site, folder), join(output, folder), { recursive: true });
  for (const folder of ['fonts', 'logo']) await cp(join(root, 'brand', folder), join(output, 'brand', folder), { recursive: true });
  const assets = new Set([...html.matchAll(/(?:src|href)="(assets\/[^"?#]+)"/g)].map(match => match[1]));
  for (const asset of assets) await copyFile(join(site, asset), join(output, asset));
  return { output, images: assets.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildSite();
  console.log(`Built static campaign in dist with ${result.images} unique photographs.`);
}
