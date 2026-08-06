<script setup lang="ts">
import { ref } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

if (import.meta.server) {
  useSeoMeta({
    title: "Duyệt Bình Luận - Admin Median UI",
    description: "Quản lý và duyệt bình luận từ độc giả trên blog",
  });
}

const comments = ref([
  {
    id: 101,
    author: "Hoàng Long",
    email: "hoanglong@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80",
    postTitle: "Phân tích trường hợp bị hack khi chạy code từ GitHub",
    postSlug: "/blog/phan-tich-truong-hop-bi-hack-khi-chay-code-tu-github",
    content: "Bài viết rất thực tế! Mình cũng từng bị cài bẫy phần mềm độc hại khi clone repo từ GitHub.",
    date: "Vừa xong",
    status: "pending",
  },
  {
    id: 102,
    author: "Minh Anh",
    email: "minhanh@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
    postTitle: "Hướng dẫn cài đặt môi trường Nuxt 4 & Tailwind CSS v4",
    postSlug: "/blog/huong-dan-cai-dat-moi-truong-nuxt-4-tailwind-css-v4",
    content: "Cảm ơn tác giả! Cho mình hỏi bản Nuxt 4 này chạy với Bun runtime có bị đụng độ với module nào không?",
    date: "15 phút trước",
    status: "pending",
  },
  {
    id: 103,
    author: "Đức Trí",
    email: "ductri@example.com",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80",
    postTitle: "Cách cài đặt J2TEAM Security cho trình duyệt Chrome",
    postSlug: "/blog/cach-cai-dat-j2team-security-cho-trinh-duyet-chrome",
    content: "Tool này dùng cực ngon, chặn phishing bảo vệ tài khoản Facebook rất an toàn.",
    date: "2 giờ trước",
    status: "approved",
  },
]);

function approveComment(id: number) {
  const item = comments.value.find((c) => c.id === id);
  if (item) item.status = "approved";
}

function deleteComment(id: number) {
  comments.value = comments.value.filter((c) => c.id !== id);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Admin Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
      <div>
        <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-text-alt mb-1.5">
          <NuxtLink to="/admin" class="shrink-0 text-text-muted transition-colors hover:text-primary">Admin</NuxtLink>
          <span class="text-text-muted">/</span>
          <span class="font-semibold text-text-main">Quản lý bình luận</span>
        </nav>
        <h1 class="text-xl sm:text-2xl font-bold text-text-main">
          Duyệt & Quản lý bình luận
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink to="/admin"
          class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs">
          <AppIcon name="arrow-left" :size="14" />
          <span>Về Dashboard</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Comments Moderation List -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">
          Tất cả bình luận ({{ comments.length }})
        </h2>
        <span class="text-xs font-semibold text-amber-400">
          {{comments.filter(c => c.status === 'pending').length}} chờ duyệt
        </span>
      </div>

      <div
        class="rounded-xl border border-border-main bg-bg-alt/60 divide-y divide-border-subtle shadow-2xs overflow-hidden">
        <div v-for="item in comments" :key="item.id" class="p-5 space-y-3 transition-colors hover:bg-bg-sec/40">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div class="flex items-center gap-3">
              <img :src="item.avatar" :alt="item.author"
                class="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20" />
              <div>
                <h3 class="text-xs font-bold text-text-main flex items-center gap-2">
                  <span>{{ item.author }}</span>
                  <span class="text-[11px] font-normal text-text-muted">({{ item.email }})</span>
                </h3>
                <NuxtLink :to="item.postSlug" target="_blank"
                  class="text-[11.5px] font-semibold text-primary hover:underline block truncate max-w-md">
                  Bài viết: {{ item.postTitle }}
                </NuxtLink>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span :class="[
                'inline-flex items-center rounded px-2 py-0.5 text-[10.5px] font-bold',
                item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
              ]">
                {{ item.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt' }}
              </span>
              <span class="text-[11px] text-text-muted">{{ item.date }}</span>
            </div>
          </div>

          <div
            class="rounded-lg bg-bg-base/70 p-3.5 text-xs text-text-main border border-border-subtle leading-relaxed">
            "{{ item.content }}"
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button v-if="item.status === 'pending'" type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
              @click="approveComment(item.id)">
              <AppIcon name="check" :size="13" />
              <span>Duyệt bình luận</span>
            </button>

            <button type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
              @click="deleteComment(item.id)">
              <AppIcon name="x" :size="13" />
              <span>Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
