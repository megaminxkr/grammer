import { getCollection } from 'astro:content';
import { isVisible } from './publication';
export const reviewPreview = process.env.REVIEW_PREVIEW === '1';
export async function getLessons() {
  return (await getCollection('lessons', ({ data }) => isVisible(data, reviewPreview)))
    .sort((a, b) => a.data.order - b.data.order);
}
