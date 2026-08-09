<script setup lang="ts">
import AppIcon from "~/components/ui/icon/AppIcon.vue";

defineProps<{
  statusCode?: number | string;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "back"): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 lg:gap-8 w-full py-8 px-4">
    <div class="text-[3.5rem] sm:text-[6rem] lg:text-[8.5rem] font-black tracking-tight leading-none text-primary select-none">
      {{ statusCode || 404 }}
    </div>

    <div class="flex flex-col items-center gap-1.5 sm:gap-2.5">
      <h1 class="text-lg sm:text-2xl lg:text-3xl font-bold text-text-main tracking-tight">
        {{ title || "Page Not Found" }}
      </h1>
      <p class="text-xs sm:text-sm text-text-alt leading-relaxed max-w-md">
        {{ message || "Bài viết hoặc trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn không hợp lệ." }}
      </p>
    </div>

    <div class="flex flex-row items-center justify-center gap-2.5 w-full sm:w-auto max-w-xs sm:max-w-none">
      <button
        v-if="$attrs.onBack || showHomeButton === false"
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 min-h-10.5 text-xs sm:text-sm font-semibold cursor-pointer transition-colors duration-150 w-full sm:w-auto border border-primary bg-primary text-white shadow-md hover:bg-primary-hover"
        @click="emit('back')"
      >
        <AppIcon name="arrow-left" :size="16" />
        <span>Quay lại</span>
      </button>

      <NuxtLink
        v-else
        to="/"
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 min-h-10.5 text-xs sm:text-sm font-semibold cursor-pointer transition-colors duration-150 w-full sm:w-auto border border-primary bg-primary text-white shadow-md hover:bg-primary-hover"
      >
        <AppIcon name="arrow-left" :size="16" />
        <span>Trở về Trang chủ</span>
      </NuxtLink>

      <NuxtLink
        to="/contact"
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 min-h-10.5 text-xs sm:text-sm font-semibold cursor-pointer transition-colors duration-150 w-full sm:w-auto border border-border-main bg-bg-alt/80 text-text-main hover:border-primary hover:text-primary shadow-2xs"
      >
        <AppIcon name="mail" :size="16" />
        <span>Liên hệ hỗ trợ</span>
      </NuxtLink>
    </div>

  </div>
</template>
