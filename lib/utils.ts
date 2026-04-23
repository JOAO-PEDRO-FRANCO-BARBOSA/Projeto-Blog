export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'agora';
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  if (diffWeeks < 4) return `há ${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`;
  if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`;
  return `há ${diffYears} ano${diffYears > 1 ? 's' : ''}`;
}
