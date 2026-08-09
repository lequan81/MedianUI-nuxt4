<script setup lang="ts">
import type { BreadcrumbItem } from "~/types/navigation";

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>


<template>
  <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs font-medium text-text-alt mb-4">
    <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">
      Trang chủ
    </NuxtLink>
    <template v-for="(item, index) in items" :key="index">
      <span class="text-text-muted select-none">/</span>
      <NuxtLink
        v-if="item.to && index < items.length - 1"
        :to="item.to"
        class="shrink-0 text-text-muted transition-colors hover:text-primary"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="truncate font-semibold text-text-main">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
