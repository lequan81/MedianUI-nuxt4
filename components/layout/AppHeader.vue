<script setup lang="ts">
import { useAppStore } from "~/stores/useAppStore";
import { useLangStore } from "~/stores/useLangStore";
import { siteConfig } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";

const appStore = useAppStore();
const langStore = useLangStore();

function handleSidebarToggle() {
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    appStore.toggleMobileMenu();
  } else {
    appStore.toggleSidebar();
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-(--header-height) w-full items-center gap-3.75 border-b border-border-main bg-bg-base/95 text-text-main backdrop-blur-md"
  >
    <!-- Left Section: Logo & Toggle Button — luôn 260px trên Desktop, auto trên Mobile -->
    <div class="flex h-full w-auto lg:w-(--side-width-expand) shrink-0 items-center">
      <button
        type="button"
        class="flex h-full w-12 lg:w-(--side-width) items-center justify-center text-text-alt transition-colors hover:text-primary focus:outline-none focus-visible:outline-none outline-none border-none shadow-none cursor-pointer"
        aria-label="Toggle sidebar"
        @click="handleSidebarToggle"
      >
        <AppIcon name="panel-left" :size="20" />
      </button>

      <div class="min-w-0 pr-4">
        <h1 class="truncate text-[1.143em] font-medium leading-normal">
          <NuxtLink to="/" class="transition-colors hover:text-primary">
            {{ siteConfig.shortName }}
          </NuxtLink>
        </h1>
      </div>
    </div>

    <!-- Right Section: Search bar (desktop full width) + Actions at far right -->
    <div class="flex min-w-0 flex-1 items-center gap-3 pr-(--content-padding)">
      <!-- Search: icon-only on mobile, 320px bar on desktop -->
      <button
        type="button"
        class="group flex h-9 w-9 lg:w-auto lg:min-w-0 lg:flex-[0_1_320px] items-center rounded-lg px-0 lg:px-2 text-left text-[13px] text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
        @click="appStore.toggleSearchModal"
      >
        <span class="flex h-9 w-8 shrink-0 items-center justify-center">
          <AppIcon name="search" :size="16" />
        </span>
        <span class="hidden truncate lg:inline">{{
          siteConfig.searchPlaceholder
        }}</span>
      </button>

      <!-- Actions: pinned to right via ml-auto -->
      <div class="ml-auto flex items-center gap-1 shrink-0">
        <!-- Language Switcher -->
        <button
          type="button"
          class="flex h-(--icon-height) items-center gap-1.5 px-2 rounded-lg text-xs font-semibold text-text-alt transition-colors hover:bg-bg-sec hover:text-primary cursor-pointer shrink-0"
          title="Ngôn ngữ / Language"
          aria-label="Ngôn ngữ / Language"
          @click="langStore.openLangModal"
        >
          <img
            :src="langStore.currentLangItem.flagUrl"
            :alt="langStore.currentLangItem.name"
            class="h-3.5 w-5 object-cover rounded-[2px] border border-white/20 shadow-2xs shrink-0"
          />
          <span class="text-[11px] font-bold uppercase tracking-wider text-text-main">{{ langStore.currentLangItem.code }}</span>
        </button>

        <!-- Theme Toggle -->
        <button
          type="button"
          class="flex h-(--icon-height) w-(--icon-width) items-center justify-center rounded-lg text-text-alt transition-colors hover:bg-bg-sec hover:text-primary cursor-pointer shrink-0"
          :title="appStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          :aria-label="appStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="appStore.toggleDarkMode"
        >
          <AppIcon :name="appStore.isDarkMode ? 'sun' : 'moon'" :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>
