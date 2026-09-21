import { SITE } from '../config';

const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/**
 * Prefix an absolute path with the configured `base`. Safe to call with
 * already-prefixed paths (it won't double up) or with empty/relative
 * paths (returned unchanged).
 */
export function withBase(path: string): string {
  if (!path || !path.startsWith('/')) return path;
  if (!BASE) return path;
  if (path === BASE || path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  if (SITE.isoDates) return d.toISOString().slice(0, 10);
  return new Intl.DateTimeFormat('ja-JP', options).format(d);
}

/** Short ISO 8601 date used for <time datetime="..."> attributes. */
export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}
