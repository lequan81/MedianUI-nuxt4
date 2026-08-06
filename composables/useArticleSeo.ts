import { useSeoMeta, useHead, useRoute } from "#imports";
import { siteConfig, authorConfig } from "~/app/config/site";

export function useArticleSeo(post: any) {
  if (!import.meta.server) return;

  const route = useRoute();
  const siteUrl = authorConfig.website || "https://lequan81.dev";
  const canonicalUrl = `${siteUrl}${route.path}`;

  useSeoMeta({
    title: () => (post?.value?.title ? `${post.value.title} - ${siteConfig.name}` : siteConfig.name),
    description: () => post?.value?.snippet || siteConfig.description,
    ogTitle: () => post?.value?.title || siteConfig.name,
    ogDescription: () => post?.value?.snippet || siteConfig.description,
    ogImage: () => post?.value?.image || `${siteUrl}/og-banner.png`,
    ogUrl: canonicalUrl,
    ogType: "article",
    ogSiteName: siteConfig.name,
    ogLocale: "vi_VN",
    twitterCard: "summary_large_image",
    twitterTitle: () => post?.value?.title || siteConfig.name,
    twitterDescription: () => post?.value?.snippet || siteConfig.description,
    twitterImage: () => post?.value?.image || `${siteUrl}/og-banner.png`,
    articlePublishedTime: () => post?.value?.date,
    articleAuthor: [authorConfig.name],
  });

  useHead({
    link: [
      {
        rel: "canonical",
        href: canonicalUrl,
      },
    ],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post?.value?.title,
          description: post?.value?.snippet,
          image: post?.value?.image,
          datePublished: post?.value?.date,
          author: {
            "@type": "Person",
            name: post?.value?.author?.name || authorConfig.name,
            url: authorConfig.website,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteUrl,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
        }),
      },
    ],
  });
}
