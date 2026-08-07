<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const reservedSlugs = new Set(["contact", "about", "faq", "disclaimer", "privacy", "tos"]);

const { data: page } = await useAsyncData(`page-${slug.value}`, async () => {
  const normalized = slug.value.trim().toLowerCase();
  if (reservedSlugs.has(normalized)) return null;

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

if (import.meta.server) {
  useSeoMeta({
    title: () =>
      page.value?.title ? `${page.value.title} - Median UI` : "Trang không tồn tại - Median UI",
    description: () => page.value?.description || "Trang bạn tìm kiếm không tồn tại.",
    ogTitle: () => page.value?.title,
    ogDescription: () => page.value?.description,
  });
}
</script>

<template>
  <article v-if="page" class="mx-auto max-w-3xl space-y-8">
    <nav class="flex min-w-0 items-center gap-1 overflow-hidden text-[13px]">
      <NuxtLink to="/" class="shrink-0 text-text-alt transition-colors hover:text-primary">Trang chủ</NuxtLink>
      <span class="text-text-muted">/</span>
      <span class="truncate font-semibold text-text-main">{{
        page.title
      }}</span>
    </nav>

    <header class="space-y-3 border-b border-border-main pb-6">
      <h1 class="text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
        {{ page.title }}
      </h1>
      <p v-if="page.description" class="text-sm leading-relaxed text-text-alt">
        {{ page.description }}
      </p>
    </header>

    <div class="prose dark:prose-invert max-w-none">
      <ContentRenderer :value="page" />
    </div>
  </article>

  <div v-else class="mx-auto max-w-md py-16 text-center space-y-4">
    <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
      <AppIcon name="alert-circle" :size="32" />
    </div>
    <h1 class="text-xl font-bold text-text-main">Trang không tồn tại</h1>
    <p class="text-sm text-text-alt">Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị thay đổi đường dẫn.</p>
    <div>
      <NuxtLink to="/" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-md">
        <AppIcon name="home" :size="16" />
        Về trang chủ
      </NuxtLink>
    </div>
  </div>
</template>
