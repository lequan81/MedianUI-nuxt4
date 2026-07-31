<script setup lang="ts">
import { computed, ref } from "vue";
import { joinURL, withLeadingSlash, withTrailingSlash } from "ufo";
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
    const base = withLeadingSlash(
      withTrailingSlash(useRuntimeConfig().app.baseURL),
    );
    if (base !== "/" && !props.src.startsWith(base)) {
      return joinURL(base, props.src);
    }
  }

  return props.src || "";
});

const aspectStyle = computed(() => {
  const width = Number(props.width || 0);
  const height = Number(props.height || 0);

  if (width > 0 && height > 0) {
    return { aspectRatio: `${width} / ${height}` };
  }

  return { aspectRatio: "16 / 9" };
});
</script>

<template>
  <figure
    class="my-6 overflow-hidden rounded-xl border border-border-main bg-bg-sec shadow-sm"
  >
    <div class="relative w-full overflow-hidden" :style="aspectStyle">
      <div
        v-if="!isLoaded"
        class="absolute inset-0 animate-pulse bg-bg-alt"
      ></div>
      <img
        :src="refinedSrc"
        :alt="props.alt || ''"
        :width="props.width"
        :height="props.height"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        decoding="async"
        @load="isLoaded = true"
      />
    </div>
  </figure>
</template>
