<script setup lang="ts">
import { useAppStore } from "~/stores/useAppStore";
import { siteConfig } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";

const appStore = useAppStore();
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-(--header-height) w-full items-center gap-3.75 border-b border-border-main bg-bg-base/95 text-text-main backdrop-blur-md"
  >
    <div class="flex h-full w-(--side-width-expand) shrink-0 items-center">
      <button
        type="button"
        class="flex h-full w-(--side-width) items-center justify-center text-text-alt transition-colors hover:text-primary focus:outline-none focus-visible:outline-none outline-none border-none shadow-none"
        aria-label="Toggle sidebar"
        @click="appStore.toggleSidebar"
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

    <div class="flex min-w-0 flex-1 items-center gap-3 pr-(--content-padding)">
      <button
        type="button"
        class="group flex h-9 min-w-0 flex-[0_1_320px] items-center rounded-lg px-2 text-left text-[13px] text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main"
        @click="appStore.toggleSearchModal"
      >
        <span class="flex h-9 w-8 shrink-0 items-center justify-center">
          <AppIcon name="search" :size="16" />
        </span>
        <span class="hidden truncate md:inline">{{
          siteConfig.searchPlaceholder
        }}</span>
      </button>

      <div class="ml-auto flex items-center justify-end gap-1">
        <button
          type="button"
          class="flex h-(--icon-height) w-(--icon-width) items-center justify-center text-text-alt transition-colors hover:text-primary"
          :title="
            appStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          "
          :aria-label="
            appStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          "
          @click="appStore.toggleDarkMode"
        >
          <AppIcon :name="appStore.isDarkMode ? 'sun' : 'moon'" :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>
