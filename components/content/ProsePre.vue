<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

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
  if (!props.language) return "CODE";
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
  <figure class="my-6 overflow-hidden rounded-xl border border-border-main bg-bg-sec/90 shadow-sm">
    <figcaption class="flex items-center justify-between border-b border-border-subtle bg-bg-base/80 px-4 py-2 text-xs">
      <div class="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        <span class="rounded bg-primary-subtle px-2 py-0.5 text-primary">{{ languageLabel }}</span>
        <span v-if="filenameLabel" class="normal-case text-text-alt">{{ filenameLabel }}</span>
      </div>

      <button type="button" :class="[
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer',
        copied
          ? 'bg-emerald-500/10 text-emerald-500 font-bold'
          : 'text-text-alt hover:bg-bg-sec hover:text-primary'
      ]" :title="copied ? 'Đã sao chép!' : 'Sao chép đoạn mã'" @click="copyCode">
        <AppIcon :name="copied ? 'check' : 'copy'" :size="13" />
        <span>{{ copied ? "Copied!" : "Copy" }}</span>
      </button>
    </figcaption>

    <pre :class="[
      'overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-text-main',
      props.class,
    ]">
      <slot />
    </pre>
  </figure>
</template>
