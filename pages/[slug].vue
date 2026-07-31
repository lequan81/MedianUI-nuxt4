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

    <div
      class="space-y-8 text-[15px] leading-8 text-text-main [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-6 [&_blockquote]:rounded-xl [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:bg-bg-sec [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-[0.95rem] [&_blockquote]:text-text-alt [&_h1]:scroll-mt-[calc(var(--header-height)+24px)] [&_h1]:mb-5 [&_h1]:mt-12 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:scroll-mt-[calc(var(--header-height)+24px)] [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:scroll-mt-[calc(var(--header-height)+24px)] [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_hr]:my-12 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border-main/80 [&_img]:my-8 [&_img]:w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-6 [&_p]:leading-8 [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6"
    >
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
