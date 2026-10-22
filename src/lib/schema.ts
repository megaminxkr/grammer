import { z } from 'zod';
export const topicId = z.string().regex(/^ega-\d{2}-\d{2}$/);
export const levels = ['基礎', '標準', '発展', '最難関'] as const;
export const lessonSchema = z.object({
  id: topicId,
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(240),
  chapter: z.number().int().min(0).max(25),
  section: z.string().min(1),
  level: z.enum(levels),
  order: z.number().int().nonnegative(),
  prerequisites: z.array(topicId),
  relatedTopics: z.array(topicId),
  tags: z.array(z.string().min(1)).min(1),
  status: z.enum(['draft', 'in-review', 'reviewed']),
  review: z.object({
    reviewer: z.string().min(1),
    reviewedAt: z.iso.date(),
    method: z.literal('human'),
  }).optional(),
}).superRefine((lesson, ctx) => {
  if (lesson.status === 'reviewed' && !lesson.review) {
    ctx.addIssue({ code: 'custom', message: 'reviewed requires documented human review', path: ['review'] });
  }
  if ([...lesson.prerequisites, ...lesson.relatedTopics].includes(lesson.id)) {
    ctx.addIssue({ code: 'custom', message: 'A lesson cannot reference itself' });
  }
});
export type LessonMeta = z.infer<typeof lessonSchema>;
export const curriculumTopicSchema = z.object({
  id: topicId, title: z.string().min(1), chapter: z.number().int().min(0).max(25),
  order: z.number().int().nonnegative(), level: z.enum(levels),
  prerequisites: z.array(topicId), relatedTopics: z.array(topicId),
});
export const chapterSchema = z.object({
  id: z.number().int().min(0).max(25), title: z.string().min(1),
  description: z.string().min(1), topics: z.array(curriculumTopicSchema).min(1),
});
export const curriculumSchema = z.array(chapterSchema).length(26);
