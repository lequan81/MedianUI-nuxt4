export function getPostPath(post: any) {
  const source = post?.stem || post?.path || ''
  const slug = source.split('/').filter(Boolean).pop()
  return slug ? `/blog/${slug}` : '#'
}

export function getPostImage(post: any) {
  return post?.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80'
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
