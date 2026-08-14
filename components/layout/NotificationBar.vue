<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

// Update this version string whenever a new banner/announcement is published
const CURRENT_ANNOUNCEMENT_ID = "median-v1.7.0-release";

// 14 days time-to-live cookie for announcement dismissal
const dismissedCookie = useCookie<string | null>("median_dismissed_banner", {
  maxAge: 14 * 24 * 60 * 60, // 14 days
  path: "/",
  default: () => null,
});

// SSR-compatible visibility: automatically false if current version was already dismissed within 14 days
const isVisible = ref(dismissedCookie.value !== CURRENT_ANNOUNCEMENT_ID);

function dismiss() {
  isVisible.value = false;
  dismissedCookie.value = CURRENT_ANNOUNCEMENT_ID;
}
</script>

<template>
  <Transition name="banner-slide">
    <div
      v-if="isVisible"
      class="bg-indigo-600 dark:bg-slate-900 border-b border-indigo-500/30 dark:border-border-main text-white dark:text-text-main px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between z-50 relative shadow-sm"
    >
      <div class="max-w-7xl mx-auto w-full flex items-center justify-center gap-2 text-center px-2 sm:px-4">
        <span class="inline-block w-2 h-2 rounded-full bg-amber-300 animate-pulse shrink-0"></span>
        <span class="leading-normal">
          🎉 Welcome to <strong>Median UI v1.7</strong> reconstructed with <strong>Nuxt 4</strong> &amp; <strong>Tailwind CSS v4</strong>!
        </span>
        <NuxtLink to="/blog" class="underline hover:text-white/80 dark:hover:text-primary font-semibold ml-1 inline-flex items-center gap-0.5 shrink-0">
          Learn More &rarr;
        </NuxtLink>
      </div>

      <button
        type="button"
        class="p-1 text-white/80 hover:text-white dark:text-text-alt dark:hover:text-text-main hover:bg-white/10 dark:hover:bg-bg-sec rounded-lg transition-colors cursor-pointer shrink-0"
        aria-label="Đóng thông báo"
        @click="dismiss"
      >
        <AppIcon name="x" :size="16" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 80px;
  overflow: hidden;
}

.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  transform: translateY(-100%);
}
</style>
