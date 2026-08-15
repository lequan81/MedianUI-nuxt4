<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h4 :id="id" class="mt-4 mb-2 text-sm sm:text-base font-semibold leading-snug tracking-tight text-text-main scroll-mt-22">
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline hover:text-primary transition-colors">
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>
