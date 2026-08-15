<script setup lang="ts">
import { computed } from "vue";
import { useRuntimeConfig } from "#imports";

const props = defineProps<{
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}>();

const refinedSrc = computed(() => {
  if (props.src?.startsWith("/") && !props.src.startsWith("//")) {
    const base = useRuntimeConfig().app.baseURL || "/";
    if (base !== "/" && !props.src.startsWith(base)) {
      const cleanBase = base.endsWith("/") ? base : base + "/";
      const cleanSrc = props.src.replace(/^\//, "");
      return cleanBase + cleanSrc;
    }
  }

  return props.src || "";
});
</script>

<template>
  <span class="my-8 flex flex-col items-center justify-center w-full">

    <span
      class="mx-auto w-full max-w-[85%] sm:max-w-[78%] overflow-hidden rounded-xl border border-border-main bg-bg-sec/40 shadow-xs block">
      <NuxtImg :src="refinedSrc" :alt="props.alt || ''"
        class="h-auto w-full max-w-full rounded-xl object-contain block mx-auto"
        loading="eager" decoding="async" format="webp" />
    </span>
    <span v-if="props.alt"
      class="mt-2.5 max-w-[78%] text-center text-xs sm:text-[13px] text-text-alt/85 font-medium leading-normal block">
      {{ props.alt }}
    </span>
  </span>
</template>
