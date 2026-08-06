<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

const isVisible = ref(false);

function handleScroll() {
  if (typeof window !== "undefined") {
    isVisible.value = window.scrollY > 400;
  }
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-if="isVisible"
      type="button"
      class="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-main bg-bg-base/95 text-text-main shadow-lg backdrop-blur-md transition-all duration-200 hover:border-primary hover:text-primary hover:scale-105 active:scale-95"
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
      @click="scrollToTop"
    >
      <AppIcon name="arrow-up" :size="18" />
    </button>
  </Transition>
</template>
