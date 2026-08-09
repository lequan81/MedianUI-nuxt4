<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import AppTooltip from "~/components/ui/tooltip/AppTooltip.vue";
import { useAuthor } from "~/composables/useAuthor";

const props = withDefaults(
  defineProps<{
    author?: any;
    size?: "sm" | "md";
  }>(),
  {
    size: "md",
  }
);

const authorData = computed(() => {
  return useAuthor(props.author);
});
</script>

<template>
  <AppTooltip content-class="w-64 p-3.5 text-left">
    <template #trigger="{ isVisible }">
      <slot v-bind="{ author: authorData || {}, isVisible: isVisible || false }">
        <div class="flex items-center gap-2 cursor-pointer group/badge">
          <NuxtImg
            :src="authorData.avatar"
            :alt="authorData.name"
            :class="[
              'rounded-full object-cover ring-2 ring-primary/20 shadow-xs transition-all duration-300 group-hover/badge:ring-primary group-hover/badge:scale-105 hover:ring-primary hover:scale-105',
              size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
            ]"
            loading="lazy" />
          <span class="font-semibold uppercase tracking-wider text-text-main group-hover/badge:text-primary transition-colors">
            {{ authorData.name }}
          </span>
        </div>
      </slot>
    </template>

    <!-- Header Info Inside Tooltip Popover -->
    <div class="flex items-center gap-2.5">
      <NuxtImg
        :src="authorData.avatar"
        :alt="authorData.name"
        class="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20 shadow-xs transition-all duration-300 hover:ring-primary hover:scale-105 cursor-pointer"
        loading="lazy" />
      <div class="min-w-0 flex-1">
        <h4 class="font-bold text-sm text-text-main truncate leading-tight">
          {{ authorData.name }}
        </h4>
        <p class="text-xs text-primary font-semibold mt-0.5">
          {{ authorData.handle }}
        </p>
      </div>
    </div>

    <!-- Clean Bio Line -->
    <p v-if="authorData.bio" class="mt-2.5 text-xs leading-relaxed text-text-alt">
      {{ authorData.bio }}
    </p>

    <!-- Social Icons Row -->
    <div v-if="authorData.socials?.length" class="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-end">
      <div class="flex items-center gap-1.5">
        <a
          v-for="social in authorData.socials"
          :key="social.href || social.name"
          :href="social.href"
          target="_blank"
          rel="noreferrer"
          :title="social.name"
          class="flex h-7 w-7 items-center justify-center rounded-lg border border-border-main bg-bg-sec text-text-alt transition-colors hover:border-primary hover:text-primary hover:bg-bg-base"
        >
          <AppIcon :name="social.icon || 'globe'" :size="14" />
        </a>
      </div>
    </div>
  </AppTooltip>
</template>

<style scoped>
/* Tooltip styles handled by AppTooltip */
</style>

