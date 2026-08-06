<script setup lang="ts">
defineProps<{
  href?: string;
  target?: string;
}>();
</script>

<template>
  <NuxtLink
    :to="href"
    :target="target"
    class="text-primary underline underline-offset-4 transition-colors hover:opacity-85 wrap-break-word"
  ><slot /></NuxtLink>
</template>
