<script setup lang="ts">
import AppIcon from "~/components/ui/icon/AppIcon.vue";

defineProps<{
  icon?: string;
  title?: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
}>();

const emit = defineEmits<{
  (e: "action"): void;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-main bg-bg-alt/40 p-8 text-center shadow-2xs space-y-3"
  >
    <div
      v-if="icon"
      class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
    >
      <AppIcon :name="icon" :size="24" />
    </div>

    <div class="space-y-1">
      <h3 v-if="title" class="text-sm font-bold text-text-main">
        {{ title }}
      </h3>
      <p class="text-xs text-text-muted max-w-sm leading-relaxed">
        {{ message }}
      </p>
    </div>

    <template v-if="actionLabel">
      <NuxtLink
        v-if="actionTo"
        :to="actionTo"
        class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-2xs cursor-pointer"
      >
        {{ actionLabel }}
      </NuxtLink>
      <button
        v-else
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-3.5 py-1.5 text-xs font-semibold text-text-main hover:border-primary hover:text-primary transition-colors shadow-2xs cursor-pointer"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </button>
    </template>
  </div>
</template>
