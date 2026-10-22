import { describe, it, expect } from 'vitest';
import { readLessons, validateGraph, validateLessons } from '../../scripts/content';
import { lessonSchema } from '../../src/lib/schema';
import { isVisible, visibleReferences } from '../../src/lib/publication';
import { withBase } from '../../src/lib/paths';
const lessons = readLessons();
const sample = lessons[0]!.data;
describe('Content integrity', () => {
  it('validates all authored lessons and the 130-topic dependency graph', () => expect(() => validateLessons(lessons)).not.toThrow());
  it('requires an immutable ID and a valid chapter', () => {
    expect(lessonSchema.safeParse({ ...sample, id: 'title-based-slug' }).success).toBe(false);
    expect(lessonSchema.safeParse({ ...sample, chapter: 26 }).success).toBe(false);
  });
  it('requires documented human review for reviewed status', () => {
    expect(lessonSchema.safeParse({ ...sample, status: 'reviewed' }).success).toBe(false);
    expect(lessonSchema.safeParse({ ...sample, status: 'reviewed', review: { reviewer: 'Editorial team', reviewedAt: '2026-10-22', method: 'human' } }).success).toBe(true);
  });
  it('rejects unknown references, duplicate IDs, and cycles', () => {
    const a = { id: 'a', prerequisites: ['b'], relatedTopics: [] };
    const b = { id: 'b', prerequisites: ['a'], relatedTopics: [] };
    expect(() => validateGraph([a])).toThrow('Unknown reference');
    expect(() => validateGraph([a, a])).toThrow('Duplicate');
    expect(() => validateGraph([a, b])).toThrow('cycle');
  });
  it('rejects metadata drifting from the canonical curriculum', () => {
    expect(() => validateLessons([{ ...lessons[0]!, data: { ...sample, title: 'Different title' } }])).toThrow('mismatch');
  });
});
describe('Publication boundary', () => {
  it('hides drafts and in-review content from a public build', () => {
    expect(isVisible({ ...sample, status: 'draft' })).toBe(false);
    expect(isVisible({ ...sample, status: 'in-review' })).toBe(false);
    expect(isVisible({ ...sample, status: 'reviewed' })).toBe(true);
  });
  it('makes review preview explicit', () => expect(isVisible(sample, true)).toBe(true));
  it('does not link from public content to unpublished references', () => {
    expect(visibleReferences(['ega-01-01', 'ega-03-04'], new Set(['ega-01-01']))).toEqual(['ega-01-01']);
  });
});
describe('GitHub Pages paths', () => {
  it.each(['/', '/grammer', '/grammer/', '/another-repository'])('works with %s', base => {
    expect(withBase('/chapters/', base)).toBe(`${base.replace(/\/$/, '')}/chapters/`);
  });
});
