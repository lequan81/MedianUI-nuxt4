<script setup lang="ts">
import { reactive, shallowRef, computed, onMounted } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

definePageMeta({
  middleware: ["admin-auth"],
});

if (import.meta.server) {
  useSeoMeta({
    title: "Dashboard Quản trị - Median UI",
    description: "Tổng quan hệ thống quản trị Median UI v1.7",
  });
}

const liveStats = reactive({
  totalContacts: 0,
  unreadContacts: 0,
});
const recentContacts = shallowRef<any[]>([]);
const isLoading = shallowRef(true);

async function fetchDashboardData() {
  isLoading.value = true;
  try {
    const [statsRes, contactsRes] = await Promise.all([
      $fetch<any>("/api/admin/stats"),
      $fetch<any>("/api/admin/contacts?pageSize=8"),
    ]);

    if (statsRes) {
      liveStats.totalContacts = statsRes.totalContacts || 0;
      liveStats.unreadContacts = statsRes.unreadContacts || 0;
    }
    if (contactsRes?.contacts) recentContacts.value = contactsRes.contacts;
  } catch {
    // Graceful fallback
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchDashboardData();
});

const statsList = computed(() => [
  {
    id: "contacts",
    label: "Hòm thư liên hệ",
    value: String(liveStats.totalContacts),
    change: `${liveStats.unreadContacts} chưa đọc`,
    icon: "mail",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    link: "/admin/contacts",
  },
  {
    id: "posts",
    label: "Bài viết Nuxt Content",
    value: "18",
    change: "Pure Static SSG",
    icon: "file-text",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    link: "/",
  },
  {
    id: "runtime",
    label: "Runtime Engine",
    value: "Bun + Nitro",
    change: "Argon2id + UUIDv7",
    icon: "rocket",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    link: "/admin",
  },
  {
    id: "architecture",
    label: "Kiến trúc",
    value: "Pure Static",
    change: "Zero Client Memory Leak",
    icon: "shield-check",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    link: "/admin",
  },
]);
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
          to="/admin/contacts"
          class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs"
        >
          <AppIcon name="mail" :size="14" />
          <span>Hòm thư ({{ liveStats.unreadContacts }})</span>
        </NuxtLink>

        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 shadow-2xs"
        >
          <AppIcon name="external-link" :size="14" />
          <span>Xem Website</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Analytics Stats Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
      <NuxtLink
        v-for="stat in statsList"
        :key="stat.id"
        :to="stat.link"
        class="group flex flex-col justify-between h-full rounded-xl border border-dashed border-border-main bg-bg-alt/60 p-4.5 space-y-3 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-text-alt group-hover:text-primary transition-colors">{{ stat.label }}</span>
          <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', stat.bg, stat.color]">
            <AppIcon :name="stat.icon" :size="16" />
          </div>
        </div>

        <div>
          <span class="text-2xl font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">
            {{ stat.value }}
          </span>
          <p class="text-[11px] font-semibold text-primary mt-0.5">
            {{ stat.change }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Tin nhắn liên hệ mới nhất -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-text-main flex items-center gap-2">
          <AppIcon name="mail" :size="15" class="text-primary" />
          <span>Tin nhắn liên hệ từ độc giả</span>
        </h2>

        <NuxtLink to="/admin/contacts" class="text-xs font-semibold text-primary hover:underline">
          Xem tất cả tin nhắn &rarr;
        </NuxtLink>
      </div>

      <div
        v-if="recentContacts.length"
        class="rounded-xl border border-border-main bg-bg-alt/60 divide-y divide-border-subtle shadow-2xs overflow-hidden"
      >
        <NuxtLink
          v-for="item in recentContacts"
          :key="item.id"
          :to="`/admin/contacts?id=${item.id}`"
          class="group p-4 flex items-start gap-3 transition-colors hover:bg-bg-sec/60 cursor-pointer"
        >
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
              item.status === 'read' ? 'bg-zinc-600' : 'bg-primary'
            ]"
          >
            {{ (item.name || "U").charAt(0).toUpperCase() }}
          </div>

          <div class="min-w-0 flex-1 space-y-0.5">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-xs font-bold text-text-main truncate group-hover:text-primary transition-colors">
                {{ item.name }}
              </h3>
              <span class="text-[10px] text-text-muted shrink-0">{{ item.created_at }}</span>
            </div>
            <p class="text-xs font-semibold text-primary truncate">
              {{ item.subject || 'Không có tiêu đề' }}
            </p>
            <p class="text-[11px] text-text-alt truncate">
              {{ item.message }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-border-main bg-bg-alt/40 p-8 text-center text-text-muted text-xs font-medium"
      >
        Chưa có tin nhắn liên hệ nào.
      </div>
    </div>
  </div>
</template>
