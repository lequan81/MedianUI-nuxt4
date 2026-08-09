<script setup lang="ts">
import { footerLinks, siteConfig } from "~/app/config/site";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

function scrollToTop() {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

</script>

<template>
  <footer class="relative mt-auto bg-bg-base text-xs text-text-alt">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-3 border-t border-border-main px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span class="truncate text-text-muted text-xs font-normal">&copy; {{ siteConfig.copyright }}</span>

      <nav class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-text-muted">
        <template v-for="(link, index) in footerLinks" :key="link.label">
          <NuxtLink v-if="link.to" :to="link.to" class="transition-colors hover:text-primary px-0.5 py-0.5">
            {{ link.label }}
          </NuxtLink>
          <a v-else :href="link.href" class="transition-colors hover:text-primary px-0.5 py-0.5" target="_blank"
            rel="noreferrer">
            {{ link.label }}
          </a>
          <span v-if="index < footerLinks.length - 1" class="text-border-main select-none">/</span>
        </template>

        <!-- Top Button — desktop only with smooth scroll -->
        <button type="button" @click="scrollToTop"
          class="ml-2.5 hidden lg:inline-flex items-center gap-1.5 rounded-full border border-border-main px-3 py-0.5 text-xs transition-colors hover:border-primary hover:text-primary cursor-pointer"
          aria-label="Về đầu trang" title="Về đầu trang">
          Top
          <AppIcon name="arrow-up" :size="12" />
        </button>
      </nav>
    </div>
  </footer>
</template>
