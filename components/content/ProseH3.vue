<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h3
    :id="id"
    class="mt-7 pt-1 mb-3 text-xl md:text-[1.3rem] font-semibold leading-snug text-text-main scroll-mt-[calc(var(--header-height)+24px)]"
  >
    <a v-if="id" :href="`#${id}`" class="text-inherit no-underline">
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
