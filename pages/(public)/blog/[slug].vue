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
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      readingProgress.value = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
    }
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
  <!-- Top Reading Progress Indicator -->
  <div
    class="fixed top-0 left-0 right-0 h-0.75 bg-primary z-50 transition-all duration-75 pointer-events-none"
    :style="{ width: `${readingProgress}%` }"
  ></div>

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
        <WidgetTitle title="Bạn có thể thích những bài đăng này" />

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
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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

  <!-- 404 Page: Tối ưu UI/UX Mobile & Desktop Chuẩn Đẹp Tự Động -->
  <NotFoundBlock v-else status-code="404" title="Post Not Found"
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

