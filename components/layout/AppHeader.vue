<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAppStore } from "~/stores/useAppStore";
import { useLangStore } from "~/stores/useLangStore";
import { siteConfig } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";

const appStore = useAppStore();
const langStore = useLangStore();

const currentFlag = computed(() => {
  return langStore.currentLang === 'vi' ? '🇻🇳' : '🇺🇸';
});

onMounted(() => {
  appStore.initTheme();
});
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b border-border-main bg-bg-base text-text-main backdrop-blur-md">
    <div class="flex h-full w-60 shrink-0 items-center">
      <button type="button"
        class="flex h-full w-20 items-center justify-center text-text-alt transition-colors hover:text-primary focus:outline-none focus-visible:outline-none outline-none border-none shadow-none cursor-pointer"
        aria-label="Toggle sidebar" @click="appStore.toggleSidebar">
        <AppIcon name="panel-left" :size="20" />
      </button>

      <div class="min-w-0 pr-4">
        <h1 class="truncate text-base sm:text-lg font-medium leading-normal">
          <NuxtLink to="/" class="transition-colors hover:text-primary">
            {{ siteConfig.shortName }}
          </NuxtLink>
        </h1>
      </div>
    </div>

    <div class="flex min-w-0 flex-1 items-center gap-3 pr-6">
      <button type="button"
        class="group flex h-9 min-w-0 flex-[0_1_320px] items-center rounded-lg px-2 text-left text-xs sm:text-sm text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
        aria-label="Mở khung tìm kiếm bài viết"
        @click="appStore.toggleSearchModal">

        <span class="flex h-9 w-8 shrink-0 items-center justify-center">
          <AppIcon name="search" :size="16" />
        </span>
        <span class="hidden truncate md:inline">
          {{ siteConfig.searchPlaceholder }}
        </span>
      </button>

      <div class="ml-auto flex items-center justify-end gap-1">
        <!-- Language Modal Trigger Button -->
        <ClientOnly>
          <button type="button"
            class="flex h-9 items-center gap-1.5 px-2 text-xs font-semibold text-text-alt transition-colors hover:text-primary cursor-pointer"
            :title="langStore.currentLang === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'"
            :aria-label="langStore.currentLang === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'"
            @click="langStore.openLangModal">
            <span class="text-sm leading-none shrink-0">{{ currentFlag }}</span>
            <span class="text-[11px] font-bold uppercase tracking-wider text-text-main">
              {{ langStore.currentLang }}
            </span>
            <AppIcon name="chevron-down" :size="12" class="text-text-muted" />
          </button>

          <!-- Theme Toggle Button -->
          <button type="button" @click="appStore.toggleDarkMode"
            class="flex h-9 w-9 items-center justify-center text-text-alt transition-colors hover:text-primary cursor-pointer"
            :title="appStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-label="appStore.isDarkMode ? 'View light mode' : 'View dark mode'">
            <AppIcon :name="appStore.isDarkMode ? 'sun' : 'moon'" :size="18" />
          </button>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
