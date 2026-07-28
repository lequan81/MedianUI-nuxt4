<script setup lang="ts">
import { useAppStore } from '~/stores/useAppStore'

const appStore = useAppStore()
</script>

<template>
  <nav 
    class="lg:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[var(--color-bg-card)] border-t border-[var(--color-border-main)] z-40 flex items-center justify-around px-2 shadow-lg transition-colors"
  >
    <!-- Home Button -->
    <NuxtLink 
      to="/" 
      class="flex flex-col items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors p-1"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
      <span class="text-[10px] font-medium">Home</span>
    </NuxtLink>

    <!-- Categories Button -->
    <button 
      @click="appStore.toggleMobileMenu" 
      class="flex flex-col items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors p-1"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
      </svg>
      <span class="text-[10px] font-medium">Menu</span>
    </button>

    <!-- Search Modal Trigger Button -->
    <button 
      @click="appStore.toggleSearchModal" 
      class="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/30 -mt-5 hover:scale-105 transition-transform"
      aria-label="Search"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    </button>

    <!-- Bookmarks Button -->
    <NuxtLink 
      to="/#bookmarks" 
      class="flex flex-col items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors p-1"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
      <span class="text-[10px] font-medium">Saved</span>
    </NuxtLink>

    <!-- Theme Switcher Button -->
    <button 
      @click="appStore.toggleDarkMode" 
      class="flex flex-col items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors p-1"
    >
      <svg v-if="appStore.isDarkMode" class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
      <span class="text-[10px] font-medium">Theme</span>
    </button>
  </nav>
</template>
