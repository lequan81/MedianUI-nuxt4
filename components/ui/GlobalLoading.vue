<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useNuxtApp } from "#imports";

const isLoading = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const nuxtApp = useNuxtApp();

function startLoading() {
  if (timer) clearTimeout(timer);
  isLoading.value = true;
}

function stopLoading() {
  timer = setTimeout(() => {
    isLoading.value = false;
  }, 250);
}

onMounted(() => {
  nuxtApp.hook("page:start", startLoading);
  nuxtApp.hook("page:finish", stopLoading);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/60 backdrop-blur-xs transition-all pointer-events-none select-none"
    >
      <div
        class="flex flex-col items-center gap-3 rounded-2xl border border-border-main bg-bg-alt/90 p-5 shadow-xl backdrop-blur-md"
      >
        <!-- Animated React-style spinner -->
        <div class="relative flex h-10 w-10 items-center justify-center">
          <div
            class="h-10 w-10 animate-spin rounded-full border-3 border-border-main border-t-primary"
          ></div>
        </div>
        <span class="text-xs font-medium tracking-wide text-text-muted animate-pulse">
          Đang tải...
        </span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
