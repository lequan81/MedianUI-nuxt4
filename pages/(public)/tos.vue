<script setup lang="ts">
import { computed } from "vue";
import { useSeoMeta, definePageMeta } from "#imports";

definePageMeta({
  hideSidebar: true,
});

import TableOfContents from "~/components/post/TableOfContents.vue";


const { data: page } = await useAsyncData("page-tos", async () => {
  return (await queryCollection("pages").path("/pages/tos").first()) || null;
});

const tocLinks = computed(() => {
  if (!page.value) return [];
  return page.value.body?.toc?.links || (page.value as any).toc?.links || [];
});

usePageSeo({
  title: page.value?.title || "Điều khoản sử dụng",
  description: page.value?.description || "Quy định và điều khoản sử dụng khi truy cập website Median UI.",
});
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-6">
    <div class="space-y-2">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-5">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Điều khoản sử dụng</span>
      </nav>
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-snug tracking-tight text-text-main">
        Điều khoản sử dụng
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
