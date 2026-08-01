<script setup lang="ts">
import { useAppStore } from '~/stores/useAppStore'

export interface Post {
  id: number
  title: string
  snippet: string
  category: string
  author: {
    name: string
    avatar: string
    bio?: string
  }
  date: string
  readTime: string
  thumbnail: string
  views: number
  featured?: boolean
}

const props = defineProps<{
  post: Post
}>()

const appStore = useAppStore()
</script>

<template>
  <article
    class="group rounded-xl bg-(--color-bg-card) border border-border-main overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
    <!-- Thumbnail Header (16:9 Aspect Ratio) -->
    <div class="relative w-full aspect-video overflow-hidden bg-bg-sec">
      <img :src="post.thumbnail" :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />

      <!-- Category Label Overlay -->
      <span
        class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
        {{ post.category }}
      </span>

      <!-- Bookmark Icon Button -->
      <button @click.stop.prevent="appStore.toggleBookmark(post.id)"
        class="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/60 backdrop-blur-xs text-white hover:bg-slate-900/90 transition-colors"
        :title="appStore.isBookmarked(post.id) ? 'Saved' : 'Save'">
        <svg class="w-3.5 h-3.5" :fill="appStore.isBookmarked(post.id) ? 'currentColor' : 'none'" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>

    <!-- Body Info -->
    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
      <div class="space-y-1.5">
        <h3
          class="font-bold text-sm sm:text-base text-text-main group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          <NuxtLink to="#">{{ post.title }}</NuxtLink>
        </h3>
        <p class="text-xs text-text-muted line-clamp-2 leading-relaxed">
          {{ post.snippet }}
        </p>
      </div>

      <!-- Author Meta Footer -->
      <div class="pt-2.5 border-t border-border-main flex items-center justify-between text-[11px] text-text-muted">
        <div class="flex items-center gap-1.5 min-w-0">
          <img
            :src="post.author.avatar"
            :alt="post.author.name"
            class="w-5.5 h-5.5 shrink-0 rounded-full object-cover ring-1 ring-border-main"
          />
          <span class="font-medium text-text-main truncate max-w-28">
            {{ post.author.name }}
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <span>{{ post.date }}</span>
          <span>·</span>
          <span>{{ post.readTime }}</span>
        </div>
      </div>
    </div>
  </article>
</template>
