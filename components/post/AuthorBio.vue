<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

const props = defineProps<{
  author: {
    name: string;
    avatar: string;
    handle?: string;
    bio?: string;
    socials?: Array<{
      label?: string;
      name?: string;
      icon?: any;
      href: string;
    }>;
  };
}>();

const formattedBioParts = computed(() => {
  if (!props.author?.bio) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: Array<{ text: string; isUrl: boolean; url?: string }> = [];
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(props.author.bio)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: props.author.bio.slice(lastIndex, match.index),
        isUrl: false,
      });
    }
    parts.push({ text: match[0], url: match[0], isUrl: true });
    lastIndex = urlRegex.lastIndex;
  }
  if (lastIndex < props.author.bio.length) {
    parts.push({ text: props.author.bio.slice(lastIndex), isUrl: false });
  }
  return parts;
});
</script>

<template>
  <!-- Standalone Author Bio Card: Tối ưu nhỏ gọn, tinh tế trên Mobile & Desktop -->
  <section
    class="group/bio w-full sm:w-fit max-w-full rounded-xl border border-border-main bg-bg-alt/60 p-3 sm:p-4 transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt shadow-2xs">
    <div class="flex items-start sm:items-center gap-3">
      <!-- Avatar Viền Ring CSS Tròn Tuyệt Đối -->
      <div
        class="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-base ring-2 ring-primary/20 shadow-xs transition-all duration-300 group-hover/bio:ring-primary group-hover/bio:scale-105">
        <NuxtImg v-if="author.avatar" :src="author.avatar" :alt="author.name" class="h-full w-full object-cover" loading="lazy" format="webp" />
        <AppIcon v-else name="user" :size="18" class="text-text-alt" />
      </div>

      <div class="min-w-0 flex-1 space-y-1">
        <!-- Tên Tác Giả & Handle @id Nằm Kế Bên Nhau Trên Cùng 1 Dòng -->
        <div class="flex flex-wrap items-center gap-1.5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-text-main group-hover/bio:text-primary transition-colors">
            {{ author.name }}
          </h2>
          <span v-if="author.handle" class="text-[11px] font-semibold text-primary">
            {{ author.handle }}
          </span>
        </div>

        <p v-if="author.bio" class="text-[11.5px] sm:text-xs leading-relaxed text-text-alt">
          <template v-for="(part, i) in formattedBioParts" :key="i">
            <a v-if="part.isUrl" :href="part.url" target="_blank" rel="noreferrer"
              class="font-medium text-primary hover:underline">
              {{ part.text }}
            </a>
            <span v-else>{{ part.text }}</span>
          </template>
        </p>

        <div v-if="author.socials?.length" class="pt-0.5 flex flex-wrap items-center gap-1.5">
          <a v-for="social in author.socials" :key="social.href" :href="social.href" target="_blank"
            rel="noreferrer"
            :title="social.name || social.label"
            class="inline-flex items-center gap-1 rounded-md border border-border-main bg-bg-sec px-2 py-1 text-[10.5px] font-medium text-text-main transition-all hover:border-primary hover:text-primary hover:bg-primary-subtle/40 active:scale-95 cursor-pointer select-none">
            <AppIcon :name="social.icon || 'external-link'" :size="12" />
            <span class="hidden sm:inline">{{ social.name || social.label || "Liên hệ" }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
