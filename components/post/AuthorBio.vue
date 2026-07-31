<script setup lang="ts">
import AppIcon from "~/components/ui/AppIcon.vue";

defineProps<{
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
</script>

<template>
  <section
    class="mt-10 rounded-xl border border-border-main bg-bg-sec/70 p-4 sm:p-5"
  >
    <div class="flex gap-4">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-base ring-1 ring-border-main"
      >
        <img
          v-if="author.avatar"
          :src="author.avatar"
          :alt="author.name"
          class="h-full w-full object-cover"
          loading="lazy"
        />
        <AppIcon v-else name="user" :size="20" class="text-text-alt" />
      </div>

      <div class="min-w-0 flex-1">
        <p class="text-xs uppercase tracking-[0.18em] text-text-alt">
          About the author
        </p>
        <h2 class="mt-1 text-base font-semibold text-text-main">
          {{ author.name }}
        </h2>
        <p v-if="author.bio" class="mt-2 text-sm leading-7 text-text-alt">
          {{ author.bio }}
        </p>

        <div v-if="author.socials?.length" class="mt-4 flex flex-wrap gap-2">
          <a
            v-for="social in author.socials"
            :key="social.href"
            :href="social.href"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-base px-3 py-2 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
          >
            <AppIcon name="external-link" :size="13" />
            <span>{{ social.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
