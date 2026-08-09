<script setup lang="ts">
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

