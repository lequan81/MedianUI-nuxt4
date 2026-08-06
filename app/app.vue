<script setup lang="ts">
import { useHead } from "#imports";

useHead({
  htmlAttrs: {
    class: "scroll-smooth overflow-x-hidden antialiased bg-bg-base text-text-main font-sans",
  },
  bodyAttrs: {
    class: "m-0 text-text-main bg-bg-base font-sans antialiased",
  },
});
</script>

<template>
  <GlobalLoading />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
