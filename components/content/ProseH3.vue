<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h3 :id="id" class="mt-6 mb-2.5 sm:mt-7 sm:mb-3 text-base sm:text-lg font-semibold leading-snug tracking-tight text-text-main scroll-mt-22">
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline hover:text-primary transition-colors">
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
