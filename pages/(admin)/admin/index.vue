<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useSeoMeta } from "#imports";
import { adminSidebarItems, type NavItem } from "~/app/config/navigation";

definePageMeta({
  middleware: ["admin-auth"] as any,
});

if (import.meta.server) {
  useSeoMeta({
    title: "Dashboard Quản trị - Median UI",
    description: "Tổng quan hệ thống quản trị Median UI v1.7",
  });
}

const state = reactive({
  liveStats: {
    totalComments: 0,
    pendingComments: 0,
    flaggedComments: 0,
    totalReports: 0,
    totalContacts: 0,
    unreadContacts: 0,
  },
  pendingComments: [] as any[],
  recentContacts: [] as any[],
  isLoading: true,
});

async function fetchDashboardData() {
  state.isLoading = true;
  try {
    const [statsRes, commentsRes, contactsRes] = await Promise.all([
      $fetch<any>("/api/admin/stats"),
      $fetch<any>("/api/admin/comments?status=pending"),
      $fetch<any>("/api/admin/contacts?pageSize=5"),
    ]);

    if (statsRes) state.liveStats = statsRes;
    if (commentsRes?.comments) state.pendingComments = commentsRes.comments;
    if (contactsRes?.contacts) state.recentContacts = contactsRes.contacts;
  } catch {
    // Graceful fallback
  } finally {
    state.isLoading = false;
  }
}

onMounted(() => {
  fetchDashboardData();
});
const navMap = Object.fromEntries(adminSidebarItems.map((item: NavItem) => [item.id, item]));

const statsList = computed(() => [
  {
    id: "views",
    label: "Tổng lượt xem",
    value: "48,290",
    change: "Hệ thống",
    icon: "eye",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    link: navMap["admin-home"]?.to || "#",
  },
  {
    id: "posts",
    label: "Bài viết",
    value: "18",
    change: "Hoạt động",
    icon: "file-text",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    link: navMap["admin-website"]?.to || "/",
  },
  {
    id: "comments",
    label: navMap["admin-comments"]?.label || "Bình luận",
    value: String(state.liveStats.totalComments),
    change: `${state.liveStats.pendingComments} chờ duyệt`,
    icon: navMap["admin-comments"]?.icon || "message-square",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    link: navMap["admin-comments"]?.to || "/admin/comments",
  },
  {
    id: "contacts",
    label: navMap["admin-contacts"]?.label || "Tin nhắn liên hệ",
    value: String(state.liveStats.totalContacts),
    change: `${state.liveStats.unreadContacts} chưa đọc`,
    icon: navMap["admin-contacts"]?.icon || "mail",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    link: navMap["admin-contacts"]?.to || "/admin/contacts",
  },
]);

async function approveComment(id: string) {
  try {
    await $fetch(`/api/admin/comments/${id}`, { method: "POST", body: { action: "approve" } });
    state.pendingComments = state.pendingComments.filter((c) => c.id !== id);
    fetchDashboardData();
  } catch {
    // Ignore error
  }
}

async function deleteComment(id: string) {
  try {
    await $fetch(`/api/admin/comments/${id}`, { method: "POST", body: { action: "delete" } });
    state.pendingComments = state.pendingComments.filter((c) => c.id !== id);
    fetchDashboardData();
  } catch {
    // Ignore error
  }
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
        <NuxtLink to="/admin/comments"
          class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs">
          <AppIcon name="message-square" :size="14" />
          <span>Duyệt bình luận (2)</span>
        </NuxtLink>

        <NuxtLink to="/admin/contacts"
          class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs">
          <AppIcon name="mail" :size="14" />
          <span>Hòm thư (2)</span>
        </NuxtLink>

        <NuxtLink to="/"
          class="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover shadow-2xs">
          <AppIcon name="external-link" :size="14" />
          <span>Xem Website</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Analytics Stats Grid Căn Chỉnh Chiều Cao Đều Đặn (items-stretch) -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
      <div v-for="stat in statsList" :key="stat.label" :to="stat.link"
        class="group flex flex-col justify-between h-full rounded-xl border border-dashed border-border-main bg-bg-alt/60 p-4.5 space-y-3 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-text-alt group-hover:text-primary transition-colors">{{ stat.label
          }}</span>
          <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', stat.bg, stat.color]">
            <AppIcon :name="stat.icon" :size="16" />
          </div>
        </div>

        <div>
          <span class="text-2xl font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">{{
            stat.value }}</span>
          <p class="text-[11px] font-semibold text-primary mt-0.5">
            {{ stat.change }}
          </p>
        </div>
      </div>
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
            Xem tất cả ({{ state.pendingComments.length }})
          </NuxtLink>
        </div>

        <div v-if="state.pendingComments.length"
          class="rounded-xl border border-border-main shadow-2xs overflow-hidden divide-y divide-border-subtle/80">
          <div v-for="(item, idx) in state.pendingComments" :key="item.id"
            :class="[
              'p-4 space-y-2.5 transition-colors duration-150',
              idx % 2 === 0 ? 'bg-[#0e1424]/90 hover:bg-[#121a2e]' : 'bg-[#141b2d]/90 hover:bg-[#192238]'
            ]">
            <div class="flex items-center justify-between gap-2 min-w-0">
              <div class="flex items-center gap-2.5 min-w-0">
                <NuxtImg :src="item.author.avatar" :alt="item.author.name"
                  class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-primary/20 bg-bg-base" format="webp" loading="lazy" />
                <span class="text-xs font-bold text-text-main truncate">{{ item.author.name }}</span>
              </div>
              <span class="text-[10px] text-text-muted shrink-0">{{ item.date }}</span>
            </div>

            <p class="text-[11.5px] text-text-muted truncate">
              Bài viết: <NuxtLink :to="`/blog/${item.post_slug}`" target="_blank" class="font-semibold text-text-main hover:text-primary hover:underline">{{ item.post_slug }}</NuxtLink>
            </p>

            <p class="text-xs text-text-alt line-clamp-2 leading-relaxed bg-bg-base/80 p-2.5 rounded-lg border border-border-subtle">
              "{{ item.content }}"
            </p>

            <div class="flex items-center justify-between gap-2 pt-1">
              <span class="text-[10px] font-mono font-semibold text-primary bg-bg-base px-2 py-0.5 rounded border border-border-subtle">
                {{ item.mod_reason || '0x80' }}
              </span>

              <div class="flex items-center gap-2">
                <button type="button"
                  class="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                  @click="approveComment(item.id)">
                  <AppIcon name="check" :size="12" />
                  <span>Duyệt</span>
                </button>
                <button type="button"
                  class="inline-flex items-center gap-1 rounded border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                  @click="deleteComment(item.id)">
                  <AppIcon name="x" :size="12" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else
          class="rounded-xl border border-dashed border-border-main bg-bg-alt/40 p-8 text-center text-text-muted text-xs font-medium">
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

        <div
          class="rounded-xl border border-border-main bg-bg-alt/60 divide-y divide-border-subtle shadow-2xs overflow-hidden">
          <NuxtLink v-for="item in state.recentContacts" :key="item.id" :to="`/admin/contacts?id=${item.id}`"
            class="group p-4 flex items-start gap-3 transition-colors hover:bg-bg-sec/60 cursor-pointer">
            <div
              :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white', item.read ? 'bg-zinc-600' : 'bg-primary']">
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
