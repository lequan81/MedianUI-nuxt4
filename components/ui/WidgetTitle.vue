<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="border-b border-border-main/70 pb-3">
    <h3
      class="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-main"
    >
      <span class="whitespace-nowrap">{{ title }}</span>
      <span class="h-px flex-1 bg-border-main/80"></span>
    </h3>
  </div>
</template>
