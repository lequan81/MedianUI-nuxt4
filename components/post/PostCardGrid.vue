<script setup lang="ts">
import { useAppStore } from "~/stores/useAppStore";
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import AuthorTooltip from "~/components/post/AuthorTooltip.vue";
import type { PostItem } from "~/types/post";

const props = defineProps<{
  post: PostItem | any;
}>();

const appStore = useAppStore();
</script>

<template>
  <article
    class="group relative rounded-xl bg-(--color-bg-card) border border-border-main overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
  >
    <!-- Thumbnail Header Link -->
    <div class="relative w-full aspect-16/7 sm:aspect-video overflow-hidden bg-bg-sec">
      <NuxtLink :to="post.path || '#'" class="relative block aspect-16/7 sm:aspect-video w-full h-full">
        <NuxtImg
          :src="post.thumbnail"
          :alt="post.title"
          class="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          format="webp"
          quality="80"
          sizes="sm:100vw md:500px lg:400px"
          width="400"
          height="225"
        />
      </NuxtLink>

      <!-- Category Label Overlay -->
      <span
        class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs z-10 pointer-events-none"
      >
        {{ post.category }}
      </span>

      <!-- Bookmark Icon Button -->
      <button
        type="button"
        @click.stop.prevent="appStore.toggleBookmark(post.id)"
        class="absolute top-2.5 right-2.5 p-1.5 min-h-9 min-w-9 flex items-center justify-center rounded-lg bg-slate-900/60 backdrop-blur-xs text-white hover:bg-slate-900/90 transition-colors cursor-pointer z-10"
        :aria-label="appStore.isBookmarked(post.id) ? 'Bỏ lưu bài viết' : 'Lưu bài viết'"
        :title="appStore.isBookmarked(post.id) ? 'Bỏ lưu bài viết' : 'Lưu bài viết'"
      >
        <svg
          class="w-4 h-4"
          :fill="appStore.isBookmarked(post.id) ? 'currentColor' : 'none'"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    </div>

    <!-- Body Info -->
    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
      <!-- Direct NuxtLink wrapping Title + Description Snippet -->
      <NuxtLink :to="post.path || '#'" class="block space-y-1.5 group/link cursor-pointer">
        <h3
          class="font-bold text-sm sm:text-base text-text-main group-hover/link:text-primary transition-colors line-clamp-2 leading-snug"
        >
          {{ post.title }}
        </h3>
        <p class="text-xs text-text-muted line-clamp-2 leading-relaxed">
          {{ post.snippet }}
        </p>
      </NuxtLink>

      <!-- Author Meta Footer với Tooltip Popover -->
      <div class="pt-2.5 border-t border-border-main flex items-center justify-between text-[11px] text-text-muted relative z-10">
        <AuthorTooltip :author="post.author" size="sm">
          <template #default="slotProps">
            <div class="flex items-center gap-1.5 min-w-0 cursor-pointer">
              <NuxtImg
                :src="slotProps?.author?.avatar"
                :alt="slotProps?.author?.name || 'Tác giả'"
                class="w-5.5 h-5.5 shrink-0 rounded-full object-cover ring-1 ring-border-main"
                width="22"
                height="22"
                format="webp"
                quality="80"
              />
              <span class="font-medium text-text-main truncate max-w-28 hover:text-primary transition-colors">
                {{ slotProps?.author?.name }}
              </span>
            </div>
          </template>
        </AuthorTooltip>

        <div class="flex items-center gap-1.5">
          <span>{{ post.date }}</span>
          <span>·</span>
          <span>{{ post.readTime }}</span>
        </div>
      </div>
    </div>
  </article>
</template>
