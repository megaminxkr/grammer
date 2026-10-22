export function withBase(path: string, base: string): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
export const href = (path = '') => withBase(path, import.meta.env.BASE_URL);
