<script setup lang="ts">
import type { GeneralSettings } from "~/types/settings";

defineProps<{
  general: GeneralSettings;
}>();
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div class="grid gap-5 sm:grid-cols-2">
      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">VI</span>
          <span>Tiêu đề Website (Tiếng Việt)</span>
        </label>
        <input
          v-model="general.title.vi"
          type="text"
          class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 text-[10px] font-bold">EN</span>
          <span>Website Title (English)</span>
        </label>
        <input
          v-model="general.title.en"
          type="text"
          class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
        />
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">VI</span>
          <span>Khẩu hiệu / Tagline (Tiếng Việt)</span>
        </label>
        <input
          v-model="general.tagline.vi"
          type="text"
          class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 text-[10px] font-bold">EN</span>
          <span>Tagline (English)</span>
        </label>
        <input
          v-model="general.tagline.en"
          type="text"
          class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
        />
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">VI</span>
          <span>Mô tả SEO (Tiếng Việt)</span>
        </label>
        <textarea
          v-model="general.description.vi"
          rows="3"
          class="w-full rounded-lg border border-border-main bg-bg-base p-3 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary shadow-2xs transition-colors"
        ></textarea>
      </div>

      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 text-[10px] font-bold">EN</span>
          <span>SEO Description (English)</span>
        </label>
        <textarea
          v-model="general.description.en"
          rows="3"
          class="w-full rounded-lg border border-border-main bg-bg-base p-3 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary shadow-2xs transition-colors"
        ></textarea>
      </div>
    </div>

    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-text-main">
        URL Trang Web (Canonical Site URL)
      </label>
      <input
        v-model="general.siteUrl"
        type="url"
        class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary shadow-2xs transition-colors"
      />
    </div>
  </div>
</template>
