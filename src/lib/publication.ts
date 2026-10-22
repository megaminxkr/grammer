import type { LessonMeta } from './schema';
export function isVisible(lesson: LessonMeta, reviewPreview = false): boolean {
  return lesson.status === 'reviewed' || reviewPreview;
}
export function visibleReferences(ids: string[], visibleIds: ReadonlySet<string>): string[] {
  return ids.filter(id => visibleIds.has(id));
}
