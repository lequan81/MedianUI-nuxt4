import { computed, onMounted, ref, shallowRef } from "vue";
import { useAuthor } from "~/composables/useAuthor";
import { getPostPath } from "~/composables/usePosts";
import { useSeo } from "~/composables/useSeo";
import { useTimeout } from "~/composables/useTimeout";
import type { PostItem, TocLink } from "~/types/post";


export function useBlogPost() {
  const route = useRoute();
  const slug = computed(() => String(route.params.slug || ""));
  const isShareModalOpen = ref(false);

  const { data: post, status } = useAsyncData(`post-${slug.value}`, async () => {
    let currentLocale = "vi";
    try {
      if (typeof useNuxtApp === "function") {
        const nuxtApp = useNuxtApp() as any;
        if (nuxtApp?.$i18n?.locale?.value === "en") {
          currentLocale = "en";
        }
      }
    } catch {}

    // 1. Try matching with active locale directory: /blog/vi/[slug] or /blog/en/[slug]
    try {
      const localized = await queryCollection("posts")
        .path(`/blog/${currentLocale}/${slug.value}`)
        .first();
      if (localized) return localized as unknown as PostItem;
    } catch {}

    // 2. Try alternate locale directory
    const otherLocale = currentLocale === "en" ? "vi" : "en";
    try {
      const alternate = await queryCollection("posts")
        .path(`/blog/${otherLocale}/${slug.value}`)
        .first();
      if (alternate) return alternate as unknown as PostItem;
    } catch {}

    // 3. Try direct path /blog/[slug]
    try {
      const direct = await queryCollection("posts")
        .path(`/blog/${slug.value}`)
        .first();
      if (direct) return direct as unknown as PostItem;
    } catch {}

    // 4. Fallback: match by stem / slug across all posts
    try {
      const all = await queryCollection("posts").all();
      return (
        (all as unknown as PostItem[]).find((item) => {
          const itemSlug = (item.stem || item.path || "").split("/").filter(Boolean).pop();
          return itemSlug === slug.value;
        }) || null
      );
    } catch {
      return null;
    }
  });


  const authorInfo = computed(() => {
    return useAuthor(post.value?.author);
  });

  const { data: relatedPosts } = typeof useLazyAsyncData === "function"
    ? useLazyAsyncData(
        `related-${slug.value}`,
        async () => {
          if (typeof queryCollection !== "function") return [];

          const all = await queryCollection("posts").all();
          const currentTags = new Set(
            [post.value?.category, ...(post.value?.tags || [])]
              .filter(Boolean)
              .map((tag) => String(tag).toLowerCase())
          );


      function scorePost(item: PostItem | any) {
        const tags = new Set(
          [item.category, ...(item.tags || [])]
            .filter(Boolean)
            .map((tag) => String(tag).toLowerCase())
        );

        let score = 0;
        for (const tag of tags) {
          if (currentTags.has(tag))
            score +=
              tag === String(post.value?.category || "").toLowerCase() ? 3 : 1;
        }

        return score;
      }

      function dateValue(value: unknown) {
        const timestamp = Date.parse(String(value || ""));
        return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
      }

      return (all || [])
        .filter((item: any) => item.path !== post.value?.path)
        .sort((a: any, b: any) => {
          const scoreDelta = scorePost(b) - scorePost(a);
          if (scoreDelta !== 0) return scoreDelta;

          const dateDelta = dateValue(b.date) - dateValue(a.date);
          if (dateDelta !== 0) return dateDelta;

          return (b.comments || 0) - (a.comments || 0);
        })
        .slice(0, 6);
    }
  )
  : { data: shallowRef([] as PostItem[]) };


  const isTagsExpanded = ref(false);

  const allPostTags = computed(() => {
    const list: string[] = [];
    if (post.value?.category) {
      list.push(post.value.category);
    }
    if (post.value?.tags && Array.isArray(post.value.tags)) {
      post.value.tags.forEach((tag: string) => {
        if (!list.includes(tag)) {
          list.push(tag);
        }
      });
    }
    return list;
  });

  const maxTagsLimit = computed(() => {
    const postItem = post.value as PostItem | null;
    if (typeof postItem?.maxTags === "number") {
      return postItem.maxTags;
    }
    return 5;
  });

  const isOverflowingTags = computed(() => {
    return allPostTags.value.length > maxTagsLimit.value;
  });

  const visiblePostTags = computed(() => {
    if (isTagsExpanded.value) return allPostTags.value;
    return allPostTags.value.slice(0, maxTagsLimit.value);
  });

  const hiddenPostTags = computed(() => {
    if (isOverflowingTags.value) {
      return allPostTags.value.slice(maxTagsLimit.value);
    }
    return [];
  });

  const hiddenTagsCount = computed(() => {
    return Math.max(0, allPostTags.value.length - maxTagsLimit.value);
  });

  function toggleExpandTags() {
    isTagsExpanded.value = !isTagsExpanded.value;
  }

  const extractedTocLinks = ref<TocLink[]>([]);

  function extractHeadingsFromDOM() {
    if (!import.meta.client) return;

    const container = document.querySelector(".prose-content, article");
    if (!container) return;

    const headings = container.querySelectorAll("h2, h3");
    const items: TocLink[] = [];

    headings.forEach((el, index) => {
      const heading = el as HTMLElement;
      let id = heading.id;
      if (!id) {
        id = `heading-${index}`;
        heading.id = id;
      }

      const text = heading.textContent?.trim() || "";
      const depth = heading.tagName.toLowerCase() === "h2" ? 2 : 3;

      if (text) {
        if (depth === 2) {
          items.push({ id, text, depth, children: [] });
        } else {
          const lastH2 = items[items.length - 1];
          if (lastH2) {
            if (!lastH2.children) lastH2.children = [];
            lastH2.children.push({ id, text, depth });
          } else {
            items.push({ id, text, depth });
          }
        }
      }
    });

    extractedTocLinks.value = items;
  }

  const tocLinks = computed(() => {
    if (!post.value) return [];
    const body = post.value.body as { toc?: { links?: TocLink[] } } | null | undefined;
    const contentToc = body?.toc?.links;
    if (contentToc && contentToc.length > 0) return contentToc;
    return extractedTocLinks.value;
  });

  const { set: setTocTimer } = useTimeout();

  onMounted(() => {
    if (import.meta.client) {
      const body = post.value?.body as { toc?: { links?: TocLink[] } } | null | undefined;
      if (!body?.toc?.links?.length) {
        setTocTimer(extractHeadingsFromDOM, 300);
      }
    }
  });

  useSeo(post);

  return {
    slug,
    post,
    status,
    authorInfo,
    relatedPosts,
    allPostTags,
    visiblePostTags,
    hiddenPostTags,
    isOverflowingTags,
    isTagsExpanded,
    toggleExpandTags,
    tocLinks,
    isShareModalOpen,
  };
}
