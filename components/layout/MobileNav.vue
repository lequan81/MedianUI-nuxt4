<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '~/stores/useAppStore'
import { useLangStore } from '~/stores/useLangStore'
import AppIcon from '~/components/ui/AppIcon.vue'

const appStore = useAppStore()
const langStore = useLangStore()

const currentFlag = computed(() => {
  return langStore.currentLang === 'vi' ? '🇻🇳' : '🇺🇸';
});
</script>

<template>
  <!-- Mobile Bottom Navigation Bar: Grid 5 cột chuẩn 100% đối xứng pixel-perfect -->
  <nav class="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 h-15 items-center border-t border-border-main bg-bg-base/95 text-text-alt shadow-lg backdrop-blur-md lg:hidden">
    <!-- 1. Home -->
    <NuxtLink to="/" class="flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors hover:text-primary">
      <div class="flex h-6 items-center justify-center">
        <AppIcon name="home" :size="20" />
      </div>
      <span>Home</span>
    </NuxtLink>

    <!-- 2. Menu -->
    <button
      type="button"
      class="flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors hover:text-primary cursor-pointer"
      @click="appStore.toggleMobileMenu"
    >
      <div class="flex h-6 items-center justify-center">
        <AppIcon name="menu" :size="20" />
      </div>
      <span>Menu</span>
    </button>

    <!-- 3. Search -->
    <button
      type="button"
      class="flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors hover:text-primary cursor-pointer"
      aria-label="Search"
      @click="appStore.toggleSearchModal"
    >
      <div class="flex h-6 items-center justify-center">
        <AppIcon name="search" :size="20" />
      </div>
      <span>Search</span>
    </button>

    <!-- 4. Language -->
    <button
      type="button"
      class="flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors hover:text-primary cursor-pointer"
      @click="langStore.toggleLanguage"
    >
      <div class="flex h-6 items-center justify-center">
        <span class="text-base leading-none">{{ currentFlag }}</span>
      </div>
      <span class="uppercase font-bold text-[9px]">{{ langStore.currentLang }}</span>
    </button>

    <!-- 5. Theme -->
    <button
      type="button"
      class="flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-medium transition-colors hover:text-primary cursor-pointer"
      @click="appStore.toggleDarkMode"
    >
      <div class="flex h-6 items-center justify-center">
        <AppIcon :name="appStore.isDarkMode ? 'sun' : 'moon'" :size="20" />
      </div>
      <span>Theme</span>
    </button>
  </nav>
</template>
