<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "#imports";
import { isReservedSlug } from "~/app/config/site";
import { useSeo } from "~/composables/useSeo";

definePageMeta({
  hideSidebar: true,
});

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const { data: page } = await useAsyncData(`page-${slug.value}`, async () => {
  const normalized = slug.value.trim().toLowerCase();
  if (isReservedSlug(normalized)) return null;


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
    <AppBreadcrumb :items="[{ label: page.title }]" />

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

  <NotFoundBlock v-else status-code="404" title="Trang không tồn tại"
    message="Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị thay đổi đường dẫn." />
</template>
