<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import { getPostImage, getPostPath } from "~/composables/usePosts";
import { useAuthor } from "~/composables/useAuthor";
import AppIcon from "~/components/ui/AppIcon.vue";
import AuthorBio from "~/components/post/AuthorBio.vue";
import AuthorTooltip from "~/components/post/AuthorTooltip.vue";
import PostShareBar from "~/components/post/PostShareBar.vue";
import ShareModal from "~/components/post/ShareModal.vue";
import TableOfContents from "~/components/post/TableOfContents.vue";
import WidgetTitle from "~/components/ui/WidgetTitle.vue";

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

const { data: relatedPosts } = await useAsyncData(
  `related-${slug.value}`,
  async () => {
    const all = await queryCollection("posts").all();
    const currentTags = new Set(
      [post.value?.category, ...(post.value?.tags || [])]
        .filter(Boolean)
        .map((tag) => String(tag).toLowerCase()),
    );

    function scorePost(item: any) {
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

const tocLinks = computed(() => {
  if (!post.value) return [];
  return post.value.body?.toc?.links || (post.value as any).toc?.links || [];
});

useSeoMeta({
  title: () =>
    post.value?.title ? `${post.value.title} - Median UI` : "Bài viết không tồn tại - Median UI",
  description: () => post.value?.snippet || "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.snippet,
  ogImage: () => post.value?.image,
});
</script>

<template>
  <article v-if="post" class="mx-auto max-w-4xl space-y-10">
    <section class="min-w-0 space-y-8">
      <header>
        <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-5">
          <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
          <span class="text-text-muted">/</span>
          <NuxtLink :to="`/?category=${encodeURIComponent(post.category)}`"
            class="truncate font-semibold text-text-main transition-colors hover:text-primary">
            {{ post.category }}
          </NuxtLink>
        </nav>

        <h1
          class="text-3xl font-bold leading-tight tracking-[-0.02em] text-text-main md:text-4xl lg:text-[2.65rem] pb-4 mb-2">
          {{ post.title }}
        </h1>

        <p v-if="post.snippet" class="max-w-208 text-sm md:text-base leading-relaxed text-text-muted mb-6">
          {{ post.snippet }}
        </p>

        <div class="flex items-center justify-between gap-4 pt-1 text-xs">
          <div class="flex flex-wrap items-center gap-2">
            <AuthorTooltip :author="authorInfo" size="md" />
            <span class="text-text-muted">• {{ post.date }}</span>
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

              <div class="tag-tooltip-card absolute left-0 bottom-full mb-2 z-50 flex-col w-60 rounded-xl border border-border-main bg-bg-alt p-3 shadow-md backdrop-blur-md">
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

      <section v-if="relatedPosts?.length" class="mt-10 pt-4">
        <WidgetTitle title="Bạn có thể thích những bài đăng này" />

        <div class="grid gap-x-8 gap-y-6 sm:grid-cols-2">
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
                <NuxtLink
                  :to="`/?category=${encodeURIComponent(item.category)}`"
                  class="font-semibold text-primary hover:underline truncate max-w-28"
                  @click.stop
                >
                  {{ item.category }}
                </NuxtLink>
                <span class="text-text-muted">•</span>
                <span class="text-text-muted text-[11px] font-medium">{{ item.date }}</span>
              </div>
            </div>

            <NuxtLink :to="getPostPath(item)" class="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-lg bg-bg-sec border border-border-subtle">
              <img v-if="getPostImage(item)" :src="getPostImage(item)" :alt="item.title"
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
  <div v-else class="not-found-page">
    <div class="not-found-number">404</div>

    <div class="not-found-body">
      <h1 class="not-found-title">Post Not Found</h1>
      <p class="not-found-desc">
        Bài viết
        <code class="not-found-code">/blog/{{ slug }}</code>
        không tồn tại hoặc đã bị gỡ bỏ.
      </p>
    </div>

    <div class="not-found-actions">
      <NuxtLink to="/" class="not-found-btn-primary">
        <AppIcon name="arrow-left" :size="16" />
        <span>Back to Home</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  height: calc(100dvh - 195px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: clamp(1rem, 3dvh, 2.5rem);
  padding: 0.5rem 1rem;
}

@media (max-width: 1023px) {
  .not-found-page {
    height: calc(100dvh - 245px);
    gap: clamp(0.75rem, 2dvh, 1.5rem);
  }
}

.not-found-number {
  font-size: clamp(3.5rem, 11dvh, 9rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-primary);
  user-select: none;
}

.not-found-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.375rem, 1.2dvh, 0.875rem);
}

.not-found-title {
  font-size: clamp(1.125rem, 3dvh, 2rem);
  font-weight: 700;
  color: var(--color-text-main);
  letter-spacing: -0.02em;
}

.not-found-desc {
  font-size: clamp(0.7rem, 1.5dvh, 0.875rem);
  color: var(--color-text-alt);
  line-height: 1.6;
  max-width: 28rem;
}

.not-found-code {
  background: var(--color-bg-sec);
  color: var(--color-primary);
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  word-break: break-all;
}

.not-found-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  max-width: 20rem;
}

@media (min-width: 480px) {
  .not-found-actions {
    width: auto;
    max-width: none;
  }
}

.not-found-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.625rem;
  padding: 0.625rem 1.25rem;
  min-height: 42px;
  font-size: clamp(0.75rem, 1.5dvh, 0.875rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;
  width: 100%;
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

@media (min-width: 480px) {
  .not-found-btn-primary {
    width: auto;
  }
}

.not-found-btn-primary:hover {
  background: var(--color-primary-hover);
}

:deep(.prose-content > h1:first-child) {
  display: none;
}
</style>
