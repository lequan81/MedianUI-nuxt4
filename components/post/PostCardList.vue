<script setup lang="ts">
import { useAppStore } from '~/stores/useAppStore'
import type { Post } from './PostCardGrid.vue'

const props = defineProps<{
  post: Post
}>()

const appStore = useAppStore()
</script>

<template>
  <article
    class="group rounded-xl bg-(--color-bg-card) border border-border-main overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-stretch">
    <!-- Thumbnail -->
    <div class="relative w-full h-36 sm:w-48 sm:h-auto sm:aspect-auto overflow-hidden bg-bg-sec shrink-0">
      <NuxtImg :src="post.thumbnail" :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
        format="webp" />
      <span
        class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-primary text-white text-[9px] font-bold uppercase tracking-wider shadow-2xs">
        {{ post.category }}
      </span>
    </div>

    <!-- Details -->
    <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-[11px] text-text-muted">
            <span class="font-medium text-primary">{{ post.author.name }}</span>
            <span>·</span>
            <span>{{ post.date }}</span>
          </div>
          <button @click="appStore.toggleBookmark(post.id)" class="text-text-muted hover:text-primary p-1">
            <svg class="w-3.5 h-3.5" :fill="appStore.isBookmarked(post.id) ? 'currentColor' : 'none'"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
        <h3
          class="font-bold text-sm sm:text-base text-text-main group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          <NuxtLink to="#">{{ post.title }}</NuxtLink>
        </h3>
        <p class="text-xs text-text-muted line-clamp-2 leading-relaxed">
          {{ post.snippet }}
        </p>
      </div>

      <div class="flex items-center justify-between text-[11px] text-text-muted pt-1">
        <span>{{ post.readTime }} read</span>
        <span>{{ post.views }} views</span>
      </div>
    </div>
  </article>
</template>
