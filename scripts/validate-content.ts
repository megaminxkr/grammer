import { readLessons, validateLessons } from './content';
import { topics, chapters } from '../src/lib/curriculum';
const lessons = readLessons();
validateLessons(lessons);
console.log(`Content valid: ${chapters.length} chapters, ${topics.length} topics, ${lessons.length} lessons (${lessons.filter(l => l.data.status === 'reviewed').length} reviewed).`);
