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
      images: [{ loc: `${siteUrl}/og-banner.png`, title: "Lê Quân Blog" }],
    },
    { loc: "/blog", changefreq: "daily", priority: 0.9 },
    { loc: "/about", changefreq: "monthly", priority: 0.8 },
    { loc: "/contact", changefreq: "monthly", priority: 0.8 },
    { loc: "/faq", changefreq: "monthly", priority: 0.7 },
    { loc: "/privacy", changefreq: "yearly", priority: 0.3 },
    { loc: "/tos", changefreq: "yearly", priority: 0.3 },
    { loc: "/disclaimer", changefreq: "yearly", priority: 0.3 },
  ];

  try {
    const posts = await (queryCollection as any)(event, "posts").all();
    if (Array.isArray(posts)) {
      const postUrls = posts.map((post: any) => ({
        loc: post.path || `/blog/${post.stem || post.id}`,
        lastmod: toW3CDate(post.date),
        changefreq: "weekly",
        priority: 0.8,
        images: [
          {
            loc: resolveImageUrl(post.thumbnail || post.image),
            title: post.title || "Bài viết",
          },
        ],
      }));
      return [...staticUrls, ...postUrls];
    }
  } catch {
    // Fallback to static URLs if content query fails
  }

  return staticUrls;
});
