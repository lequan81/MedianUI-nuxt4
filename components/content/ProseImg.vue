<script setup lang="ts">
import { computed, ref } from "vue";
import { useRuntimeConfig } from "#imports";

const props = defineProps<{
  src?: string;
  alt?: string;
  width?: string | number;
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
    <div class="mx-auto w-full max-w-[80%] sm:max-w-[78%] overflow-hidden rounded-xl border border-border-main bg-bg-subtle shadow-xs">
      <img
        :src="refinedSrc"
        :alt="alt || ''"
        :width="width"
        class="h-auto w-full object-cover transition-opacity duration-300"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        @load="isLoaded = true"
      />
    </div>
    <figcaption
      v-if="alt"
      class="mt-2.5 text-center text-xs text-text-muted font-medium tracking-wide"
    >
      {{ alt }}
    </figcaption>
  </figure>
</template>
