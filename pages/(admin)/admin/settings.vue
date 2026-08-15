<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import { useToast } from "~/composables/useToast";
import { useDragDropList } from "~/composables/useDragDropList";
import type { FullSiteSettings, NavigationItem, SocialLinkItem } from "~/types/settings";
import SettingsGeneralTab from "~/components/admin/settings/SettingsGeneralTab.vue";
import SettingsAuthorTab from "~/components/admin/settings/SettingsAuthorTab.vue";
import SettingsNavigationTab from "~/components/admin/settings/SettingsNavigationTab.vue";
import SettingsAnnouncementTab from "~/components/admin/settings/SettingsAnnouncementTab.vue";

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useSeoMeta({
  title: "Cấu hình Hệ thống - Admin Median UI",
  description: "Trang tùy chỉnh thông số website, hồ sơ tác giả và sắp xếp Menu Navigation",
});

const toast = useToast();
const activeTab = ref<"general" | "author" | "navigation" | "announcement">("general");
const isLoading = ref(true);
const isSaving = ref(false);

const settings = reactive<FullSiteSettings>({
  general: {
    title: { vi: "", en: "" },
    description: { vi: "", en: "" },
    tagline: { vi: "", en: "" },
    logo: "",
    siteUrl: "https://lequan81.dev",
  },
  author: {
    name: "",
    avatar: "",
    location: "",
    bio: { vi: "", en: "" },
    socials: {
      facebook: "",
      github: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
    socialLinks: [],
  },
  navigation: [],
  announcement: {
    enabled: true,
    id: "median-v1.7.0-release",
    badge: { vi: "Mới", en: "New" },
    text: { vi: "", en: "" },
    link: "",
  },
});

// Navigation Drag & Drop List
const navList = ref<NavigationItem[]>([]);
const {
  draggedIndex: navDraggedIndex,
  dragOverIndex: navDragOverIndex,
  onDragStart: onNavDragStart,
  onDragOver: onNavDragOver,
  onDrop: onNavDrop,
  onDragEnd: onNavDragEnd,
  moveUp: moveNavUp,
  moveDown: moveNavDown,
} = useDragDropList(navList);

// Socials Drag & Drop List
const socialList = ref<SocialLinkItem[]>([]);
const {
  draggedIndex: socialDraggedIndex,
  dragOverIndex: socialDragOverIndex,
  onDragStart: onSocialDragStart,
  onDragOver: onSocialDragOver,
  onDrop: onSocialDrop,
  onDragEnd: onSocialDragEnd,
  moveUp: moveSocialUp,
  moveDown: moveSocialDown,
} = useDragDropList(socialList);

const socialPresets = [
  { name: "GitHub", icon: "github", placeholder: "https://github.com/username" },
  { name: "Facebook", icon: "facebook", placeholder: "https://facebook.com/username" },
  { name: "Twitter / X", icon: "twitter", placeholder: "https://twitter.com/username" },
  { name: "LinkedIn", icon: "linkedin", placeholder: "https://linkedin.com/in/username" },
  { name: "YouTube", icon: "youtube", placeholder: "https://youtube.com/@channel" },
  { name: "Instagram", icon: "instagram", placeholder: "https://instagram.com/username" },
  { name: "Telegram", icon: "send", placeholder: "https://t.me/username" },
  { name: "Discord", icon: "message-circle", placeholder: "https://discord.gg/invite" },
  { name: "TikTok", icon: "video", placeholder: "https://tiktok.com/@username" },
  { name: "Email", icon: "mail", placeholder: "mailto:contact@domain.com" },
  { name: "Website", icon: "globe", placeholder: "https://mywebsite.com" },
];

function initSocialsList(savedAuthor: any) {
  if (Array.isArray(savedAuthor?.socialLinks) && savedAuthor.socialLinks.length > 0) {
    socialList.value = [...savedAuthor.socialLinks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return;
  }

  // Fallback: parse from existing author.socials object
  const list: SocialLinkItem[] = [];
  const s = savedAuthor?.socials || {};
  const entries: [string, string][] = Object.entries(s).filter(([_, url]) => Boolean(url)) as [string, string][];

  entries.forEach(([key, url], idx) => {
    const preset = socialPresets.find((p) => p.name.toLowerCase().includes(key.toLowerCase()));
    list.push({
      id: `social-${Date.now()}-${idx}`,
      name: preset?.name || key.toUpperCase(),
      icon: preset?.icon || "link",
      href: url,
      order: idx,
    });
  });

  if (list.length === 0) {
    list.push(
      { id: "s-1", name: "GitHub", icon: "github", href: "https://github.com/lequan81dev", order: 0 },
      { id: "s-2", name: "Facebook", icon: "facebook", href: "https://facebook.com/lequan81", order: 1 },
      { id: "s-3", name: "Twitter / X", icon: "twitter", href: "https://twitter.com/lequan81", order: 2 },
      { id: "s-4", name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com", order: 3 },
    );
  }

  socialList.value = list;
}

function handleAddSocial(preset?: { name: string; icon: string; placeholder: string }) {
  const item: SocialLinkItem = {
    id: `social-${Date.now()}`,
    name: preset?.name || "Mạng xã hội mới",
    icon: preset?.icon || "globe",
    href: preset?.placeholder || "https://",
    order: socialList.value.length,
  };
  socialList.value.push(item);
}

function handleRemoveSocial(index: number) {
  socialList.value.splice(index, 1);
  socialList.value.forEach((item, idx) => {
    item.order = idx;
  });
}

function handleAddNavItem() {
  const newItem: NavigationItem = {
    id: `nav-${Date.now()}`,
    label: { vi: "Mục mới", en: "New Item" },
    to: "/",
    icon: "link",
    order: navList.value.length,
    type: "link",
    isExternal: false,
    dividerAfter: false,
    children: [],
  };
  navList.value.push(newItem);
}

function handleRemoveNavItem(index: number) {
  navList.value.splice(index, 1);
  navList.value.forEach((item, idx) => {
    item.order = idx;
  });
}

async function fetchSettings() {
  isLoading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data: FullSiteSettings }>("/api/admin/settings");
    if (res?.success && res.data) {
      Object.assign(settings.general, res.data.general);
      Object.assign(settings.author, res.data.author);
      Object.assign(settings.announcement, res.data.announcement);
      settings.navigation = res.data.navigation || [];
      navList.value = (res.data.navigation || [])
        .map((item) => ({
          ...item,
          type: item.type || (item.children && item.children.length > 0 ? "dropdown" : item.isExternal ? "external" : "link"),
          children: item.children || [],
        }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      initSocialsList(res.data.author);
    }
  } catch {
    toast.error("Không thể tải cấu hình hệ thống.");
  } finally {
    isLoading.value = false;
  }
}

async function saveSettings() {
  isSaving.value = true;
  settings.navigation = navList.value.map((item, idx) => ({
    ...item,
    order: idx,
    isExternal: item.type === "external" || Boolean(item.isExternal),
  }));

  // Save ordered social links and update author.socials dictionary
  const socialsMap: Record<string, string> = {};
  socialList.value.forEach((item, idx) => {
    item.order = idx;
    const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (key && item.href) {
      socialsMap[key] = item.href;
    }
  });

  settings.author.socialLinks = socialList.value;
  settings.author.socials = socialsMap;

  try {
    await $fetch("/api/admin/settings", {
      method: "PUT",
      body: settings,
    });
    toast.success("Đã lưu cấu hình hệ thống thành công!");
  } catch (err: any) {
    toast.error(err?.data?.data?.message || "Lỗi khi lưu cài đặt.");
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main pb-4">
      <div>
        <nav class="flex items-center gap-1.5 text-xs text-text-muted mb-1.5">
          <NuxtLink to="/admin" class="hover:text-primary transition-colors">Quản trị</NuxtLink>
          <span>/</span>
          <span class="text-text-main font-semibold">Cài đặt Website</span>
        </nav>
        <h1 class="text-xl sm:text-2xl font-bold text-text-main tracking-tight flex items-center gap-2.5">
          <AppIcon name="settings" :size="22" class="text-primary" />
          <span>Cấu hình Hệ thống & Menu CMS</span>
        </h1>
      </div>

      <!-- Shadcn Style Compact Pixel-Perfect Save Button -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          :disabled="isSaving || isLoading"
          class="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-white shadow-xs hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          @click="saveSettings"
        >
          <AppIcon v-if="!isSaving" name="check" :size="14" />
          <AppIcon v-else name="refresh-cw" :size="14" class="animate-spin" />
          <span>{{ isSaving ? "Đang lưu..." : "Lưu thay đổi" }}</span>
        </button>
      </div>
    </div>

    <!-- Main Card with Tab Navigation -->
    <div class="rounded-xl border border-border-main bg-bg-alt shadow-xs overflow-hidden">
      <!-- Tabs Bar -->
      <div class="flex border-b border-border-main bg-bg-subtle overflow-x-auto scrollbar-none">
        <button
          type="button"
          :class="[
            'px-5 py-3 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer',
            activeTab === 'general'
              ? 'border-primary text-primary bg-bg-alt font-bold'
              : 'border-transparent text-text-muted hover:text-text-main hover:bg-bg-alt',
          ]"
          @click="activeTab = 'general'"
        >
          <AppIcon name="globe" :size="15" />
          <span>Cấu hình Chung (i18n)</span>
        </button>

        <button
          type="button"
          :class="[
            'px-5 py-3 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer',
            activeTab === 'author'
              ? 'border-primary text-primary bg-bg-alt font-bold'
              : 'border-transparent text-text-muted hover:text-text-main hover:bg-bg-alt',
          ]"
          @click="activeTab = 'author'"
        >
          <AppIcon name="user" :size="15" />
          <span>Tác giả & Mạng xã hội</span>
          <span class="rounded-full bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">
            {{ socialList.length }}
          </span>
        </button>

        <button
          type="button"
          :class="[
            'px-5 py-3 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer',
            activeTab === 'navigation'
              ? 'border-primary text-primary bg-bg-alt font-bold'
              : 'border-transparent text-text-muted hover:text-text-main hover:bg-bg-alt',
          ]"
          @click="activeTab = 'navigation'"
        >
          <AppIcon name="list" :size="15" />
          <span>Kéo thả Navbar CMS</span>
          <span class="rounded-full bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">
            {{ navList.length }}
          </span>
        </button>

        <button
          type="button"
          :class="[
            'px-5 py-3 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer',
            activeTab === 'announcement'
              ? 'border-primary text-primary bg-bg-alt font-bold'
              : 'border-transparent text-text-muted hover:text-text-main hover:bg-bg-alt',
          ]"
          @click="activeTab = 'announcement'"
        >
          <AppIcon name="bell" :size="15" />
          <span>Thanh Thông Báo</span>
        </button>
      </div>

      <!-- Tab Content Form -->
      <div class="p-6 sm:p-7">
        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="space-y-4 py-8">
          <div class="h-6 w-1/3 bg-bg-sec animate-pulse rounded"></div>
          <div class="h-10 w-full bg-bg-sec animate-pulse rounded-lg"></div>
          <div class="h-10 w-full bg-bg-sec animate-pulse rounded-lg"></div>
        </div>

        <!-- 1. TAB GENERAL -->
        <SettingsGeneralTab
          v-else-if="activeTab === 'general'"
          :general="settings.general"
        />

        <!-- 2. TAB AUTHOR -->
        <SettingsAuthorTab
          v-else-if="activeTab === 'author'"
          :author="settings.author"
          :social-list="socialList"
          :dragged-index="socialDraggedIndex"
          :drag-over-index="socialDragOverIndex"
          @add-social="handleAddSocial"
          @remove-social="handleRemoveSocial"
          @move-social-up="moveSocialUp"
          @move-social-down="moveSocialDown"
          @drag-start="onSocialDragStart"
          @drag-over="onSocialDragOver"
          @drop="onSocialDrop"
          @drag-end="onSocialDragEnd"
        />

        <!-- 3. TAB NAVIGATION -->
        <SettingsNavigationTab
          v-else-if="activeTab === 'navigation'"
          :nav-list="navList"
          :dragged-index="navDraggedIndex"
          :drag-over-index="navDragOverIndex"
          @add-nav-item="handleAddNavItem"
          @remove-nav-item="handleRemoveNavItem"
          @move-up="moveNavUp"
          @move-down="moveNavDown"
          @drag-start="onNavDragStart"
          @drag-over="onNavDragOver"
          @drop="onNavDrop"
          @drag-end="onNavDragEnd"
        />

        <!-- 4. TAB ANNOUNCEMENT -->
        <SettingsAnnouncementTab
          v-else-if="activeTab === 'announcement'"
          :announcement="settings.announcement"
        />
      </div>
    </div>
  </div>
</template>
