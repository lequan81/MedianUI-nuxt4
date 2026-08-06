<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";
import { useAuthor } from "~/composables/useAuthor";
import { useFloatingPopover } from "~/composables/useFloatingPopover";

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
const floatingRef = ref<HTMLElement | null>(null);

let hideTimer: ReturnType<typeof setTimeout> | null = null;

// Floating UI Auto-Flip & Shift positioning against viewport overflow
const { x, y } = useFloatingPopover(triggerRef, floatingRef, isVisible, {
  placement: "top",
  offsetDistance: 8,
  padding: 8,
});

function showTooltip() {
  if (hideTimer) clearTimeout(hideTimer);
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
  isVisible.value = !isVisible.value;
}

function handleClickOutside(e: Event) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node) && floatingRef.value && !floatingRef.value.contains(e.target as Node)) {
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
    <!-- Slot Mặc Định Cho Phần Post Meta Badge -->
    <slot :author="authorData" :isVisible="isVisible">
      <div class="flex items-center gap-2 cursor-pointer active:opacity-80">
        <NuxtImg
          :src="authorData.avatar"
          :alt="authorData.name"
          :class="[
            'rounded-full object-cover ring-2 shadow-xs transition-all duration-300',
            isVisible
              ? 'ring-primary scale-105'
              : 'ring-primary/20 group-hover/badge:ring-primary group-hover/badge:scale-105 group-active/badge:ring-primary group-active/badge:scale-105',
            size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
          ]"
          format="webp"
          loading="lazy"
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

    <!-- Floating Tooltip Card với Auto-Flip/Shift Floating UI -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isVisible"
          ref="floatingRef"
          :style="{
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
          }"
          class="z-100 w-64 rounded-2xl border border-border-main bg-bg-base p-4 shadow-xl text-text-main select-none pointer-events-auto"
          @mouseenter="showTooltip"
          @mouseleave="hideTooltip"
          @click.stop
        >
          <div class="flex items-center gap-3">
            <NuxtImg
              :src="authorData.avatar"
              :alt="authorData.name"
              class="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-primary/40 shadow-xs"
              format="webp"
              loading="lazy"
            />
            <div class="min-w-0 flex-1">
              <h4 class="text-xs font-bold text-text-main truncate">
                {{ authorData.name }}
              </h4>
              <p class="text-[11px] font-semibold text-primary">
                {{ authorData.handle }}
              </p>
            </div>
          </div>

          <p class="mt-2.5 text-xs text-text-alt leading-relaxed line-clamp-2">
            {{ authorData.bio }}
          </p>

          <div class="mt-3 flex items-center justify-between border-t border-border-subtle pt-2.5">
            <a
              :href="authorData.website"
              target="_blank"
              rel="noreferrer"
              class="text-[11px] font-bold text-primary hover:underline"
            >
              Trang cá nhân →
            </a>
            <span class="text-[10px] font-mono text-text-muted">Software Engineer</span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
