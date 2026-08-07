<script setup lang="ts">
import { computed, ref } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";
import { useAuthor } from "~/composables/useAuthor";

const props = withDefaults(
  defineProps<{
    author?: any;
    size?: "sm" | "md";
  }>(),
  {
    size: "md",
  }
);

const isVisible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const computedPos = ref<{ vertical: "top" | "bottom"; horizontal: "left" | "right" }>({
  vertical: "top",
  horizontal: "left",
});

let hideTimer: ReturnType<typeof setTimeout> | null = null;

function calculateSmartPosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;

  const spaceBelow = vh - rect.bottom;
  const spaceAbove = rect.top;
  const spaceRight = vw - rect.left;

  const vertical = spaceAbove < 220 && spaceBelow > spaceAbove ? "bottom" : "top";
  const horizontal = spaceRight < 270 ? "right" : "left";

  computedPos.value = { vertical, horizontal };
}

function showTooltip() {
  if (hideTimer) clearTimeout(hideTimer);
  calculateSmartPosition();
  isVisible.value = true;
}

function hideTooltip() {
  hideTimer = setTimeout(() => {
    isVisible.value = false;
  }, 180);
}

const authorData = computed(() => {
  return useAuthor(props.author);
});

const placementClasses = computed(() => {
  const v = computedPos.value.vertical === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const h = computedPos.value.horizontal === "right" ? "right-0" : "left-0";
  return `${v} ${h}`;
});
</script>

<template>
  <div
    ref="triggerRef"
    class="relative inline-flex items-center text-text-main group/badge cursor-pointer"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <!-- Slot Mặc Định Cho Phần Post Meta Badge: Avatar viền Ring CSS Tròn Tuyệt Đối 100% -->
    <slot v-bind="{ author: authorData || {}, isVisible: isVisible || false }">
      <div class="flex items-center gap-2 cursor-pointer">
        <NuxtImg
          :src="authorData.avatar"
          :alt="authorData.name"
          :class="[
            'rounded-full object-cover ring-2 ring-primary/20 shadow-xs transition-all duration-300 group-hover/badge:ring-primary group-hover/badge:scale-105 hover:ring-primary hover:scale-105',
            size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
          ]"
          loading="lazy" />
        <span class="font-semibold uppercase tracking-wider text-text-main group-hover/badge:text-primary transition-colors">
          {{ authorData.name }}
        </span>
      </div>
    </slot>

    <!-- Card Tooltip Popover Đặt Đúng Ngay Trên Đầu Tác Giả Chuẩn 0.0.8 Gốc -->
    <Transition name="fade-slide">
      <div
        v-if="isVisible"
        :class="[
          'absolute z-50 w-64 rounded-xl border border-border-main bg-bg-alt p-3.5 shadow-xl text-left pointer-events-auto select-none',
          placementClasses
        ]"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
      >
        <!-- Header Info Inside Tooltip Popover -->
        <div class="flex items-center gap-2.5">
          <NuxtImg
            :src="authorData.avatar"
            :alt="authorData.name"
            class="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20 shadow-xs transition-all duration-300 hover:ring-primary hover:scale-105 cursor-pointer"
            loading="lazy" />
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-sm text-text-main truncate leading-tight">
              {{ authorData.name }}
            </h4>
            <p class="text-xs text-primary font-semibold mt-0.5">
              {{ authorData.handle }}
            </p>
          </div>
        </div>

        <!-- Clean Bio Line -->
        <p v-if="authorData.bio" class="mt-2.5 text-xs leading-relaxed text-text-alt">
          {{ authorData.bio }}
        </p>

        <!-- Social Icons Row -->
        <div v-if="authorData.socials?.length" class="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-end">
          <div class="flex items-center gap-1.5">
            <a
              v-for="social in authorData.socials"
              :key="social.href || social.name"
              :href="social.href"
              target="_blank"
              rel="noreferrer"
              :title="social.name"
              class="flex h-7 w-7 items-center justify-center rounded-lg border border-border-main bg-bg-sec text-text-alt transition-colors hover:border-primary hover:text-primary hover:bg-bg-base"
            >
              <AppIcon :name="social.icon || 'globe'" :size="14" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
