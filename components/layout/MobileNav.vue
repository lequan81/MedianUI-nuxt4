<script setup lang="ts">
import { useAppStore } from '~/stores/useAppStore'
import AppIcon from '~/components/ui/AppIcon.vue'

const appStore = useAppStore()
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border-main bg-bg-base/95 px-2 text-text-alt shadow-lg backdrop-blur-md lg:hidden">
    <NuxtLink to="/" class="flex min-w-12 flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors hover:text-primary">
      <AppIcon name="home" :size="20" />
      <span>Home</span>
    </NuxtLink>

    <button
      type="button"
      class="flex min-w-12 flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors hover:text-primary"
      @click="appStore.toggleMobileMenu"
    >
      <AppIcon name="menu" :size="20" />
      <span>Menu</span>
    </button>

    <button
      type="button"
      class="-mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105"
      aria-label="Search"
      @click="appStore.toggleSearchModal"
    >
      <AppIcon name="search" :size="20" />
    </button>

    <NuxtLink to="/#saved" class="flex min-w-12 flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors hover:text-primary">
      <AppIcon name="bookmark" :size="20" />
      <span>Saved</span>
    </NuxtLink>

    <button
      type="button"
      class="flex min-w-12 flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors hover:text-primary"
      @click="appStore.toggleDarkMode"
    >
      <AppIcon :name="appStore.isDarkMode ? 'sun' : 'moon'" :size="20" />
      <span>Theme</span>
    </button>
  </nav>
</template>
