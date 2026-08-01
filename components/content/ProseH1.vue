<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h1
    :id="id"
    class="mt-16 pt-10 pb-4 mb-3 text-3xl font-bold leading-snug text-text-main scroll-mt-[calc(var(--header-height)+24px)]"
  >
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
