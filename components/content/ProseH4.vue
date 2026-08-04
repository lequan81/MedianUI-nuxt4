<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h4
    :id="id"
    class="mt-5 pt-1 mb-2 text-sm sm:text-base md:text-lg font-semibold leading-snug tracking-tight text-text-main scroll-mt-[calc(var(--header-height)+24px)]"
  >
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline"><slot /></a>
    <slot v-else />
  </h4>
</template>
