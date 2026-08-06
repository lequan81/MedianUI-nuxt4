import { useSeoMeta, useHead, useRoute } from "#imports";
import { siteConfig, authorConfig } from "~/app/config/site";

export function usePageSeo(options: { title?: string; description?: string; image?: string }) {
  if (!import.meta.server) return;

  const route = useRoute();
  const siteUrl = authorConfig.website || "https://lequan81.dev";
  const canonicalUrl = `${siteUrl}${route.path}`;

  const title = options.title ? `${options.title} - ${siteConfig.name}` : siteConfig.name;
  const description = options.description || siteConfig.description;
  const image = options.image || `${siteUrl}/og-banner.png`;

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: canonicalUrl,
    ogType: "website",
    ogSiteName: siteConfig.name,
    ogLocale: "vi_VN",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
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
          "@type": "WebPage",
          name: title,
          description: description,
          url: canonicalUrl,
          publisher: {
            "@type": "Person",
            name: authorConfig.name,
            url: authorConfig.website,
          },
        }),
      },
    ],
  });
}
