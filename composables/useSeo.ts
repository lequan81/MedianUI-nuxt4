import type { Ref } from "vue";
import { authorConfig, siteConfig } from "~/app/config/site";
import type { PostItem } from "~/types/post";

export interface SeoOptions {
  title?: string | (() => string);
  description?: string | (() => string);
  image?: string | (() => string);
  type?: "website" | "article";
  publishedTime?: string | (() => string);
  jsonLdType?: "WebPage" | "BlogPosting";
  post?: Ref<PostItem | null | any> | PostItem | any;
}

/**
 * Unified SEO Composable for pages and articles
 */
export function useSeo(optionsOrPost: SeoOptions | Ref<PostItem | null | any> | any = {}) {
  if (!import.meta.server) return;
  if (typeof useRoute !== "function" || typeof useSeoMeta !== "function") return;

  const route = useRoute();

  const siteUrl = authorConfig.website || "https://lequan81.dev";
  const canonicalUrl = `${siteUrl}${route.path}`;

  // If passed a reactive post ref/object (article mode)
  const isPost = optionsOrPost && (optionsOrPost.value?.title || optionsOrPost.title);
  const options: SeoOptions = isPost
    ? {
        type: "article",
        title: () => optionsOrPost?.value?.title || optionsOrPost?.title || siteConfig.name,
        description: () =>
          optionsOrPost?.value?.snippet || optionsOrPost?.snippet || siteConfig.description,
        image: () =>
          optionsOrPost?.value?.image || optionsOrPost?.image || `${siteUrl}/og-banner.png`,
        publishedTime: () => optionsOrPost?.value?.date || optionsOrPost?.date,
      }
    : (optionsOrPost as SeoOptions);

  const resolveVal = (val?: string | (() => string), fallback = ""): string => {
    if (typeof val === "function") return val() || fallback;
    return val || fallback;
  };

  const getTitle = () => {
    const raw = resolveVal(options.title);
    return raw ? `${raw} - ${siteConfig.name}` : siteConfig.name;
  };

  const getDescription = () => resolveVal(options.description, siteConfig.description);
  const getImage = () => resolveVal(options.image, `${siteUrl}/og-banner.png`);

  useSeoMeta({
    title: getTitle,
    description: getDescription,
    ogTitle: getTitle,
    ogDescription: getDescription,
    ogImage: getImage,
    ogUrl: canonicalUrl,
    ogType: options.type || "website",
    ogSiteName: siteConfig.name,
    ogLocale: "vi_VN",
    twitterCard: "summary_large_image",
    twitterTitle: getTitle,
    twitterDescription: getDescription,
    twitterImage: getImage,
    articlePublishedTime: options.publishedTime
      ? () => resolveVal(options.publishedTime)
      : undefined,
    articleAuthor: options.type === "article" ? [authorConfig.name] : undefined,
  });

  const schemaType = options.jsonLdType || (options.type === "article" ? "BlogPosting" : "WebPage");
  const schemaData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: getTitle(),
    description: getDescription(),
    url: canonicalUrl,
    publisher: {
      "@type": "Person",
      name: authorConfig.name,
      url: siteUrl,
    },
  };

  useHead({
    link: [{ rel: "canonical", href: canonicalUrl }],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schemaData),
      },
    ],
  });
}
