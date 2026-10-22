import raw from '../data/curriculum.json';
import { curriculumSchema } from './schema';
export const chapters = curriculumSchema.parse(raw);
export const topics = chapters.flatMap(chapter => chapter.topics);
export const topicMap = new Map(topics.map(topic => [topic.id, topic]));
