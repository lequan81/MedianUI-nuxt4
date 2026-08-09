export function getPostPath(post: any) {
  const source = post?.stem || post?.path || ''
  const slug = source.split('/').filter(Boolean).pop()
  return slug ? `/blog/${slug}` : '#'
}

export function getPostImage(post: any) {
  const raw = post?.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643'
  return typeof raw === 'string' ? raw.split('?')[0] : raw
}

export function getLabelCounts(posts: any[] = []) {
  const counts = new Map<string, number>()

  for (const post of posts) {
    if (!post?.category) continue
    counts.set(post.category, (counts.get(post.category) || 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function sortPopularPosts(posts: any[] = []) {
  return [...posts].sort((a, b) => (b.comments || 0) - (a.comments || 0))
}

export function sortPinnedFirst(posts: any[] = []) {
  return [...posts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
}

export function getPostPublishedDate(post: any) {
  const raw = post?.publishedAt || post?.createdAt || post?.date || post?.published || post?.updatedAt
  if (!raw) return null

  const value = raw instanceof Date ? raw : new Date(raw)
  return Number.isFinite(value.getTime()) ? value : null
}

export function formatTimeAgo(post: any, fallback = '') {
  const publishedDate = getPostPublishedDate(post)
  if (!publishedDate) return fallback

  const diffMs = Date.now() - publishedDate.getTime()
  if (!Number.isFinite(diffMs) || diffMs < 0) return fallback || publishedDate.toLocaleDateString()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}
