import { formatRelativeTime } from "~/utils/formatters";
import type { PostItem } from "~/types/post";

export function getPostPath(post: PostItem | any): string {
  const source = post?.stem || post?.path || '';
  const slug = source.split('/').filter(Boolean).pop();
  return slug ? `/blog/${slug}` : '#';
}

export function getPostImage(post: PostItem | any): string {
  const raw = post?.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643';
  if (typeof raw === 'string') {
    if (raw.includes('images.unsplash.com')) {
      const baseUrl = raw.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=1200&q=80`;
    }
    return raw;
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

export function formatPostTimeAgo(post: PostItem | any, fallback = ""): string {
  const publishedDate = getPostPublishedDate(post);
  if (!publishedDate) return fallback;
  return formatRelativeTime(publishedDate, fallback);
}

