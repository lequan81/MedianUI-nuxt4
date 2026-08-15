<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useBlogPost } from "~/composables/useBlogPost";
import { getPostImage, getPostPath } from "~/composables/usePosts";

const {
  post,
  authorInfo,
  relatedPosts,
  allPostTags,
  visiblePostTags,
  hiddenPostTags,
  isOverflowingTags,
  tocLinks,
  isShareModalOpen,
  slug,
  status
} = useBlogPost();

const readingProgress = ref(0);
let scrollRafId = 0;

function updateReadingProgress() {
  if (scrollRafId) return;
  scrollRafId = window.requestAnimationFrame(() => {
    scrollRafId = 0;
    const articleEl = (document.querySelector(".prose-content") || document.querySelector("article")) as HTMLElement | null;
    if (!articleEl) {
      readingProgress.value = 0;
      return;
    }

    const rect = articleEl.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = rect.height;

    // Start tracking as top of article scrolls past the header line
    const scrolledPastTop = -rect.top + 70;
    const scrollableDistance = totalHeight - windowHeight * 0.5;

    if (scrolledPastTop <= 0) {
      readingProgress.value = 0;
      return;
    }

    if (scrollableDistance <= 0) {
      readingProgress.value = 1;
      return;
    }

    const ratio = Math.max(0, Math.min(1, scrolledPastTop / scrollableDistance));
    readingProgress.value = ratio;
  });
}

onMounted(() => {
  window.addEventListener("scroll", updateReadingProgress, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateReadingProgress);
  if (scrollRafId) window.cancelAnimationFrame(scrollRafId);
});
</script>

<template>
  <!-- Top Reading Progress Indicator (GPU-accelerated 120fps continuous scaleX) -->
  <div
    class="fixed top-0 left-0 right-0 h-0.75 bg-primary z-50 pointer-events-none origin-left will-change-transform"
    :style="{ transform: `scaleX(${readingProgress})` }"
  ></div>

  <!-- Loading Skeleton to prevent 404 flash during navigation -->
  <div v-if="status === 'pending' && !post" class="mx-auto max-w-4xl space-y-6 animate-pulse py-4">
    <div class="h-4 w-32 bg-bg-sec rounded"></div>
    <div class="h-9 w-4/5 bg-bg-sec rounded-lg"></div>
    <div class="h-4 w-1/2 bg-bg-sec rounded"></div>
    <div class="h-64 sm:h-80 w-full bg-bg-sec rounded-xl"></div>
    <div class="space-y-3 pt-4">
      <div class="h-4 w-full bg-bg-sec rounded"></div>
      <div class="h-4 w-11/12 bg-bg-sec rounded"></div>
      <div class="h-4 w-3/4 bg-bg-sec rounded"></div>
    </div>
  </div>

  <article v-else-if="post" class="mx-auto max-w-4xl space-y-10 min-w-0 wrap-break-word">
    <section class="min-w-0 space-y-8">
      <header>
        <AppBreadcrumb :items="[
          { label: post.category, to: `/?category=${encodeURIComponent(post.category)}` },
          { label: post.title }
        ]" />

        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-extrabold leading-tight tracking-tight text-text-main pb-2 mb-1">
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

            <AppTooltip v-if="isOverflowingTags" content-class="w-60 p-3 flex flex-wrap gap-1.5">
              <template #trigger>
                <span
                  class="inline-flex items-center gap-1 rounded-lg border border-border-main bg-bg-sec px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:border-primary shadow-2xs cursor-pointer"
                >
                  +#{{ hiddenPostTags.length }}
                </span>
              </template>

              <NuxtLink
                v-for="tag in hiddenPostTags"
                :key="tag"
                :to="`/?category=${encodeURIComponent(tag)}`"
                class="inline-flex items-center gap-1 rounded-md border border-border-main bg-bg-sec px-2 py-1 text-[11.5px] font-medium text-text-main transition-colors hover:border-primary hover:text-primary hover:bg-primary-subtle"
              >
                <span class="text-primary font-bold">#</span>
                <span>{{ tag }}</span>
              </NuxtLink>
            </AppTooltip>

          </div>

          <AuthorBio :author="authorInfo" class="shrink-0" />
        </div>

        <PostShareBar :title="post.title" />
      </div>

      <section v-if="relatedPosts?.length" class="mt-8 pt-2">
        <WidgetTitle :title="$t('post.relatedPosts')" />

        <!-- Unified Responsive Related Posts Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <article
            v-for="(item, index) in relatedPosts"
            :key="item.path"
            class="group flex items-start justify-between gap-3.5 pb-4 border-b border-border-subtle cursor-pointer"
          >
            <span class="w-5.5 shrink-0 text-xs sm:text-sm font-bold text-text-muted leading-snug pt-0.5">
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <div class="min-w-0 flex-1 flex flex-col justify-between min-h-18 sm:min-h-20 pr-1">
              <NuxtLink :to="getPostPath(item)" class="group/link block">
                <h3 class="line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-text-main group-hover/link:text-primary transition-colors">
                  {{ item.title }}
                </h3>
                <p v-if="item.snippet" class="mt-1 hidden sm:line-clamp-2 text-xs leading-relaxed text-text-alt font-normal">
                  {{ item.snippet }}
                </p>
              </NuxtLink>

              <div class="mt-2 flex items-center gap-1.5 text-[11px] sm:text-xs">
                <NuxtLink
                  :to="`/?category=${encodeURIComponent(item.category)}`"
                  class="font-semibold text-primary hover:underline truncate max-w-28"
                  @click.stop
                >
                  {{ item.category }}
                </NuxtLink>
                <span class="text-text-muted">•</span>
                <span class="text-text-muted text-[10px] sm:text-[11px] font-medium">{{ item.date }}</span>
              </div>
            </div>

            <NuxtLink
              :to="getPostPath(item)"
              class="relative h-18 w-18 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-lg bg-bg-sec border border-border-subtle"
            >
              <NuxtImg
                v-if="getPostImage(item)"
                :src="getPostImage(item)"
                :alt="item.title"
                :width="88"
                :height="88"
                class="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                format="webp"
                quality="80"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-[10px] text-text-muted">
                No image
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </section>

    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
    <LazyShareModal :is-open="isShareModalOpen" :title="post.title" @close="isShareModalOpen = false" />
  </article>

  <!-- 404 Page: Chỉ hiển thị khi đã hoàn tất nạp dữ liệu và thực sự không tìm thấy bài viết -->
  <NotFoundBlock v-else-if="status !== 'pending'" status-code="404" title="Post Not Found"
    :message="`Bài viết /blog/${slug} không tồn tại hoặc đã bị gỡ bỏ.`" />
</template>

<style scoped>
:deep(.prose-content > h1:first-child) {
  display: none;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>

