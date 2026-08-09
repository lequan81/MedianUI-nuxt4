import type { PostItem } from "~/types/post";

export function getPostPath(post: PostItem | any): string {
  const source = post?.stem || post?.path || '';
  const slug = source.split('/').filter(Boolean).pop();
  return slug ? `/blog/${slug}` : '#';
}

export function getPostImage(post: PostItem | any): string {
  const raw = post?.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643';
  if (typeof raw === 'string') {
    return raw.split('?')[0] || raw;
  }
  return String(raw || '');
}


export function getLabelCounts(posts: (PostItem | any)[] = []) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    if (!post?.category) continue;
    counts.set(post.category, (counts.get(post.category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function sortPopularPosts<T extends PostItem>(posts: T[] = []): T[] {
  return [...posts].sort((a, b) => (b.comments || 0) - (a.comments || 0));
}

export function sortPinnedFirst<T extends PostItem>(posts: T[] = []): T[] {
  return [...posts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
}


export function getPostPublishedDate(post: PostItem | any): Date | null {
  const raw = post?.publishedAt || post?.createdAt || post?.date || post?.published || post?.updatedAt;
  if (!raw) return null;

  const value = raw instanceof Date ? raw : new Date(raw);
  return Number.isFinite(value.getTime()) ? value : null;
}

export function formatTimeAgo(post: PostItem | any, fallback = ''): string {
  const publishedDate = getPostPublishedDate(post);
  if (!publishedDate) return fallback;

  const diffMs = Date.now() - publishedDate.getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return fallback || publishedDate.toLocaleDateString();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

