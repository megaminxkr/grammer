import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { lessonSchema, type LessonMeta } from '../src/lib/schema';
import { questions } from '../src/lib/questions';
import { topics, chapters } from '../src/lib/curriculum';
export function readLessons(directory = 'src/content/lessons') {
  return readdirSync(directory).filter(file => /\.mdx?$/.test(file)).map(file => {
    const raw = readFileSync(`${directory}/${file}`, 'utf8');
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
    if (!frontmatter?.[1]) throw new Error(`${file}: missing frontmatter`);
    return { file, raw, data: lessonSchema.parse(parse(frontmatter[1])) };
  });
}
export function validateGraph(nodes: { id: string; prerequisites: string[]; relatedTopics: string[] }[]) {
  const map = new Map(nodes.map(node => [node.id, node]));
  if (map.size !== nodes.length) throw new Error('Duplicate topic ID');
  for (const node of nodes) {
    for (const id of [...node.prerequisites, ...node.relatedTopics]) {
      if (!map.has(id)) throw new Error(`Unknown reference ${id} from ${node.id}`);
      if (id === node.id) throw new Error(`Self reference: ${id}`);
    }
  }
  const visiting = new Set<string>(); const visited = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) throw new Error(`Prerequisite cycle at ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    map.get(id)?.prerequisites.forEach(visit);
    visiting.delete(id); visited.add(id);
  };
  nodes.forEach(node => visit(node.id));
}
export function validateLessons(lessons: { file: string; raw: string; data: LessonMeta }[]) {
  const ids = new Set<string>();
  const orders = new Set<number>();
  const canonical = new Map(topics.map(t => [t.id, t]));
  for (const lesson of lessons) {
    const d = lesson.data; const topic = canonical.get(d.id);
    if (ids.has(d.id)) throw new Error(`Duplicate lesson ${d.id}`);
    ids.add(d.id);
    if (!topic || topic.title !== d.title || topic.chapter !== d.chapter || topic.order !== d.order || topic.level !== d.level) throw new Error(`Curriculum mismatch: ${d.id}`);
    if (orders.has(d.order)) throw new Error(`Duplicate lesson order ${d.order}`);
    orders.add(d.order);
    for (const field of ['prerequisites', 'relatedTopics'] as const) {
      if (JSON.stringify([...d[field]].sort()) !== JSON.stringify([...topic[field]].sort())) throw new Error(`Relationship mismatch: ${d.id}.${field}`);
    }
    if (!lesson.file.startsWith(d.id + '.')) throw new Error(`Filename must use stable ID: ${lesson.file}`);
    // In-body links must not bypass filtered metadata references. Output checks also crawl rendered links.
    if (d.status === 'reviewed') {
      for (const match of lesson.raw.matchAll(/lessons\/(ega-\d{2}-\d{2})/g)) {
        if (!lessons.some(l => l.data.id === match[1] && l.data.status === 'reviewed')) throw new Error(`Published link to unpublished lesson: ${match[1]}`);
      }
    }
    if (/<script\b|set:html|dangerouslySetInnerHTML/i.test(lesson.raw)) throw new Error(`Executable content is forbidden in lesson ${d.id}`);
  }
  if (new Set(chapters.map(c => c.id)).size !== 26) throw new Error('Duplicate chapter ID');
  if (new Set(topics.map(t => t.order)).size !== topics.length) throw new Error('Duplicate curriculum order');
  for (const chapter of chapters) {
    if (chapter.topics.some(t => t.chapter !== chapter.id)) throw new Error('Chapter membership mismatch');
  }
  validateGraph(topics);
  const questionIds = new Set<string>();
  for (const question of questions) {
    if (questionIds.has(question.id)) throw new Error(`Duplicate question ${question.id}`);
    questionIds.add(question.id);
    if (!ids.has(question.topicId) || !question.id.startsWith(question.topicId + '-')) throw new Error(`Invalid question topic ${question.id}`);
    if (question.type === 'single-choice' && !question.options.includes(question.answer)) throw new Error(`Answer missing from options: ${question.id}`);
  }
}
