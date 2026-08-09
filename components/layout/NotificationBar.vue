<script setup lang="ts">
import { ref } from 'vue'

const isVisible = ref(true)

function dismiss() {
  isVisible.value = false
}
</script>

<template>
  <div v-if="isVisible"
    class="bg-blue-600 dark:bg-blue-950/80 border-b border-blue-700 dark:border-blue-900/50 text-white dark:text-blue-200 px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between transition-all duration-300 z-50 relative shadow-xs">
    <div class="max-w-7xl mx-auto w-full flex items-center justify-center gap-2 text-center px-4">
      <span class="inline-block w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
      <span>
        🎉 Welcome to <strong>Median UI v1.7</strong> reconstructed with <strong>Nuxt 4</strong> &amp; <strong>Tailwind
          CSS v4</strong>!
      </span>
      <a href="#" class="underline hover:text-blue-100 dark:hover:text-blue-300 font-semibold ml-1">Learn More
        &rarr;</a>
    </div>
    <button @click="dismiss" class="p-1 text-white hover:bg-blue-700 dark:hover:bg-blue-900/80 rounded-full transition-colors cursor-pointer"
      aria-label="Dismiss notification">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
