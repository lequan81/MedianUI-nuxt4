<script setup lang="ts">
import { useNuxtApp } from "#imports";
import { ref } from "vue";

const isLoading = ref(false);
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:start", () => {
  isLoading.value = true;
});

nuxtApp.hook("page:finish", () => {
  isLoading.value = false;
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading"
      class="fixed inset-0 z-100 flex items-center justify-center bg-bg-base/60 backdrop-blur-xs pointer-events-auto"
    >
      <div
        class="flex flex-col items-center gap-3 rounded-2xl border border-border-main bg-bg-base p-5 shadow-xl"
      >
        <div
          class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        ></div>
        <span class="text-xs font-semibold text-text-main">Đang tải trang...</span>
      </div>
    </div>
  </Transition>
</template>
