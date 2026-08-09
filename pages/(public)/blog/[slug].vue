<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import { getPostImage, getPostPath } from "~/composables/usePosts";
import { useArticleSeo } from "~/composables/useArticleSeo";
import { useAuthor } from "~/composables/useAuthor";
import type { PostItem } from "~/types/post";
import AppIcon from "~/components/ui/AppIcon.vue";

import AuthorTooltip from "~/components/post/AuthorTooltip.vue";
import PostShareBar from "~/components/post/PostShareBar.vue";
import ShareModal from "~/components/post/ShareModal.vue";
import TableOfContents from "~/components/post/TableOfContents.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const isShareModalOpen = ref(false);

const { data: post } = await useAsyncData(`post-${slug.value}`, async () => {
  const byPath = await queryCollection("posts")
    .path(`/blog/${slug.value}`)
    .first();
  if (byPath) return byPath;

  const all = await queryCollection("posts").all();
  return (
    all.find((item: any) => getPostPath(item) === `/blog/${slug.value}`) || null
  );
});

const authorInfo = computed(() => {
  return useAuthor(post.value?.author);
});

const { data: relatedPosts } = useLazyAsyncData(
  `related-${slug.value}`,
  async () => {

    const all = await queryCollection("posts").all();
    const currentTags = new Set(
      [post.value?.category, ...(post.value?.tags || [])]
        .filter(Boolean)
        .map((tag) => String(tag).toLowerCase()),
    );

    function scorePost(item: PostItem | any) {
      const tags = new Set(
        [item.category, ...(item.tags || [])]
          .filter(Boolean)
          .map((tag) => String(tag).toLowerCase()),
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

    return all
      .filter((item: any) => item.path !== post.value?.path)
      .sort((a: any, b: any) => {
        const scoreDelta = scorePost(b) - scorePost(a);
        if (scoreDelta !== 0) return scoreDelta;

        const dateDelta = dateValue(b.date) - dateValue(a.date);
        if (dateDelta !== 0) return dateDelta;

        return (b.comments || 0) - (a.comments || 0);
      })
      .slice(0, 6);
  },
);

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

const windowWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1200);

function onWindowResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("resize", onWindowResize, { passive: true });
    onWindowResize();
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", onWindowResize);
  }
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
  if (typeof window === "undefined") return;
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
  setTimeout(extractHeadingsFromDOM, 250);
});

watch(
  () => post.value,
  () => {
    setTimeout(extractHeadingsFromDOM, 250);
  }
);

useArticleSeo(post);
</script>

