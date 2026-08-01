<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

const props = defineProps<{
  author: {
    name: string;
    avatar: string;
    bio?: string;
    socials?: Array<{
      label: string;
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
  <section
    class="w-fit max-w-full rounded-xl border border-border-main/70 bg-bg-sec/50 px-4 py-3 transition-colors hover:border-border-main">
    <div class="flex items-center gap-3">
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-base ring-1 ring-border-main/80 shadow-2xs">
        <img v-if="author.avatar" :src="author.avatar" :alt="author.name" class="h-full w-full object-cover"
          loading="lazy" />
        <AppIcon v-else name="user" :size="18" class="text-text-alt" />
      </div>

      <div class="min-w-0">
        <h2 class="text-xs font-bold uppercase tracking-wider text-text-main">
          {{ author.name }}
        </h2>
        <p v-if="author.bio" class="mt-0.5 text-xs leading-relaxed text-text-alt">
          <template v-for="(part, i) in formattedBioParts" :key="i">
            <a v-if="part.isUrl" :href="part.url" target="_blank" rel="noreferrer"
              class="font-medium text-primary hover:underline">
              {{ part.text }}
            </a>
            <span v-else>{{ part.text }}</span>
          </template>
        </p>

        <div v-if="author.socials?.length" class="pt-1.5 flex flex-wrap gap-2">
          <a v-for="social in author.socials" :key="social.href" :href="social.href" target="_blank" rel="noreferrer"
            class="inline-flex items-center gap-1.5 rounded-md border border-border-main bg-bg-base px-2 py-0.5 text-[11px] font-medium text-text-main transition-colors hover:border-primary hover:text-primary">
            <AppIcon name="external-link" :size="11" />
            <span>{{ social.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
