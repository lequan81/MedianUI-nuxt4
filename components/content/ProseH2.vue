<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h2 :id="id" class="mt-8 mb-3 sm:mt-9 sm:mb-3.5 text-lg sm:text-xl font-bold leading-snug tracking-tight text-text-main scroll-mt-22">
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline hover:text-primary transition-colors">
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
