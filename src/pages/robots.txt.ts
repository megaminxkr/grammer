import type { APIRoute } from 'astro';
import { href } from '../lib/paths';
export const GET: APIRoute = ({ site }) => new Response(
  process.env.REVIEW_PREVIEW === '1' ? 'User-agent: *\nDisallow: /\n' :
  `User-agent: *\nAllow: /\nSitemap: ${new URL(href('sitemap-index.xml'), site).href}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
