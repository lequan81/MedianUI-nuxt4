<script setup lang="ts">
import { footerLinks, siteConfig } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";

function scrollToTop(e: MouseEvent) {
  e.preventDefault();
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
</script>

<template>
  <footer class="relative mt-auto bg-bg-base text-[13px] text-text-alt">
    <div
      class="mx-auto flex max-w-(--content-max-width) flex-col gap-5 border-t border-border-main px-(--content-padding) py-2 sm:flex-row sm:items-center sm:justify-between">
      <span class="truncate">&copy; {{ siteConfig.copyright }}</span>

      <nav class="flex flex-wrap items-center gap-2 px-3 py-2">
        <template v-for="(link, index) in footerLinks" :key="link.label">
          <NuxtLink v-if="link.to" :to="link.to" class="transition-colors hover:text-primary">
            {{ link.label }}
          </NuxtLink>
          <a v-else :href="link.href" class="transition-colors hover:text-primary" target="_blank" rel="noreferrer">
            {{ link.label }}
          </a>
          <span v-if="index < footerLinks.length - 1" class="px-1 text-border-main">/</span>
        </template>

        <a href="#top"
          class="ml-2 inline-flex items-center gap-1 rounded-full border border-border-main px-3 py-1 transition-colors hover:border-primary hover:text-primary cursor-pointer"
          @click="scrollToTop">
          Top
          <AppIcon name="arrow-up" :size="14" />
        </a>
      </nav>
    </div>
  </footer>
</template>
