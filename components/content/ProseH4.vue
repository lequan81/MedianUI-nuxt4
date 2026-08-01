<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h4
    :id="id"
    class="mt-6 pt-1 mb-2.5 text-lg md:text-xl font-medium leading-snug text-text-main scroll-mt-[calc(var(--header-height)+24px)]"
  >
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline">
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>
