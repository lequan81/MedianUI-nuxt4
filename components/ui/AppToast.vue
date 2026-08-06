<script setup lang="ts">
import { useToast } from "~/composables/useToast";
import AppIcon from "~/components/ui/AppIcon.vue";

const { toasts, removeToast } = useToast();
</script>

<template>
  <!-- Global Toast Floating Container (Top Right / Bottom Right) -->
  <div
    class="fixed bottom-5 right-4 sm:right-6 z-100 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border border-border-main bg-bg-base p-4 shadow-xl text-text-main transition-all duration-200 select-none"
        :class="[
          toast.type === 'success' ? 'border-l-4 border-l-emerald-500' : '',
          toast.type === 'error' ? 'border-l-4 border-l-rose-500' : '',
          toast.type === 'warning' ? 'border-l-4 border-l-amber-500' : '',
          toast.type === 'info' ? 'border-l-4 border-l-primary' : '',
        ]"
      >
        <!-- Type Icon -->
        <div class="shrink-0 pt-0.5">
          <AppIcon
            v-if="toast.type === 'success'"
            name="check-circle"
            :size="18"
            class="text-emerald-500"
          />
          <AppIcon
            v-else-if="toast.type === 'error'"
            name="x-circle"
            :size="18"
            class="text-rose-500"
          />
          <AppIcon
            v-else-if="toast.type === 'warning'"
            name="alert-triangle"
            :size="18"
            class="text-amber-500"
          />
          <AppIcon
            v-else
            name="info"
            :size="18"
            class="text-primary"
          />
        </div>

        <!-- Toast Body -->
        <div class="min-w-0 flex-1 space-y-0.5">
          <h4
            v-if="toast.title"
            class="text-xs font-bold leading-tight text-text-main"
          >
            {{ toast.title }}
          </h4>
          <p class="text-xs text-text-alt leading-relaxed">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          type="button"
          class="shrink-0 -mr-1 -mt-1 p-1 rounded-lg text-text-muted transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
          aria-label="Đóng thông báo"
          @click="removeToast(toast.id)"
        >
          <AppIcon name="x" :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
