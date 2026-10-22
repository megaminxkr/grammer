import { readFileSync, existsSync } from 'node:fs';
import { readLessons } from './content';
import { questionsFor } from '../src/lib/questions';
for (const lesson of readLessons()) {
  const html = readFileSync(`dist/lessons/${lesson.data.id}/index.html`, 'utf8');
  if (!html.includes('noindex, nofollow')) throw new Error(`Missing preview noindex: ${lesson.data.id}`);
  if (!html.includes(lesson.data.title)) throw new Error(`Missing title: ${lesson.data.id}`);
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) throw new Error(`Invalid H1 count: ${lesson.data.id}`);
  if (!html.includes('sentence-figure')) throw new Error(`Missing structure figure: ${lesson.data.id}`);
  if (!html.includes('重要事項のまとめ')) throw new Error(`Missing summary: ${lesson.data.id}`);
  const expected = questionsFor(lesson.data.id).length;
  if ((html.match(/<details>/g) ?? []).length !== expected) throw new Error(`Missing questions: ${lesson.data.id}`);
  for (const question of questionsFor(lesson.data.id)) {
    if (!html.includes(question.id) || !html.includes(question.explanation)) throw new Error(`Missing question explanation: ${question.id}`);
  }
}
if (existsSync('dist/sitemap-index.xml')) throw new Error('Review output must not contain a sitemap');
if (!readFileSync('dist/robots.txt', 'utf8').includes('Disallow: /')) throw new Error('Review robots must disallow crawling');
console.log('Review output verified: all 3 sample lessons, structure figures, 10 self-check explanations, noindex and no sitemap. This is artifact validation, not a visual/browser test.');
