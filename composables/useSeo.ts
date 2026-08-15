import { authorConfig, siteConfig } from "~/app/config/site";
import type { PostItem } from "~/types/post";
import type { SeoOptions } from "~/types/seo";

/**
 * Unified SEO Composable for pages and articles
 * Injects OpenGraph, Twitter Cards, Hreflang alternates, and JSON-LD Structured Data
 */
export function useSeo(optionsOrPost: SeoOptions | Ref<PostItem | null | any> | any = {}) {
  if (!import.meta.server) return;
  if (typeof useRoute !== "function" || typeof useSeoMeta !== "function") return;

  const route = useRoute();

  const siteUrl = authorConfig.website || "https://lequan81.dev";
  const canonicalUrl = `${siteUrl}${route.path}`;

  // If passed a reactive post ref/object (article mode)
  const isPost = optionsOrPost && (optionsOrPost.value?.title || optionsOrPost.title);
  const postCategory = isPost ? (optionsOrPost?.value?.category || optionsOrPost?.category) : "";

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
  const mainSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: getTitle(),
    headline: getTitle(),
    description: getDescription(),
    image: getImage(),
    url: canonicalUrl,
    datePublished: options.publishedTime ? resolveVal(options.publishedTime) : undefined,
    author: {
      "@type": "Person",
      name: authorConfig.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: authorConfig.name,
      url: siteUrl,
    },
  };

  const scripts: Array<{ type: "application/ld+json"; innerHTML: string }> = [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(mainSchema),
    },
  ];

  if (options.type === "article") {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: siteUrl,
        },
        ...(postCategory
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: postCategory,
                item: `${siteUrl}/?category=${encodeURIComponent(postCategory)}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: getTitle(),
                item: canonicalUrl,
              },
            ]
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: getTitle(),
                item: canonicalUrl,
              },
            ]),
      ],
    };

    scripts.push({
      type: "application/ld+json",
      innerHTML: JSON.stringify(breadcrumbSchema),
    });
  }

  useHead({
    link: [
      { rel: "canonical", href: canonicalUrl },
      { rel: "alternate", hreflang: "vi", href: canonicalUrl },
      { rel: "alternate", hreflang: "en", href: canonicalUrl },
      { rel: "alternate", hreflang: "x-default", href: canonicalUrl },
    ],
    script: scripts as any,
  });
}
