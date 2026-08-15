import { defineEventHandler } from "h3";
import { queryCollection } from "@nuxt/content/server";

const siteUrl = "https://lequan81.dev";

function toW3CDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  const timestamp = Date.parse(dateStr);
  if (!isNaN(timestamp)) {
    return new Date(timestamp).toISOString();
  }
  return new Date().toISOString();
}

function resolveImageUrl(imgUrl?: string): string {
  if (!imgUrl) return `${siteUrl}/og-banner.png`;
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }
  return `${siteUrl}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
}

export default defineEventHandler(async (event) => {
  const staticUrls = [
    {
      loc: "/",
      changefreq: "daily",
      priority: 1.0,
      images: [{ loc: `${siteUrl}/og-banner.png`, title: "Lê Quân (@lequan81) - Blog Cá Nhân" }],
    },
    { loc: "/about", changefreq: "monthly", priority: 0.8 },
    { loc: "/contact", changefreq: "monthly", priority: 0.8 },
    { loc: "/faq", changefreq: "monthly", priority: 0.7 },
    { loc: "/privacy", changefreq: "yearly", priority: 0.3 },
    { loc: "/tos", changefreq: "yearly", priority: 0.3 },
    { loc: "/disclaimer", changefreq: "yearly", priority: 0.3 },
    { loc: "/sitemap", changefreq: "monthly", priority: 0.5 },
  ];

  const dynamicUrls: any[] = [];
  const processedSlugs = new Set<string>();

  try {
    const posts = await queryCollection(event, "posts").all();
    if (Array.isArray(posts)) {
      for (const post of posts) {
        // Extract clean slug removing locale prefixes (e.g. "vi/hello" -> "hello")
        const rawPath = post.path || post.stem || post.id || "";
        const cleanSlug = rawPath.replace(/^\/?blog\/(vi|en)\//, "").replace(/^\/?blog\//, "").replace(/^\//, "");
        
        if (!cleanSlug || processedSlugs.has(cleanSlug)) continue;
        processedSlugs.add(cleanSlug);

        const postUrl = `${siteUrl}/blog/${cleanSlug}`;

        dynamicUrls.push({
          loc: `/blog/${cleanSlug}`,
          lastmod: toW3CDate(post.updatedAt || post.date),
          changefreq: "weekly",
          priority: post.pinned ? 0.9 : 0.8,
          images: [
            {
              loc: resolveImageUrl(post.image),
              title: post.title || "Bài viết",
            },
          ],
          alternatives: [
            { hreflang: "vi", href: postUrl },
            { hreflang: "en", href: postUrl },
            { hreflang: "x-default", href: postUrl },
          ],
        });
      }
    }
  } catch {
    // Fallback gracefully if posts collection is unavailable during initial setup
  }

  try {
    const pages = await queryCollection(event, "pages").all();
    if (Array.isArray(pages)) {
      for (const page of pages) {
        const slug = page.slug || page.stem || "";
        if (!slug || slug === "index") continue;
        
        const existing = staticUrls.find((u) => u.loc === `/${slug}`);
        if (existing) {
          (existing as any).lastmod = toW3CDate(page.updatedAt || page.date);
        }
      }
    }
  } catch {
    // Fallback gracefully
  }

  return [...staticUrls, ...dynamicUrls];
});
