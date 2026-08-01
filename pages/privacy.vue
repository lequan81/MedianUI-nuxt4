<script setup lang="ts">
import { computed } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";
import TableOfContents from "~/components/post/TableOfContents.vue";

const { data: page } = await useAsyncData("page-privacy", async () => {
  return (await queryCollection("pages").path("/pages/privacy").first()) || null;
});

const tocLinks = computed(() => {
  if (!page.value) return [];
  return page.value.body?.toc?.links || (page.value as any).toc?.links || [];
});

useSeoMeta({
  title: () => page.value?.title ? `${page.value.title} - Lê Quân` : "Chính sách bảo mật - Lê Quân (@lequan81)",
  description: "Chính sách bảo mật thông tin và quyền riêng tư tại blog cá nhân của Lê Quân.",
});
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-8">
    <!-- Header Title Chuẩn Match 100% Trang About & Contact -->
    <div class="space-y-1.5">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-3">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Chính sách bảo mật</span>
      </nav>

      <h1 class="text-2xl font-bold text-text-main">
        {{ page?.title || "Chính Sách Bảo Mật" }}
      </h1>

      <div class="flex items-center gap-1.5 pt-0.5 text-xs text-text-muted italic">
        <AppIcon name="clock" :size="13" class="text-primary shrink-0" />
        <span>Cập nhật lần cuối: 01 tháng 08, 2026</span>
      </div>
    </div>

    <!-- Render Dynamic Markdown Content Từ content/pages/privacy.md -->
    <div
      v-if="page"
      class="pt-6 border-t border-border-subtle [&_h2]:text-sm sm:[&_h2]:text-base [&_h2]:font-bold [&_h2]:text-text-main [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-text-main [&_h3]:mt-6 [&_h3]:mb-2.5 [&_p]:text-xs sm:[&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-text-main/90 [&_p]:mb-4 [&_li]:text-xs sm:[&_li]:text-sm [&_li]:text-text-main/90 [&_li]:mb-1.5 [&_strong]:text-text-main [&_strong]:font-semibold"
    >
      <ContentRenderer :value="page" />
    </div>

    <div v-else class="rounded-xl border border-border-main bg-bg-alt/60 p-8 text-center text-xs text-text-alt">
      Không tìm thấy dữ liệu chính sách bảo mật.
    </div>

    <!-- Preline UI Banner Hỗ Trợ (Viền Solid) -->
    <div class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 p-5 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-text-main">Quyền riêng tư của bạn rất quan trọng</h3>
          <p class="text-xs text-text-alt">Nếu có bất kỳ thắc mắc nào về dữ liệu cá nhân, vui lòng liên hệ trực tiếp với tác giả.</p>
        </div>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-bg-sec px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white shrink-0 shadow-2xs"
        >
          <AppIcon name="shield-check" :size="13" />
          <span>Liên hệ riêng tư</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Table of Contents Button & Drawer -->
    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
  </article>
</template>
