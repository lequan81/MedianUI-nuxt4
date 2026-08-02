<script setup lang="ts">
import { computed } from "vue";
import { useSeoMeta } from "#imports";
import TableOfContents from "~/components/post/TableOfContents.vue";

const { data: page } = await useAsyncData("page-disclaimer", async () => {
  return (await queryCollection("pages").path("/pages/disclaimer").first()) || null;
});

const tocLinks = computed(() => {
  if (!page.value) return [];
  return page.value.body?.toc?.links || (page.value as any).toc?.links || [];
});

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} - Median UI` : "Tuyên bố miễn trừ trách nhiệm - Median UI",
  description: () => page.value?.description || "Tuyên bố miễn trừ trách nhiệm về thông tin và bài viết trên Median UI.",
});
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-6">
    <div class="space-y-1">
      <nav class="flex min-w-0 items-center gap-1 overflow-hidden text-xs text-text-alt mb-2">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Miễn trừ trách nhiệm</span>
      </nav>
      <h1 class="text-2xl font-bold text-text-main md:text-3xl">
        Tuyên bố miễn trừ trách nhiệm
      </h1>
    </div>

    <div v-if="page" class="prose-content">
      <ContentRenderer :value="page" />
    </div>

    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
  </article>
</template>
