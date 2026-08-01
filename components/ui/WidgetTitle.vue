<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="mb-3.5">
    <h3
      class="flex items-center gap-2 text-xs font-semibold tracking-wider text-text-main"
    >
      <span class="whitespace-nowrap">{{ title }}</span>
      <span class="h-px flex-1 bg-border-subtle"></span>
    </h3>
  </div>
</template>
