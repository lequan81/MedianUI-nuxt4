/**
 * Centralized Route Constants for Static & Reserved Slugs
 */
export const RESERVED_STATIC_SLUGS = new Set([
  "contact",
  "about",
  "faq",
  "disclaimer",
  "privacy",
  "tos",
  "admin",
  "blog",
  "api",
]);

export function isReservedSlug(slug: string): boolean {
  if (!slug) return false;
  return RESERVED_STATIC_SLUGS.has(slug.toLowerCase().trim());
}
