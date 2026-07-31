<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

const props = defineProps<{
  code?: string;
  language?: string | null;
  filename?: string | null;
  highlights?: number[];
  meta?: string | null;
  class?: string | null;
}>();

const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | null = null;

const languageLabel = computed(() => {
  if (!props.language) return "Code";
  return props.language.toUpperCase();
});

const filenameLabel = computed(() => props.filename || props.meta || "");

function copyCode() {
  const value = props.code || "";
  if (!value) return;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).then(() => {
      copied.value = true;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copied.value = false;
      }, 2000);
    });
  }
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer);
});
</script>

<template>
  <figure
    class="overflow-hidden rounded-xl border border-border-main bg-bg-base"
  >
    <figcaption
      class="flex items-center gap-3 border-b border-border-main bg-bg-sec px-4 py-3 text-xs text-text-alt"
    >
      <span
        class="inline-flex items-center rounded-md border border-border-main bg-bg-base px-2 py-1 font-semibold tracking-[0.12em] text-text-main"
      >
        {{ languageLabel }}
      </span>
      <span
        v-if="filenameLabel"
        class="min-w-0 flex-1 truncate font-medium text-text-main"
      >
        {{ filenameLabel }}
      </span>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border border-border-main bg-bg-base px-2.5 py-1.5 font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
        @click="copyCode"
      >
        <span>{{ copied ? "Copied" : "Copy" }}</span>
      </button>
    </figcaption>

    <pre
      :class="[
        'overflow-x-auto p-4 font-code text-[13.5px] leading-7 text-text-main',
        props.class,
      ]"
    >
      <slot />
    </pre>
  </figure>
</template>
