<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useNuxtApp, useRouter } from "#imports";

const isLoading = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;
let maxSafetyTimer: ReturnType<typeof setTimeout> | null = null;
let loadStartTime = 0;

const MIN_SHOW_MS = 320; // Đảm bảo overlay luôn hiển thị mượt mà ít nhất 320ms trên mọi thao tác click

const nuxtApp = useNuxtApp();
const router = useRouter();

function startLoading() {
  if (timer) clearTimeout(timer);
  if (maxSafetyTimer) clearTimeout(maxSafetyTimer);

  loadStartTime = Date.now();
  isLoading.value = true;

  maxSafetyTimer = setTimeout(() => {
    isLoading.value = false;
  }, 1000);
}

function stopLoading() {
  if (maxSafetyTimer) clearTimeout(maxSafetyTimer);
  if (timer) clearTimeout(timer);

  const elapsed = Date.now() - loadStartTime;
  const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

  timer = setTimeout(() => {
    isLoading.value = false;
  }, remaining);
}

onMounted(() => {
  nuxtApp.hook("page:start", startLoading);
  nuxtApp.hook("page:finish", stopLoading);
  nuxtApp.hook("app:error", stopLoading);

  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      startLoading();
    }
  });

  router.afterEach(() => {
    stopLoading();
  });
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
  if (maxSafetyTimer) clearTimeout(maxSafetyTimer);
});
</script>

<template>
  <Transition name="fade-overlay">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/75 backdrop-blur-xs transition-opacity duration-150 pointer-events-none select-none"
    >
      <!-- Circular Ring Spinner chuẩn mẫu ảnh Median UI -->
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-primary/25 border-t-primary shadow-md"
      ></div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.18s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>
