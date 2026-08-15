<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import { useSiteSettings } from "~/composables/useSiteSettings";

const { announcement } = useSiteSettings();

// 14 days time-to-live cookie for announcement dismissal
const dismissedCookie = useCookie<string | null>("median_dismissed_banner", {
  maxAge: 14 * 24 * 60 * 60, // 14 days
  path: "/",
  default: () => null,
});

// SSR-compatible visibility: automatically false if current version was already dismissed
const isVisible = ref(false);

const shouldShow = computed(() => {
  if (!announcement.value.enabled || !announcement.value.text) return false;
  return isVisible.value;
});

watch(
  () => announcement.value.id,
  (newId) => {
    isVisible.value = dismissedCookie.value !== newId;
  },
  { immediate: true }
);

function dismiss() {
  isVisible.value = false;
  dismissedCookie.value = announcement.value.id;
}
</script>

<template>
  <Transition name="banner-slide">
    <div
      v-if="shouldShow"
      class="relative z-50 flex items-center justify-between bg-primary text-white border-b border-black/10 px-3 py-2 sm:px-4 sm:py-2.5 text-xs shadow-xs"
    >
      <div class="max-w-7xl mx-auto w-full flex items-center justify-center gap-2 text-center px-1 sm:px-4 min-w-0">
        <span
          v-if="announcement.badge"
          class="rounded-full bg-white/20 text-white border border-white/30 px-2 py-0.5 text-[10.5px] font-bold tracking-wide shrink-0"
        >
          {{ announcement.badge }}
        </span>

        <span class="text-xs sm:text-[13px] font-medium text-white leading-normal truncate sm:overflow-visible">
          {{ announcement.text }}
        </span>

        <NuxtLink
          v-if="announcement.link"
          :to="announcement.link"
          class="inline-flex items-center gap-1 font-bold text-white hover:underline ml-1 shrink-0 transition-opacity hover:opacity-90"
        >
          <span>Khám phá ngay</span>
          <AppIcon name="arrow-right" :size="12" />
        </NuxtLink>
      </div>

      <button
        type="button"
        class="p-1 text-white/80 hover:text-white hover:bg-white/15 rounded-md transition-colors cursor-pointer shrink-0 ml-2"
        aria-label="Đóng thông báo"
        @click="dismiss"
      >
        <AppIcon name="x" :size="14" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 60px;
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
