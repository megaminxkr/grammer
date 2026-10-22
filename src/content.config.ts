import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { lessonSchema } from './lib/schema';
export const collections = {
  lessons: defineCollection({
    loader: glob({ base: './src/content/lessons', pattern: '**/*.{md,mdx}',
      generateId: ({ data }) => lessonSchema.parse(data).id }),
    schema: lessonSchema,
  }),
};
