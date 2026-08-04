<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
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
  vertical: "bottom",
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

  const vertical = spaceBelow < 180 && spaceAbove > spaceBelow ? "top" : "bottom";
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
  }, 220);
}

function handleTriggerClick(e: Event) {
  e.stopPropagation();
  if (hideTimer) clearTimeout(hideTimer);
  calculateSmartPosition();
  isVisible.value = !isVisible.value;
}

function handleClickOutside(e: Event) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    isVisible.value = false;
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("touchstart", handleClickOutside);
  }
});

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
    class="relative inline-flex items-center text-text-main group/badge cursor-pointer select-none"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @click="handleTriggerClick"
    @touchend.prevent="handleTriggerClick"
  >
    <!-- Slot Mặc Định Cho Phần Post Meta Badge với Active State khi Tap/Hover -->
    <slot :author="authorData" :isVisible="isVisible">
      <div class="flex items-center gap-2 cursor-pointer active:opacity-80">
        <img
          :src="authorData.avatar"
          :alt="authorData.name"
          :class="[
            'rounded-full object-cover ring-2 shadow-xs transition-all duration-300',
            isVisible
              ? 'ring-primary scale-105'
              : 'ring-primary/20 group-hover/badge:ring-primary group-hover/badge:scale-105 group-active/badge:ring-primary group-active/badge:scale-105',
            size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
          ]"
        />
        <span
          :class="[
            'font-semibold uppercase tracking-wider transition-colors',
            isVisible
              ? 'text-primary'
              : 'text-text-main group-hover/badge:text-primary group-active/badge:text-primary'
          ]"
        >
          {{ authorData.name }}
        </span>
      </div>
    </slot>

    <!-- Card Tooltip Popover -->
    <Transition name="fade-slide">
      <div
        v-if="isVisible"
        :class="[
          'absolute z-50 w-64 rounded-xl border border-border-main bg-bg-alt p-3.5 shadow-xl text-left pointer-events-auto',
          placementClasses
        ]"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
        @click.stop
        @touchend.stop
      >
        <!-- Header Info Inside Tooltip Popover -->
        <div class="flex items-center gap-2.5">
          <img
            :src="authorData.avatar"
            :alt="authorData.name"
            class="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20 shadow-xs transition-all duration-300 hover:ring-primary hover:scale-105 active:scale-105 cursor-pointer"
          />
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
        <div v-if="authorData.socials?.length" class="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between">
          <span class="text-[11px] font-medium text-text-muted">Liên hệ:</span>
          <div class="flex items-center gap-1.5">
            <a
              v-for="social in authorData.socials"
              :key="social.href || social.name"
              :href="social.href"
              target="_blank"
              rel="noreferrer"
              :title="social.name"
              class="flex h-7 w-7 items-center justify-center rounded-lg border border-border-main bg-bg-sec text-text-alt transition-colors hover:border-primary hover:text-primary hover:bg-bg-base active:scale-95"
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
