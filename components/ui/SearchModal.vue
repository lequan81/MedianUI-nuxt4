<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '~/stores/useAppStore'

const appStore = useAppStore()
const searchQuery = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const popularTags = ['Nuxt 4', 'Tailwind CSS v4', 'Median UI v1.7', 'Vue 3', 'Blogger Theme', 'Design System']

function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    appStore.toggleSearchModal()
  } else if (e.key === 'Escape' && appStore.isSearchOpen) {
    appStore.closeSearchModal()
  }
}

watch(() => appStore.isSearchOpen, (isOpen) => {
  if (isOpen) {
    setTimeout(() => inputRef.value?.focus(), 100)
  } else {
    searchQuery.value = ''
  }
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="appStore.isSearchOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-md"
        @click.self="appStore.closeSearchModal">
        <div
          class="w-full max-w-2xl bg-(--color-bg-card) border border-border-main rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
          <!-- Search Header Input -->
          <div class="p-4 border-b border-border-main flex items-center gap-3">
            <svg class="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input ref="inputRef" v-model="searchQuery" type="text" placeholder="Search articles, topics, components..."
              class="w-full bg-transparent text-text-main placeholder-(--color-text-muted) text-base font-medium outline-none" />
            <button v-if="searchQuery" @click="searchQuery = ''"
              class="p-1 rounded-full text-(--color-text-muted) hover:bg-bg-sec">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <kbd
              class="px-2 py-1 text-[10px] font-semibold bg-bg-sec text-(--color-text-muted) rounded border border-border-main">
              ESC
            </kbd>
          </div>

          <!-- Suggested Topics / Results Body -->
          <div class="p-5 overflow-y-auto space-y-4">
            <div v-if="!searchQuery">
              <h4 class="text-xs font-bold uppercase tracking-wider text-(--color-text-muted) mb-3">
                Suggested Topics
              </h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in popularTags" :key="tag" @click="searchQuery = tag"
                  class="px-3 py-1.5 rounded-xl bg-bg-sec hover:bg-primary-light text-text-main hover:text-primary text-xs font-medium border border-border-main transition-colors">
                  # {{ tag }}
                </button>
              </div>
            </div>

            <!-- Dynamic Search Query Feedback -->
            <div v-else class="space-y-3">
              <div class="text-xs text-(--color-text-muted)">
                Search results for: <span class="font-bold text-primary">"{{ searchQuery }}"</span>
              </div>
              <div
                class="p-4 rounded-xl bg-bg-sec border border-border-main text-sm text-(--color-text-muted) text-center">
                🔍 Press Enter or browse articles matched with "{{ searchQuery }}".
              </div>
            </div>
          </div>

          <!-- Search Footer -->
          <div
            class="px-5 py-3 bg-bg-sec border-t border-border-main flex items-center justify-between text-xs text-(--color-text-muted)">
            <span>Search powered by <strong>Nuxt 4</strong></span>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-(--color-bg-card) rounded border text-[10px]">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-(--color-bg-card) rounded border text-[10px]">↓</kbd>
                to navigate
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
