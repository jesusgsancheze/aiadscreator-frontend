import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getImageUrl(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4001';
  return `${base}/${path}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
