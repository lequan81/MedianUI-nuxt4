<script setup lang="ts">
import { computed } from "vue";
import { useAutoReset } from "~/composables/useTimeout";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

const props = defineProps<{
  code?: string;
  language?: string | null;
  filename?: string | null;
  highlights?: number[];
  meta?: string | null;
  class?: string | null;
}>();

const { state: copied, trigger: triggerCopied } = useAutoReset(false, false, 2000);

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
      triggerCopied(true);
    });
  }
}
</script>

<template>
  <figure class="my-6 overflow-hidden rounded-xl border border-border-main bg-bg-sec/90 shadow-sm">
    <figcaption class="flex items-center justify-between border-b border-border-subtle bg-bg-base/80 px-4 py-2 text-xs">
      <div class="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        <span class="rounded bg-primary-subtle px-2 py-0.5 text-primary">{{ languageLabel }}</span>
        <span v-if="filenameLabel" class="normal-case text-text-alt">{{ filenameLabel }}</span>
      </div>

      <button
        type="button"
        :class="[
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 select-none group',
          copied
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-bold ring-1 ring-emerald-500/30'
            : 'border-border-main bg-bg-sec text-text-main hover:border-primary/50 hover:bg-bg-subtle hover:text-primary'
        ]"
        :title="copied ? 'Đã sao chép vào bộ nhớ tạm' : 'Sao chép đoạn mã'"
        @click="copyCode"
      >
        <AppIcon
          :name="copied ? 'check' : 'copy'"
          :size="13"
          :class="[
            'transition-transform duration-200',
            copied ? 'text-emerald-500 scale-110' : 'text-text-alt group-hover:text-primary'
          ]"
        />
        <span>{{ copied ? "Đã sao chép" : "Sao chép" }}</span>
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
