<script setup lang="ts">
import type { AnnouncementSettings } from "~/types/settings";

defineProps<{
  announcement: AnnouncementSettings;
}>();
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex items-center gap-3">
      <input
        id="ann-toggle"
        v-model="announcement.enabled"
        type="checkbox"
        class="h-4 w-4 rounded border-border-main text-primary focus:ring-primary cursor-pointer"
      />
      <label for="ann-toggle" class="text-xs font-bold text-text-main cursor-pointer select-none">
        Bật thanh thông báo nổi ở đầu trang (Notification Header Bar)
      </label>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">VI</span>
          <span>Nhãn Badge (Tiếng Việt)</span>
        </label>
        <input
          v-model="announcement.badge.vi"
          type="text"
          placeholder="Mới"
          class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main outline-none focus:border-primary shadow-2xs"
        />
      </div>

      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 text-[10px] font-bold">EN</span>
          <span>Badge (English)</span>
        </label>
        <input
          v-model="announcement.badge.en"
          type="text"
          placeholder="New"
          class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main outline-none focus:border-primary shadow-2xs"
        />
      </div>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">VI</span>
          <span>Nội dung thông báo (Tiếng Việt)</span>
        </label>
        <textarea
          v-model="announcement.text.vi"
          rows="2"
          class="w-full rounded-lg border border-border-main bg-bg-base p-3 text-xs text-text-main outline-none focus:border-primary shadow-2xs"
        ></textarea>
      </div>

      <div class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
          <span class="rounded bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 text-[10px] font-bold">EN</span>
          <span>Announcement Message (English)</span>
        </label>
        <textarea
          v-model="announcement.text.en"
          rows="2"
          class="w-full rounded-lg border border-border-main bg-bg-base p-3 text-xs text-text-main outline-none focus:border-primary shadow-2xs"
        ></textarea>
      </div>
    </div>

    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-text-main">
        Đường dẫn liên kết (Link)
      </label>
      <input
        v-model="announcement.link"
        type="text"
        placeholder="/blog/median-ui-blogger-template"
        class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main outline-none focus:border-primary shadow-2xs"
      />
    </div>
  </div>
</template>
