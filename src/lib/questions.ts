import { z } from 'zod';
import { topicId } from './schema';
import raw from '../data/questions.json';
const common = {
  id: z.string().regex(/^ega-\d{2}-\d{2}-q\d+$/), topicId,
  prompt: z.string().min(1), sentence: z.string().min(1),
  answer: z.string().min(1), explanation: z.string().min(1),
};
export const questionSchema = z.discriminatedUnion('type', [
  z.object({ ...common, type: z.literal('single-choice'), options: z.array(z.string().min(1)).length(4) }),
  z.object({ ...common, type: z.literal('short-answer') }),
  z.object({ ...common, type: z.literal('structure') }),
]);
export const questions = z.array(questionSchema).parse(raw);
export const questionsFor = (id: string) => questions.filter(question => question.topicId === id);
