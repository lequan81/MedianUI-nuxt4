<script setup lang="ts">
import { computed, ref } from "vue";
import { useTimeout } from "~/composables/useTimeout";

const props = withDefaults(
  defineProps<{
    placement?: "top" | "bottom" | "auto";
    align?: "left" | "right" | "center";
    delay?: number;
    headerOffset?: number;
    contentClass?: string;
  }>(),
  {
    placement: "auto",
    align: "left",
    delay: 180,
    headerOffset: 180,
    contentClass: "w-60 p-3",
  }
);

const isVisible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const computedPos = ref<{ vertical: "top" | "bottom"; horizontal: "left" | "right" | "center" }>({
  vertical: "top",
  horizontal: props.align,
});

const { set: setHideTimer, clear: clearHideTimer } = useTimeout();

function calculatePosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const vh = import.meta.client ? window.innerHeight : 800;
  const vw = import.meta.client ? window.innerWidth : 1200;

  const spaceAbove = rect.top;
  const spaceRight = vw - rect.left;

  const vertical =
    props.placement === "auto"
      ? spaceAbove < props.headerOffset
        ? "bottom"
        : "top"
      : props.placement;

  const horizontal =
    props.align === "center"
      ? "center"
      : spaceRight < 260
      ? "right"
      : props.align;

  computedPos.value = { vertical, horizontal };
}

function showTooltip() {
  clearHideTimer();
  calculatePosition();
  isVisible.value = true;
}

function hideTooltip() {
  setHideTimer(() => {
    isVisible.value = false;
  }, props.delay);
}

const placementClasses = computed(() => {
  const v = computedPos.value.vertical === "top" ? "bottom-full mb-2" : "top-full mt-2";
  let h = "left-0";
  if (computedPos.value.horizontal === "right") {
    h = "right-0";
  } else if (computedPos.value.horizontal === "center") {
    h = "left-1/2 -translate-x-1/2";
  }
  return `${v} ${h}`;
});
</script>

<template>
  <div
    ref="triggerRef"
    class="relative inline-block cursor-pointer"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <!-- Slot trigger (e.g. +#4 badge or author badge) -->
    <slot name="trigger" v-bind="{ isVisible, showTooltip, hideTooltip }" />

    <!-- Slot content (Popover Card) -->
    <Transition name="fade-slide">
      <div
        v-if="isVisible"
        :class="[
          'absolute z-50 rounded-xl border border-border-main bg-bg-alt shadow-xl backdrop-blur-md pointer-events-auto select-none',
          placementClasses,
          contentClass
        ]"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
      >
        <slot v-bind="{ isVisible, hideTooltip }" />
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
