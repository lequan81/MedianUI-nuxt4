<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h1 :id="id" class="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-text-main my-5 scroll-mt-22">
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline hover:text-primary transition-colors">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
