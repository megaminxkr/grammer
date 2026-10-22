import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readLessons } from './content';
import { withBase } from '../src/lib/paths';
const repository = process.env.GITHUB_REPOSITORY ?? 'megaminxkr/grammer';
const [owner, name] = repository.split('/');
const base = process.env.BASE_PATH ?? (name === `${owner}.github.io` ? '/' : `/${name}`);
const site = process.env.SITE_URL ?? `https://${owner}.github.io`;
const root = 'dist';
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}
const files = walk(root);
const htmlFiles = files.filter(f => f.endsWith('.html'));
for (const lesson of readLessons()) {
  const route = `${root}/lessons/${lesson.data.id}/index.html`;
  if (lesson.data.status !== 'reviewed' && existsSync(route)) throw new Error(`Unpublished lesson in output: ${route}`);
  if (lesson.data.status === 'reviewed' && !existsSync(route)) throw new Error(`Missing published lesson: ${route}`);
}
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (html.includes('noindex') && !file.endsWith('404.html')) throw new Error(`Preview artifact: ${file}`);
  if (!/<html[^>]*lang="ja"/.test(html)) throw new Error(`Missing language: ${file}`);
  if (!/<link[^>]*rel="canonical"/.test(html)) throw new Error(`Missing canonical: ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const target = match[1];
    if (!target || /^(https?:|data:|mailto:)/.test(target)) continue;
    const parsed = new URL(target.replaceAll('&amp;', '&'), `${site}${withBase(file.replace(/^dist\//, ''), base)}`);
    const prefix = base.replace(/\/$/, '') + '/';
    if (!parsed.pathname.startsWith(prefix)) throw new Error(`Link outside base: ${file} -> ${target}`);
    const relative = decodeURIComponent(parsed.pathname.slice(prefix.length));
    const destination = join(root, relative, parsed.pathname.endsWith('/') ? 'index.html' : '');
    if (!existsSync(destination)) throw new Error(`Broken local link: ${file} -> ${target}`);
  }
}
for (const lesson of readLessons().filter(l => l.data.status !== 'reviewed')) {
  for (const file of files.filter(f => /\.(html|xml)$/.test(f))) {
    if (readFileSync(file, 'utf8').includes(`/lessons/${lesson.data.id}`)) throw new Error(`Unpublished link leaked: ${file}`);
  }
}
if (!files.some(f => f.endsWith('sitemap-index.xml'))) throw new Error('Missing sitemap');
console.log(`Public output verified: ${htmlFiles.length} HTML pages; internal links, base path, and publication boundary valid.`);
