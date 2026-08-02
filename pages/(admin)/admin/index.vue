<script setup lang="ts">
import { ref } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

useSeoMeta({
  title: "Dashboard Quản trị - Median UI",
  description: "Tổng quan hệ thống quản trị Median UI v1.7",
});

const stats = [
  { label: "Tổng lượt xem", value: "48,290", change: "+12.4%", icon: "eye", color: "text-blue-500", bg: "bg-blue-500/10", link: "#" },
  { label: "Bài viết", value: "18", change: "Mới cập nhật", icon: "file-text", color: "text-purple-500", bg: "bg-purple-500/10", link: "/" },
  { label: "Bình luận", value: "142", change: "2 chờ duyệt", icon: "message-square", color: "text-emerald-500", bg: "bg-emerald-500/10", link: "/admin/comments" },
  { label: "Tin nhắn liên hệ", value: "9", change: "2 chưa đọc", icon: "mail", color: "text-amber-500", bg: "bg-amber-500/10", link: "/admin/contacts" },
];

const pendingComments = ref([
  {
    id: 101,
    author: "Hoàng Long",
    email: "hoanglong@example.com",
    postTitle: "Phân tích trường hợp bị hack khi chạy code từ GitHub",
    content: "Bài viết rất thực tế! Mình cũng từng bị cài bẫy phần mềm độc hại khi clone repo từ GitHub.",
    date: "Vừa xong",
  },
  {
    id: 102,
    author: "Minh Anh",
    email: "minhanh@example.com",
    postTitle: "Hướng dẫn cài đặt môi trường Nuxt 4 & Tailwind CSS v4",
    content: "Cảm ơn tác giả! Cho mình hỏi bản Nuxt 4 này chạy với Bun runtime có bị đụng độ module nào không?",
    date: "15 phút trước",
  },
]);

const recentContacts = ref([
  { id: 1, name: "Nguyễn Văn A", email: "nguyena@example.com", subject: "Hợp tác dự án Nuxt 4", date: "Vừa xong", read: false },
  { id: 2, name: "Trần Thị B", email: "thib@example.com", subject: "Góp ý giao diện Median UI", date: "2 giờ trước", read: false },
  { id: 3, name: "Phạm Hoàng C", email: "hoangc@example.com", subject: "Hỏi về Bun:sqlite connector", date: "1 ngày trước", read: true },
]);

function approveComment(id: number) {
  pendingComments.value = pendingComments.value.filter((c) => c.id !== id);
}

function deleteComment(id: number) {
  pendingComments.value = pendingComments.value.filter((c) => c.id !== id);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Admin Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
      <div>
        <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-text-alt mb-1.5">
          <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
          <span class="text-text-muted">/</span>
          <span class="font-semibold text-text-main">Admin Dashboard</span>
        </nav>
        <h1 class="text-xl sm:text-2xl font-bold text-text-main">
          Tổng quan quản trị
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/comments"
          class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs"
        >
          <AppIcon name="message-square" :size="14" />
          <span>Duyệt bình luận (2)</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/contacts"
          class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs"
        >
          <AppIcon name="mail" :size="14" />
          <span>Hòm thư (2)</span>
        </NuxtLink>

        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover shadow-2xs"
        >
          <AppIcon name="external-link" :size="14" />
          <span>Xem Website</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Analytics Stats Grid Căn Chỉnh Chiều Cao Đều Đặn (items-stretch) -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.link"
        class="group flex flex-col justify-between h-full rounded-xl border border-dashed border-border-main bg-bg-alt/60 p-4.5 space-y-3 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-text-alt group-hover:text-primary transition-colors">{{ stat.label }}</span>
          <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', stat.bg, stat.color]">
            <AppIcon :name="stat.icon" :size="16" />
          </div>
        </div>

        <div>
          <span class="text-2xl font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">{{ stat.value }}</span>
          <p class="text-[11px] font-semibold text-primary mt-0.5">
            {{ stat.change }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Grid 2 Cột: Duyệt Bình Luận Chờ (Trái) & Tin Nhắn Liên Hệ (Phải) -->
    <div class="grid gap-6 lg:grid-cols-12 items-start">
      <!-- Cột Trái: Bình luận chờ duyệt (6 Cols) -->
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-text-main flex items-center gap-2">
            <AppIcon name="message-square" :size="15" class="text-primary" />
            <span>Bình luận chờ duyệt</span>
          </h2>

          <NuxtLink to="/admin/comments" class="text-xs font-semibold text-primary hover:underline">
            Xem tất cả ({{ pendingComments.length }})
          </NuxtLink>
        </div>

        <div v-if="pendingComments.length" class="rounded-xl border border-border-main bg-bg-alt/60 divide-y divide-border-subtle shadow-2xs overflow-hidden">
          <div
            v-for="item in pendingComments"
            :key="item.id"
            class="p-4 space-y-2 transition-colors hover:bg-bg-sec/40"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-text-main">{{ item.author }}</span>
              <span class="text-[10px] text-text-muted">{{ item.date }}</span>
            </div>
            <p class="text-[11.5px] font-semibold text-primary truncate">
              Bài viết: {{ item.postTitle }}
            </p>
            <p class="text-xs text-text-alt line-clamp-2 leading-relaxed bg-bg-base/60 p-2.5 rounded-lg border border-border-subtle">
              "{{ item.content }}"
            </p>
            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                @click="approveComment(item.id)"
              >
                <AppIcon name="check" :size="12" />
                <span>Duyệt</span>
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                @click="deleteComment(item.id)"
              >
                <AppIcon name="x" :size="12" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="rounded-xl border border-dashed border-border-main bg-bg-alt/40 p-8 text-center text-text-muted text-xs font-medium">
          Không có bình luận nào đang chờ duyệt
        </div>
      </div>

      <!-- Cột Phải: Tin nhắn liên hệ mới nhất - Nhấn Vào Chuyển Thẳng Đến Chi Tiết (6 Cols) -->
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-text-main flex items-center gap-2">
            <AppIcon name="mail" :size="15" class="text-primary" />
            <span>Tin nhắn liên hệ mới nhất</span>
          </h2>

          <NuxtLink to="/admin/contacts" class="text-xs font-semibold text-primary hover:underline">
            Xem tất cả tin nhắn
          </NuxtLink>
        </div>

        <div class="rounded-xl border border-border-main bg-bg-alt/60 divide-y divide-border-subtle shadow-2xs overflow-hidden">
          <NuxtLink
            v-for="item in recentContacts"
            :key="item.id"
            :to="`/admin/contacts?id=${item.id}`"
            class="group p-4 flex items-start gap-3 transition-colors hover:bg-bg-sec/60 cursor-pointer"
          >
            <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white', item.read ? 'bg-zinc-600' : 'bg-primary']">
              {{ item.name.charAt(0) }}
            </div>

            <div class="min-w-0 flex-1 space-y-0.5">
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-xs font-bold text-text-main truncate group-hover:text-primary transition-colors">
                  {{ item.name }}
                </h3>
                <span class="text-[10px] text-text-muted shrink-0">{{ item.date }}</span>
              </div>
              <p class="text-xs font-semibold text-primary truncate">
                {{ item.subject }}
              </p>
              <p class="text-[11px] text-text-alt truncate">
                {{ item.email }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
