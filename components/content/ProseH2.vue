<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h2
    :id="id"
    class="mt-8 pt-2 mb-4 text-2xl md:text-[1.7rem] font-semibold leading-snug text-text-main scroll-mt-[calc(var(--header-height)+24px)]"
  >
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline">
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
