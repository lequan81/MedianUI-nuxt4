<script setup lang="ts">
import { computed } from "vue";
import { useSeoMeta } from "#imports";
import { getPostPath, getLabelCounts } from "~/composables/usePosts";
import AppIcon from "~/components/ui/AppIcon.vue";

const { data: posts } = await useAsyncData("sitemap-posts", () =>
  queryCollection("posts").all(),
);

const categories = computed(() => getLabelCounts(posts.value || []));

const staticPages = [
  { label: "Trang chủ", to: "/", desc: "Trang tổng hợp bài viết mới nhất" },
  { label: "Giới thiệu (About)", to: "/about", desc: "Hành trình & Triết lý lập trình" },
  { label: "Liên hệ (Contact)", to: "/contact", desc: "Gửi tin nhắn & Kênh kết nối" },
  { label: "Điều khoản dịch vụ (TOS)", to: "/tos", desc: "Quy định truy cập & bản quyền" },
  { label: "Chính sách bảo mật (Privacy)", to: "/privacy", desc: "Cam kết bảo vệ dữ liệu cá nhân" },
  { label: "FAQ - Câu hỏi thường gặp", to: "/faq", desc: "Giải đáp thắc mắc người đọc" },
  { label: "Tuyên bố miễn trừ (Disclaimer)", to: "/disclaimer", desc: "Miễn trừ trách nhiệm kỹ thuật" },
];

useSeoMeta({
  title: "Sitemap - Sơ đồ trang web - Lê Quân (@lequan81)",
  description: "Danh mục sơ đồ toàn bộ bài viết, chuyên mục và trang tĩnh trên blog cá nhân Lê Quân.",
});
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-8">
    <!-- Header Title Chuẩn Match 100% Trang About & Contact -->
    <div class="space-y-1.5">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-3">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Sơ đồ trang web</span>
      </nav>

      <h1 class="text-2xl font-bold text-text-main">
        Sơ Đồ Trang Web (Sitemap)
      </h1>

      <div class="flex items-center gap-1.5 pt-0.5 text-xs text-text-muted italic">
        <AppIcon name="clock" :size="13" class="text-primary shrink-0" />
        <span>Cập nhật lần cuối: 01 tháng 08, 2026</span>
      </div>
    </div>

    <p class="text-xs sm:text-sm text-text-alt leading-relaxed">
      Tra cứu nhanh tất cả các chuyên mục bài viết, danh sách bài viết đã xuất bản và hệ thống trang thông tin tĩnh trên blog.
    </p>

    <!-- Section 1: Dynamic Categories Preline UI Cards (Viền Solid) -->
    <section class="space-y-4">
      <div class="flex items-center gap-2 text-sm font-bold text-text-main">
        <AppIcon name="folder" :size="16" class="text-primary" />
        <span>Chuyên mục bài viết</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.name"
          :to="`/?category=${encodeURIComponent(cat.name)}`"
          class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 p-4 transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt shadow-2xs flex items-center justify-between"
        >
          <span class="text-xs font-bold text-text-main group-hover:text-primary transition-colors">{{ cat.name }}</span>
          <span class="rounded-md bg-primary-subtle px-2 py-0.5 text-[11px] font-bold text-primary">
            {{ cat.count }} bài
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Section 2: All Blog Posts List Preline Card (Viền Solid) -->
    <section v-if="posts?.length" class="space-y-4">
      <div class="flex items-center gap-2 text-sm font-bold text-text-main">
        <AppIcon name="file-text" :size="16" class="text-primary" />
        <span>Tất cả bài viết</span>
      </div>

      <div class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 p-4.5 sm:p-6 shadow-2xs">
        <ul class="space-y-3 divide-y divide-border-subtle">
          <li v-for="post in posts" :key="post.path" class="pt-3 first:pt-0">
            <NuxtLink
              :to="getPostPath(post)"
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs group/link"
            >
              <span class="font-bold text-text-main group-hover/link:text-primary transition-colors">
                {{ post.title }}
              </span>
              <div class="flex items-center gap-2 text-[11px] text-text-muted shrink-0">
                <span class="font-semibold text-primary">{{ post.category }}</span>
                <span>•</span>
                <span>{{ post.date }}</span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 3: Static Pages Preline UI Grid (Viền Solid) -->
    <section class="space-y-4">
      <div class="flex items-center gap-2 text-sm font-bold text-text-main">
        <AppIcon name="compass" :size="16" class="text-primary" />
        <span>Trang thông tin tĩnh</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <NuxtLink
          v-for="p in staticPages"
          :key="p.to"
          :to="p.to"
          class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 p-4 space-y-1 transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt shadow-2xs"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-text-main group-hover:text-primary transition-colors">{{ p.label }}</span>
            <span class="text-[11px] text-text-muted font-mono">{{ p.to }}</span>
          </div>
          <p class="text-[11.5px] text-text-alt">{{ p.desc }}</p>
        </NuxtLink>
      </div>
    </section>

    <!-- Preline UI Banner Hỗ Trợ (Viền Solid) -->
    <div class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 p-5 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-text-main">Không tìm thấy nội dung cần tra cứu?</h3>
          <p class="text-xs text-text-alt">Sử dụng ô tìm kiếm phía trên cùng hoặc liên hệ trực tiếp với tác giả Lê Quân.</p>
        </div>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-bg-sec px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white shrink-0 shadow-2xs"
        >
          <AppIcon name="search" :size="13" />
          <span>Liên hệ hỗ trợ</span>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
