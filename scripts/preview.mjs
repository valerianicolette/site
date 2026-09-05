#!/usr/bin/env node
/* Local preview of the site, rendering the Jekyll layout/includes the same way
   GitHub Pages does.  Usage:
     npm run preview          -> http://localhost:4000
     npm run build            -> writes the rendered site to _site/
*/
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import yaml from 'js-yaml';
import { Liquid } from 'liquidjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PORT = Number(process.env.PORT || 4000);

const liquid = new Liquid({ root: [path.join(ROOT, '_includes')], extname: '.html', jekyllInclude: true, dynamicPartials: false, strictFilters: false });

function loadSite() {
  const site = yaml.load(fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8')) || {};
  site.data = {};
  const dataDir = path.join(ROOT, '_data');
  if (fs.existsSync(dataDir)) {
    for (const f of fs.readdirSync(dataDir)) {
      if (/\.ya?ml$/.test(f)) site.data[f.replace(/\.ya?ml$/, '')] = yaml.load(fs.readFileSync(path.join(dataDir, f), 'utf8'));
    }
  }
  return site;
}

function splitFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return null;
  return { data: yaml.load(m[1]) || {}, body: text.slice(m[0].length) };
}

function hasFrontMatter(rel) {
  if (!/\.(html|xml|txt)$/.test(rel)) return false;
  return fs.readFileSync(path.join(ROOT, rel), 'utf8').startsWith('---');
}

async function renderPage(file) {
  const raw = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const fm = splitFrontMatter(raw);
  if (!fm) return raw;
  const site = loadSite();
  const page = { ...fm.data, file, url: file === 'index.html' ? '/' : '/' + file };
  let content = await liquid.parseAndRender(fm.body, { site, page });
  let layout = page.layout;
  while (layout) {
    const lraw = fs.readFileSync(path.join(ROOT, '_layouts', layout + '.html'), 'utf8');
    const lfm = splitFrontMatter(lraw) || { data: {}, body: lraw };
    content = await liquid.parseAndRender(lfm.body, { site, page, content });
    layout = lfm.data.layout;
  }
  return content;
}

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf' };

function isPublic(rel) {
  const first = rel.split('/')[0];
  const site = loadSite();
  const excluded = new Set(['_site', '_layouts', '_includes', '_data', ...(site.exclude || [])]);
  return !first.startsWith('.') && !first.startsWith('_') && !excluded.has(first);
}

if (process.argv.includes('--build')) {
  const out = path.join(ROOT, '_site');
  fs.rmSync(out, { recursive: true, force: true });
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const rel = path.relative(ROOT, path.join(dir, d.name));
    if (!isPublic(rel)) return [];
    return d.isDirectory() ? walk(path.join(dir, d.name)) : [rel];
  });
  for (const rel of walk(ROOT)) {
    const dest = path.join(out, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (hasFrontMatter(rel)) fs.writeFileSync(dest, await renderPage(rel));
    else fs.copyFileSync(path.join(ROOT, rel), dest);
  }
  console.log('Built to _site/');
} else {
  http.createServer(async (req, res) => {
    try {
      let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '');
      if (rel === '' || rel.endsWith('/')) rel += 'index.html';
      const abs = path.join(ROOT, rel);
      if (!abs.startsWith(ROOT) || !isPublic(rel) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found: ' + rel);
      }
      const ext = path.extname(rel).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(hasFrontMatter(rel) ? await renderPage(rel) : fs.readFileSync(abs));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end(String(err.stack || err));
    }
  }).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}  (Ctrl+C to stop)`));
}
