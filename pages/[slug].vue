<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useSeoMeta } from "#imports";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const { data: page } = await useAsyncData(`page-${slug.value}`, async () => {
  const normalized = slug.value.trim().toLowerCase();

  const bySlug = await queryCollection("pages")
    .where("slug", "=", normalized)
    .first();
  if (bySlug) return bySlug;

  const byPath = await queryCollection("pages").path(`/${normalized}`).first();
  if (byPath) return byPath;

  const byPrefixedPath = await queryCollection("pages")
    .path(`/pages/${normalized}`)
    .first();
  if (byPrefixedPath) return byPrefixedPath;

  const allPages = await queryCollection("pages").all();
  return (
    allPages.find((item: any) =>
      String(item.path || "").endsWith(`/${normalized}`),
    ) || null
  );
});

useSeoMeta({
  title: () =>
    page.value?.title ? `${page.value.title} - Median UI` : "Page - Median UI",
  description: () => page.value?.description || "",
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
});
</script>

<template>
  <article v-if="page" class="mx-auto max-w-3xl space-y-8">
    <nav class="flex min-w-0 items-center gap-1 overflow-hidden text-[13px]">
      <NuxtLink
        to="/"
        class="shrink-0 text-text-alt transition-colors hover:text-primary"
        >Trang chủ</NuxtLink
      >
      <span class="text-text-alt/60">/</span>
      <span class="truncate font-semibold text-text-main">{{
        page.title
      }}</span>
    </nav>

    <header class="space-y-3">
      <p
        class="text-xs font-semibold uppercase tracking-[0.22em] text-text-alt"
      >
        Page
      </p>
      <h1 class="text-3xl font-bold leading-tight text-text-main md:text-5xl">
        {{ page.title }}
      </h1>
      <p
        v-if="page.description"
        class="max-w-3xl text-base leading-8 text-text-alt md:text-lg"
      >
        {{ page.description }}
      </p>
    </header>

    <div class="prose-content">
      <ContentRenderer :value="page" />
    </div>
  </article>

  <div
    v-else
    class="mx-auto max-w-2xl rounded-xl border border-border-main bg-bg-sec p-10 text-center"
  >
    <h2 class="text-2xl font-bold text-text-main">Trang không tồn tại</h2>
    <p class="mt-2 text-sm text-text-alt">
      Nội dung bạn tìm kiếm chưa được tạo hoặc đường dẫn không hợp lệ.
    </p>
    <NuxtLink
      to="/"
      class="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
    >
      Về trang chủ
    </NuxtLink>
  </div>
</template>
