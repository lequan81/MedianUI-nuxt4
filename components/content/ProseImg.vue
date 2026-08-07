<script setup lang="ts">
import { computed, ref } from "vue";
import { useRuntimeConfig } from "#imports";

const props = defineProps<{
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}>();

const isLoaded = ref(false);

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
  <figure class="my-10 flex flex-col items-center justify-center w-full">
    <div
      class="mx-auto w-full max-w-[80%] sm:max-w-[78%] overflow-hidden rounded-xl border border-border-main bg-bg-sec/40 shadow-xs"
    >
      <div
        v-if="!isLoaded"
        class="h-48 w-full animate-pulse bg-bg-sec"
      ></div>
      <NuxtImg
        :src="refinedSrc"
        :alt="props.alt || ''"
        class="h-auto w-full max-w-full rounded-xl object-contain transition-opacity duration-300 block mx-auto"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        decoding="async"
        @load="isLoaded = true"
      />
    </div>
    <figcaption
      v-if="props.alt"
      class="mt-2.5 max-w-[78%] text-center text-xs sm:text-[13px] text-text-alt/85 font-medium leading-normal"
    >
      {{ props.alt }}
    </figcaption>
  </figure>
</template>
