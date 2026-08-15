<script setup lang="ts">
import { computed } from "vue";
import { useSeoMeta, definePageMeta } from "#imports";

definePageMeta({
  hideSidebar: true,
});

const { data: page } = await useAsyncData("page-disclaimer", async () => {
  return (await queryCollection("pages").path("/pages/disclaimer").first()) || null;
});

const tocLinks = computed(() => {
  if (!page.value) return [];
  return page.value.body?.toc?.links || [];
});

useSeo({
  title: page.value?.title || "Tuyên bố miễn trừ trách nhiệm",
  description: page.value?.description || "Tuyên bố miễn trừ trách nhiệm về thông tin và bài viết trên Median UI.",
});
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-6">
    <div class="space-y-2">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-5">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Miễn trừ trách nhiệm</span>
      </nav>
      <h1 class="text-2xl sm:text-3xl lg:text-[32px] font-extrabold leading-tight tracking-tight text-text-main">
        Tuyên bố miễn trừ trách nhiệm
      </h1>
      <p v-if="page?.updatedAt || page?.date" class="text-[11px] italic text-text-muted mt-1">
        Cập nhật lần cuối: {{ page?.updatedAt || page?.date }}
      </p>
    </div>

    <div v-if="page" class="prose-content">
      <ContentRenderer :value="page" />
    </div>

    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
  </article>
</template>
