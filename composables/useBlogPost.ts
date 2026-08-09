import { computed, onMounted, ref } from "vue";
import { useAuthor } from "~/composables/useAuthor";
import { getPostPath } from "~/composables/usePosts";
import { useSeo } from "~/composables/useSeo";
import type { PostItem } from "~/types/post";


export function useBlogPost() {
  const route = typeof useRoute === "function" ? useRoute() : ({ params: {} } as any);
  const slug = computed(() => String(route.params.slug || ""));
  const isShareModalOpen = ref(false);

  const { data: post, status } = typeof useAsyncData === "function"
    ? useAsyncData(`post-${slug.value}`, async () => {
        if (typeof queryCollection === "function") {
          const byPath = await queryCollection("posts")
            .path(`/blog/${slug.value}`)
            .first();
          if (byPath) return byPath as PostItem;

          const all = await queryCollection("posts").all();
          return (
            all.find((item: any) => getPostPath(item) === `/blog/${slug.value}`) || null
          ) as PostItem | null;
        }
        return null as PostItem | null;
      })
    : { data: ref(null as PostItem | null), status: ref("idle") };


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
  : { data: ref([] as PostItem[]) };


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
    if (typeof (post.value as any)?.maxTags === "number") {
      return (post.value as any).maxTags;
    }
    return 5;
  });

  const isOverflowingTags = computed(() => {
    return allPostTags.value.length > maxTagsLimit.value;
  });

  const visiblePostTags = computed(() => {
    if (isOverflowingTags.value) {
      return allPostTags.value.slice(0, maxTagsLimit.value - 1);
    }
    return allPostTags.value;
  });

  const hiddenPostTags = computed(() => {
    if (isOverflowingTags.value) {
      return allPostTags.value.slice(maxTagsLimit.value - 1);
    }
    return [];
  });

  const extractedTocLinks = ref<any[]>([]);

  function extractHeadingsFromDOM() {
    if (!import.meta.client) return;
    const articleEl = document.querySelector(".prose-content");
    if (!articleEl) return;

    const headings = articleEl.querySelectorAll("h2, h3");
    const items: any[] = [];
    let lastH2: any = null;

    headings.forEach((heading, idx) => {
      let id = heading.id;
      if (!id) {
        id = `heading-${idx}`;
        heading.id = id;
      }

      const text = heading.textContent?.trim() || "";
      if (!text) return;

      const item = {
        id,
        text,
        depth: heading.tagName.toLowerCase() === "h2" ? 2 : 3,
        children: [],
      };

      if (item.depth === 2) {
        items.push(item);
        lastH2 = item;
      } else if (item.depth === 3) {
        if (lastH2) {
          lastH2.children.push(item);
        } else {
          items.push(item);
        }
      }
    });

    extractedTocLinks.value = items;
  }

  const tocLinks = computed(() => {
    if (!post.value) return [];
    const contentToc = post.value.body?.toc?.links || (post.value as any).toc?.links || [];
    if (contentToc && contentToc.length > 0) return contentToc;
    return extractedTocLinks.value;
  });

  onMounted(() => {
    if (import.meta.client && !post.value?.body?.toc?.links?.length) {
      setTimeout(extractHeadingsFromDOM, 300);
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
    tocLinks,
    isShareModalOpen,
  };
}
