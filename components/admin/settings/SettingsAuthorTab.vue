<script setup lang="ts">
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import type { AuthorSettings, SocialLinkItem } from "~/types/settings";

const props = defineProps<{
  author: AuthorSettings;
  socialList: SocialLinkItem[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
}>();

const emit = defineEmits<{
  (e: "addSocial", preset?: { name: string; icon: string; placeholder: string }): void;
  (e: "removeSocial", index: number): void;
  (e: "moveSocialUp", index: number): void;
  (e: "moveSocialDown", index: number): void;
  (e: "dragStart", index: number, event: DragEvent): void;
  (e: "dragOver", index: number, event: DragEvent): void;
  (e: "drop", index: number, event: DragEvent): void;
  (e: "dragEnd"): void;
}>();

const socialPresets = [
  { name: "GitHub", icon: "github", placeholder: "https://github.com/username" },
  { name: "Facebook", icon: "facebook", placeholder: "https://facebook.com/username" },
  { name: "Twitter / X", icon: "twitter", placeholder: "https://twitter.com/username" },
  { name: "LinkedIn", icon: "linkedin", placeholder: "https://linkedin.com/in/username" },
  { name: "YouTube", icon: "youtube", placeholder: "https://youtube.com/@channel" },
  { name: "Instagram", icon: "instagram", placeholder: "https://instagram.com/username" },
  { name: "Telegram", icon: "send", placeholder: "https://t.me/username" },
  { name: "Discord", icon: "message-circle", placeholder: "https://discord.gg/invite" },
  { name: "TikTok", icon: "video", placeholder: "https://tiktok.com/@username" },
  { name: "Email", icon: "mail", placeholder: "mailto:contact@domain.com" },
  { name: "Website", icon: "globe", placeholder: "https://mywebsite.com" },
];
</script>

<template>
  <div class="space-y-7 max-w-4xl">
    <!-- Basic Author Profile -->
    <div class="space-y-5">
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-text-main">Tên Tác Giả</label>
          <input
            v-model="author.name"
            type="text"
            class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-text-main">Avatar URL</label>
          <input
            v-model="author.avatar"
            type="url"
            placeholder="https://github.com/username.png"
            class="w-full rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div class="space-y-1.5">
          <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
            <span class="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">VI</span>
            <span>Tiểu sử / Bio (Tiếng Việt)</span>
          </label>
          <textarea
            v-model="author.bio.vi"
            rows="3"
            class="w-full rounded-lg border border-border-main bg-bg-base p-3 text-xs text-text-main outline-none focus:border-primary shadow-2xs"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="flex items-center gap-1.5 text-xs font-semibold text-text-main">
            <span class="rounded bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 text-[10px] font-bold">EN</span>
            <span>Author Bio (English)</span>
          </label>
          <textarea
            v-model="author.bio.en"
            rows="3"
            class="w-full rounded-lg border border-border-main bg-bg-base p-3 text-xs text-text-main outline-none focus:border-primary shadow-2xs"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Dynamic Reorderable Social Links Section -->
    <div class="border-t border-border-subtle pt-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-text-main flex items-center gap-2">
            <span>Quản lý Liên kết Mạng xã hội</span>
            <span class="rounded-full bg-primary/10 text-primary px-2 py-0.2 text-[11px] font-bold">
              {{ socialList.length }} mục
            </span>
          </h3>
          <p class="text-xs text-text-muted">
            Tự do thêm bớt, kéo thả hoặc dùng mũi tên để chọn icon nào hiển thị trước trên Header, Footer và Hồ sơ tác giả.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-xs"
          @click="emit('addSocial')"
        >
          <AppIcon name="plus" :size="13" />
          <span>Thêm MXH tùy chỉnh</span>
        </button>
      </div>

      <!-- Preset Quick-Add Buttons -->
      <div class="flex flex-wrap items-center gap-1.5 pt-1">
        <span class="text-[11px] font-semibold text-text-muted mr-1">Thêm nhanh:</span>
        <button
          v-for="preset in socialPresets"
          :key="preset.name"
          type="button"
          class="inline-flex items-center gap-1 rounded-md border border-border-main bg-bg-sec px-2 py-1 text-[11px] font-medium text-text-alt hover:border-primary hover:text-primary hover:bg-bg-alt transition-colors cursor-pointer"
          @click="emit('addSocial', preset)"
        >
          <AppIcon :name="preset.icon" :size="12" />
          <span>{{ preset.name }}</span>
        </button>
      </div>

      <!-- Social Links List -->
      <div class="space-y-2.5 pt-2">
        <div
          v-for="(item, index) in socialList"
          :key="item.id"
          draggable="true"
          :class="[
            'group flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border p-3 transition-all shadow-xs select-none',
            draggedIndex === index
              ? 'opacity-40 border-dashed border-primary bg-primary/5'
              : dragOverIndex === index
              ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
              : 'border-border-main bg-bg-sec hover:border-primary/50 hover:bg-bg-alt',
          ]"
          @dragstart="emit('dragStart', index, $event)"
          @dragover="emit('dragOver', index, $event)"
          @drop="emit('drop', index, $event)"
          @dragend="emit('dragEnd')"
        >
          <!-- Controls & Handle -->
          <div class="flex items-center gap-2 shrink-0">
            <div class="cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-primary transition-colors">
              <AppIcon name="grid" :size="15" />
            </div>

            <div class="flex flex-col gap-0.5">
              <button
                type="button"
                :disabled="index === 0"
                class="p-0.5 text-text-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                @click="emit('moveSocialUp', index)"
              >
                <AppIcon name="arrow-up" :size="11" />
              </button>
              <button
                type="button"
                :disabled="index === socialList.length - 1"
                class="p-0.5 text-text-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                @click="emit('moveSocialDown', index)"
              >
                <AppIcon name="chevron-down" :size="11" />
              </button>
            </div>

            <span class="text-xs font-mono font-bold text-text-muted w-4 text-center">
              #{{ index + 1 }}
            </span>
          </div>

          <!-- Form Fields -->
          <div class="grid flex-1 gap-2 sm:grid-cols-12 items-center">
            <!-- Name (3 cols) -->
            <div class="sm:col-span-3">
              <input
                v-model="item.name"
                type="text"
                placeholder="Tên MXH"
                class="w-full rounded-md border border-border-main bg-bg-base px-2.5 py-1.5 text-xs text-text-main outline-none focus:border-primary shadow-2xs font-semibold"
              />
            </div>

            <!-- Icon Input with Preview (3 cols) -->
            <div class="sm:col-span-3">
              <div class="relative flex items-center">
                <div class="absolute left-2 flex h-4 w-4 items-center justify-center text-primary pointer-events-none">
                  <AppIcon :name="item.icon || 'globe'" :size="13" />
                </div>
                <input
                  v-model="item.icon"
                  type="text"
                  placeholder="icon (lucide)"
                  class="w-full rounded-md border border-border-main bg-bg-base pl-7 pr-2.5 py-1.5 text-xs text-text-main outline-none focus:border-primary shadow-2xs font-mono"
                />
              </div>
            </div>

            <!-- URL (6 cols) -->
            <div class="sm:col-span-6">
              <input
                v-model="item.href"
                type="url"
                placeholder="https://..."
                class="w-full rounded-md border border-border-main bg-bg-base px-2.5 py-1.5 text-xs text-text-main outline-none focus:border-primary shadow-2xs font-mono"
              />
            </div>
          </div>

          <!-- Delete Button -->
          <button
            type="button"
            class="shrink-0 p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="Xóa mạng xã hội này"
            @click="emit('removeSocial', index)"
          >
            <AppIcon name="trash-2" :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
