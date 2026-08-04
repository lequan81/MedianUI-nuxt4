<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from '~/stores/useAppStore'
import { useLangStore } from '~/stores/useLangStore'
import AppIcon from '~/components/ui/AppIcon.vue'

const route = useRoute()
const appStore = useAppStore()
const langStore = useLangStore()
</script>

<template>
  <!-- Mobile Bottom Navigation Bar: Grid 5 cột chuẩn 20% mỗi cột, 100% vừa vặn không bao giờ bị tràn -->
  <nav class="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 h-15 w-full items-center px-1 border-t border-border-main bg-bg-base/95 text-text-alt shadow-lg backdrop-blur-md lg:hidden overflow-hidden">
    <!-- 1. Home -->
    <NuxtLink
      to="/"
      class="flex w-full flex-col items-center justify-center gap-1 py-1 text-[9.5px] font-medium transition-colors hover:text-primary overflow-hidden"
      :class="route.path === '/' ? 'text-primary font-bold' : ''"
    >
      <AppIcon name="home" :size="19" :class="route.path === '/' ? 'text-primary' : ''" />
      <span class="truncate leading-none">Home</span>
    </NuxtLink>

    <!-- 2. Menu -->
    <button
      type="button"
      class="flex w-full flex-col items-center justify-center gap-1 py-1 text-[9.5px] font-medium transition-colors hover:text-primary cursor-pointer overflow-hidden"
      :class="appStore.isMobileMenuOpen ? 'text-primary font-bold' : ''"
      @click="appStore.toggleMobileMenu"
    >
      <AppIcon name="menu" :size="19" :class="appStore.isMobileMenuOpen ? 'text-primary' : ''" />
      <span class="truncate leading-none">Menu</span>
    </button>

    <!-- 3. Search -->
    <button
      type="button"
      class="flex w-full flex-col items-center justify-center gap-1 py-1 text-[9.5px] font-medium transition-colors hover:text-primary cursor-pointer overflow-hidden"
      aria-label="Search"
      @click="appStore.toggleSearchModal"
    >
      <AppIcon name="search" :size="19" />
      <span class="truncate leading-none">Search</span>
    </button>

    <!-- 4. Language Switcher (Opens Language Modal) -->
    <button
      type="button"
      class="flex w-full flex-col items-center justify-center gap-0.5 py-1 text-[9.5px] font-medium transition-colors hover:text-primary cursor-pointer overflow-hidden"
      @click="langStore.openLangModal"
    >
      <div class="flex h-5.5 items-center justify-center">
        <img
          :src="langStore.currentLangItem.flagUrl"
          :alt="langStore.currentLangItem.name"
          class="h-3.5 w-5 object-cover rounded-[2px] border border-white/20 shadow-2xs shrink-0"
        />
      </div>
      <span class="uppercase font-bold text-[9px] text-text-main leading-none truncate">{{ langStore.currentLangItem.code }}</span>
    </button>

    <!-- 5. Theme Switcher -->
    <button
      type="button"
      class="flex w-full flex-col items-center justify-center gap-1 py-1 text-[9.5px] font-medium transition-colors hover:text-primary cursor-pointer overflow-hidden"
      @click="appStore.toggleDarkMode"
    >
      <AppIcon :name="appStore.isDarkMode ? 'sun' : 'moon'" :size="19" />
      <span class="truncate leading-none">Theme</span>
    </button>
  </nav>
</template>