<template>
  <article v-if="post" class="mx-auto max-w-4xl space-y-10 min-w-0 wrap-break-word">
    <section class="min-w-0 space-y-8">
      <header>
        <AppBreadcrumb :items="[
          { label: post.category, to: `/?category=${encodeURIComponent(post.category)}` },
          { label: post.title }
        ]" />

        <h1 class="text-lg sm:text-2xl md:text-3xl font-bold leading-snug tracking-tight text-text-main pb-2 mb-1">

          {{ post.title }}
        </h1>

        <p v-if="post.snippet" class="max-w-208 text-xs sm:text-sm md:text-base leading-relaxed text-text-muted mb-5">
          {{ post.snippet }}
        </p>

        <div class="flex items-center justify-between gap-3 pt-1 text-[11.5px] sm:text-xs">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <AuthorTooltip :author="authorInfo" size="md" />
            <span class="text-text-muted">• Cập nhật: {{ post.updatedAt || post.date }}</span>
            <span v-if="post.readTime" class="text-text-muted">• {{ post.readTime }}</span>
          </div>

          <button type="button"
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-alt transition-colors hover:bg-bg-sec hover:text-primary"
            title="Chia sẻ bài viết" aria-label="Chia sẻ bài viết" @click="isShareModalOpen = true">
            <AppIcon name="share-2" :size="16" />
          </button>
        </div>
      </header>

      <div class="space-y-6">
        <div class="prose-content">
          <ContentRenderer :value="post" />
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-4 border-t border-border-subtle">
          <div v-if="allPostTags.length" class="flex flex-wrap items-center gap-2 min-w-0 flex-1 pt-0.5">
            <NuxtLink v-for="tag in visiblePostTags" :key="tag" :to="`/?category=${encodeURIComponent(tag)}`"
              class="inline-flex max-w-35 items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-3 py-1.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs">
              <span class="text-primary font-bold">#</span>
              <span class="truncate">{{ tag }}</span>
            </NuxtLink>

            <div v-if="isOverflowingTags" class="tag-tooltip-trigger inline-block">
              <span
                class="inline-flex items-center gap-1 rounded-lg border border-border-main bg-bg-sec px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:border-primary shadow-2xs cursor-pointer">
                +#{{ hiddenPostTags.length }}
              </span>

              <div
                class="tag-tooltip-card absolute left-0 bottom-full mb-2 z-50 flex-col w-60 rounded-xl border border-border-main bg-bg-alt p-3 shadow-md backdrop-blur-md">
                <div
                  class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-text-muted pb-1.5 border-b border-border-subtle mb-2">
                  <span>Thẻ khác</span>
                  <span class="text-primary font-bold">+{{ hiddenPostTags.length }}</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <NuxtLink v-for="tag in hiddenPostTags" :key="tag" :to="`/?category=${encodeURIComponent(tag)}`"
                    class="inline-flex items-center gap-1 rounded-md border border-border-main bg-bg-sec px-2 py-1 text-[11.5px] font-medium text-text-main transition-colors hover:border-primary hover:text-primary hover:bg-primary-subtle">
                    <span class="text-primary font-bold">#</span>
                    <span>{{ tag }}</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <AuthorBio :author="authorInfo" class="shrink-0" />
        </div>

        <PostShareBar :title="post.title" />
      </div>

      <section v-if="relatedPosts?.length" class="mt-8 pt-2">
        <WidgetTitle title="Bạn có thể thích những bài đăng này" />

        <!-- 1. Giao diện Mobile (< sm): Grid 2 Card / 1 Hàng dạng Card Dọc -->
        <div class="grid grid-cols-2 gap-3 sm:hidden">
          <article v-for="item in relatedPosts" :key="item.path"
            class="group flex flex-col overflow-hidden rounded-xl border border-border-main bg-bg-alt/70 p-2.5 transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt shadow-2xs cursor-pointer">
            <NuxtLink :to="getPostPath(item)"
              class="relative mb-2 aspect-video w-full overflow-hidden rounded-lg bg-bg-sec border border-border-subtle shrink-0">
              <NuxtImg v-if="getPostImage(item)" :src="getPostImage(item)" :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy" />
              <div v-else class="flex h-full w-full items-center justify-center text-[10px] text-text-muted">
                No image
              </div>
              <span
                class="absolute left-1.5 top-1.5 rounded-md bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[9.5px] font-semibold text-white border border-white/10 shadow-xs truncate max-w-[85%]">
                {{ item.category }}
              </span>
            </NuxtLink>

            <div class="flex flex-1 flex-col justify-between min-w-0 space-y-1.5">
              <h3
                class="line-clamp-2 text-xs font-bold leading-snug text-text-main group-hover:text-primary transition-colors">
                <NuxtLink :to="getPostPath(item)">
                  {{ item.title }}
                </NuxtLink>
              </h3>

              <div
                class="flex items-center justify-between pt-1 text-[10px] text-text-muted border-t border-border-subtle/70 mt-auto">
                <span class="truncate">{{ item.date }}</span>
                <span v-if="item.readTime" class="font-medium text-primary shrink-0 ml-1">{{ item.readTime }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- 2. Giao diện Desktop (>= sm): Chuẩn 100% Layout Median UI v1.7 (Số thứ tự + Tiêu đề + Snippet + Ảnh nhỏ bên phải) -->
        <div class="hidden sm:grid sm:grid-cols-2 gap-x-8 gap-y-6">
          <article v-for="(item, index) in relatedPosts" :key="item.path"
            class="group flex items-start justify-between gap-3.5 pb-5 border-b border-border-subtle cursor-pointer">
            <span class="w-6 shrink-0 text-sm font-bold text-text-muted leading-snug pt-0.5">
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <div class="min-w-0 flex-1 flex flex-col justify-between min-h-20 pr-1">
              <div>
                <h3
                  class="line-clamp-2 text-sm sm:text-base font-bold leading-snug text-text-main transition-colors group-hover:text-primary">
                  <NuxtLink :to="getPostPath(item)">
                    {{ item.title }}
                  </NuxtLink>
                </h3>

                <p v-if="item.snippet" class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-alt font-normal">
                  {{ item.snippet }}
                </p>
              </div>

              <div class="mt-2.5 flex items-center gap-1.5 text-xs">
                <NuxtLink :to="`/?category=${encodeURIComponent(item.category)}`"
                  class="font-semibold text-primary hover:underline truncate max-w-28" @click.stop>
                  {{ item.category }}
                </NuxtLink>
                <span class="text-text-muted">•</span>
                <span class="text-text-muted text-[11px] font-medium">{{ item.date }}</span>
              </div>
            </div>

            <NuxtLink :to="getPostPath(item)"
              class="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-lg bg-bg-sec border border-border-subtle">
              <NuxtImg v-if="getPostImage(item)" :src="getPostImage(item)" :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy" />
              <div v-else class="flex h-full w-full items-center justify-center text-[10px] text-text-muted">
                No image
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <PostComments />
    </section>

    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
    <ShareModal :is-open="isShareModalOpen" :title="post.title" @close="isShareModalOpen = false" />
  </article>

  <!-- 404 Page: Tối ưu UI/UX Mobile & Desktop Chuẩn Đẹp Tự Động -->
  <NotFoundBlock
    v-else
    status-code="404"
    title="Post Not Found"
    :message="`Bài viết /blog/${slug} không tồn tại hoặc đã bị gỡ bỏ.`"
  />
</template>

<style scoped>
:deep(.prose-content > h1:first-child) {
  display: none;
}
</style>
