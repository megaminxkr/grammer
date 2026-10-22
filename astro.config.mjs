import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
const repository = process.env.GITHUB_REPOSITORY ?? 'megaminxkr/grammer';
const [owner, name] = repository.split('/');
const site = process.env.SITE_URL ?? `https://${owner}.github.io`;
const base = process.env.BASE_PATH ?? (name === `${owner}.github.io` ? '/' : `/${name}`);
const review = process.env.REVIEW_PREVIEW === '1';
export default defineConfig({
  site, base, output: 'static', trailingSlash: 'always',
  integrations: [mdx(), ...(review ? [] : [sitemap()])],
  vite: { plugins: [tailwindcss()] },
});
