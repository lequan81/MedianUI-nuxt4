<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

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

    <header class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-text-alt">
        Page
      </p>
      <h1 class="text-3xl font-bold leading-tight text-text-main md:text-5xl">
        {{ page.title }}
      </h1>
      <p v-if="page.description" class="max-w-3xl text-base leading-8 text-text-alt md:text-lg">
        {{ page.description }}
      </p>
    </header>

    <div class="prose-content">
      <ContentRenderer :value="page" />
    </div>
  </article>

  <!-- 404 Page: Tối ưu UI/UX Mobile & Desktop Chuẩn Đẹp Tự Động -->
  <div v-else class="not-found-page">
    <div class="not-found-number">404</div>

    <div class="not-found-body">
      <h1 class="not-found-title">Page Not Found</h1>
      <p class="not-found-desc">
        Đường dẫn
        <code class="not-found-code">/{{ slug }}</code>
        không tồn tại hoặc đã bị gỡ bỏ.
      </p>
    </div>

    <div class="not-found-actions">
      <NuxtLink to="/" class="not-found-btn-primary">
        <AppIcon name="arrow-left" :size="16" />
        <span>Back to Home</span>
      </NuxtLink>

      <NuxtLink to="/contact" class="not-found-btn-secondary">
        <AppIcon name="mail" :size="16" />
        <span>Contact Support</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  /* Chiều cao chuẩn màn hình lớn */
  height: calc(100dvh - 195px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: clamp(1rem, 3dvh, 2.5rem);
  padding: 0.5rem 1rem;
}

/* Tối ưu riêng cho Điện Thoại: Trừ bù 64px của MobileNav bar cố định ở đáy */
@media (max-width: 1023px) {
  .not-found-page {
    height: calc(100dvh - 245px);
    gap: clamp(0.75rem, 2dvh, 1.5rem);
  }
}

.not-found-number {
  font-size: clamp(3.5rem, 11dvh, 9rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-primary);
  user-select: none;
}

.not-found-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.375rem, 1.2dvh, 0.875rem);
}

.not-found-title {
  font-size: clamp(1.125rem, 3dvh, 2rem);
  font-weight: 700;
  color: var(--color-text-main);
  letter-spacing: -0.02em;
}

.not-found-desc {
  font-size: clamp(0.7rem, 1.5dvh, 0.875rem);
  color: var(--color-text-alt);
  line-height: 1.6;
  max-width: 28rem;
}

.not-found-code {
  background: var(--color-bg-sec);
  color: var(--color-primary);
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  word-break: break-all;
}

.not-found-actions {
  display: flex;
  flex-direction: flex-row;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  max-width: 20rem;
}

@media (min-width: 480px) {
  .not-found-actions {
    width: auto;
    max-width: none;
  }
}

.not-found-btn-primary,
.not-found-btn-secondary {
  display: inline-flex;
  items-center: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.625rem;
  padding: 0.625rem 1.25rem;
  min-height: 42px;
  font-size: clamp(0.75rem, 1.5dvh, 0.875rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;
  width: 100%;
}

@media (min-width: 480px) {

  .not-found-btn-primary,
  .not-found-btn-secondary {
    width: auto;
  }
}

.not-found-btn-primary {
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.not-found-btn-primary:hover {
  background: var(--color-primary-hover);
}

.not-found-btn-secondary {
  border: 1px solid var(--color-border-main);
  background: color-mix(in srgb, var(--color-bg-alt) 80%, transparent);
  color: var(--color-text-main);
}

.not-found-btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
