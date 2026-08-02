<script setup lang="ts">
import { computed } from "vue";
import { useSeoMeta } from "#imports";
import TableOfContents from "~/components/post/TableOfContents.vue";

const { data: page } = await useAsyncData("page-sitemap", async () => {
  return (await queryCollection("pages").path("/pages/sitemap").first()) || null;
});

const { data: posts } = await useAsyncData("sitemap-posts", () =>
  queryCollection("posts").all()
);

const tocLinks = computed(() => {
  if (!page.value) return [];
  return page.value.body?.toc?.links || (page.value as any).toc?.links || [];
});

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} - Median UI` : "Sơ đồ trang web - Median UI",
  description: () => page.value?.description || "Danh sách tổng hợp tất cả bài viết và trang trên blog Median UI.",
});
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-6">
    <div class="space-y-1">
      <nav class="flex min-w-0 items-center gap-1 overflow-hidden text-xs text-text-alt mb-2">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Sitemap</span>
      </nav>
      <h1 class="text-2xl font-bold text-text-main md:text-3xl">
        Sơ đồ trang web
      </h1>
    </div>

    <div v-if="page" class="prose-content">
      <ContentRenderer :value="page" />
    </div>

    <!-- Live Posts Sitemap Grid -->
    <div v-if="posts?.length" class="space-y-4 pt-4 border-t border-border-subtle">
      <h2 class="text-sm font-bold text-text-main">Tất cả bài viết ({{ posts.length }})</h2>
      <div class="grid gap-2 sm:grid-cols-2">
        <NuxtLink
          v-for="post in posts"
          :key="post.path"
          :to="post.path"
          class="flex items-center justify-between p-3 rounded-lg border border-border-main bg-bg-alt hover:border-primary hover:text-primary transition-colors text-xs font-medium"
        >
          <span class="truncate pr-2">{{ post.title }}</span>
          <span class="text-text-muted shrink-0 text-[11px]">{{ post.date }}</span>
        </NuxtLink>
      </div>
    </div>

    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
  </article>
</template>
