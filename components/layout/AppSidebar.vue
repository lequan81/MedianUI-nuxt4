<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "#imports";
import {
  footerSocials,
  sidebarItems,
  adminSidebarItems,
  siteConfig,
  type NavChild,
  type NavItem,
} from "~/app/config/site";
import { useAppStore } from "~/stores/useAppStore";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

const appStore = useAppStore();
const route = useRoute();
const openDropdown = ref("products");
const hoveredTooltipId = ref("");

const isAdminPage = computed(() => {
  return route.path.startsWith("/admin");
});

const activeItems = computed(() => {
  return isAdminPage.value ? adminSidebarItems : sidebarItems;
});

const sidebarWidthClass = computed(() => {
  return appStore.isSidebarCollapsed
    ? "w-[280px] max-w-[85vw] lg:w-20"
    : "w-[280px] max-w-[85vw] lg:w-60";
});


function toggleDropdown(id: string) {
  if (appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen) return;
  openDropdown.value = openDropdown.value === id ? "" : id;
}

function isActive(path?: string) {
  if (!path) return false;
  if (path === "/" || path === "/admin") {
    return route.path === path;
  }
  return route.path === path || route.path.startsWith(path + "/");
}

function isChildActive(children?: NavChild[]) {
  return Boolean(children?.some((child) => isActive(child.to)));
}

function isOpen(item: NavItem) {
  if (appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen) return false;
  return openDropdown.value === item.id;
}

function openTooltip(id: string) {
  if (appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen) {
    hoveredTooltipId.value = id;
  }
}

function closeTooltip(id: string) {
  if (hoveredTooltipId.value === id) {
    hoveredTooltipId.value = "";
  }
}

watch(
  () => route.path,
  () => {
    appStore.closeMobileMenu();
  },
);
</script>

<template>
  <!-- Backdrop cho Mobile Drawer -->
  <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="appStore.isMobileMenuOpen" class="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs lg:hidden"
      @click="appStore.closeMobileMenu"></div>
  </Transition>

  <aside :class="[
    'fixed left-0 z-40 flex shrink-0 flex-col justify-between border-r border-border-main bg-bg-base transition-[width,transform] duration-200 ease-out',
    sidebarWidthClass,
    appStore.isMobileMenuOpen
      ? 'top-0 bottom-0 h-full z-50 translate-x-0 shadow-2xl overflow-y-auto'
      : 'top-16 h-[calc(100vh-4rem)] -translate-x-full lg:translate-x-0 lg:sticky lg:top-16',
    appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen
      ? 'lg:overflow-visible'
      : 'overflow-y-auto overflow-x-hidden',
  ]">
    <!-- Mobile Drawer Header -->
    <div v-if="appStore.isMobileMenuOpen"
      class="flex items-center justify-between border-b border-border-subtle px-4 py-3.5 lg:hidden shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold tracking-tight text-text-main">{{ siteConfig.shortName }}</span>
      </div>
      <button type="button" aria-label="Đóng menu" @click="appStore.closeMobileMenu"
        class="flex h-8 w-8 items-center justify-center rounded-full text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer">
        <AppIcon name="x" :size="18" />
      </button>
    </div>

    <nav class="w-full flex-1 py-3">
      <div v-if="isAdminPage && (!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen)"
        class="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-primary border-b border-border-subtle mb-2">
        Quản trị hệ thống
      </div>

      <ul class="flex w-full list-none flex-col p-0">
        <li v-for="item in activeItems" :key="item.id" @mouseenter="openTooltip(item.id)"
          @mouseleave="closeTooltip(item.id)" :class="['group relative w-full py-1',
            item.dividerAfter ? 'mb-2 border-b border-border-subtle pb-2' : '']">
          <template v-if="item.children">
            <button type="button" :aria-expanded="isOpen(item)" :aria-label="item.label" @click="toggleDropdown(item.id)" :class="[
              'relative flex h-10 w-full items-center text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer',
              isChildActive(item.children)
                ? 'text-primary font-bold'
                : 'text-text-main hover:text-primary',
            ]">

              <span v-if="isChildActive(item.children)"
                class="absolute right-0 top-1/2 h-7.5 w-px -translate-y-1/2 rounded-l-xs bg-primary"></span>

              <span class="flex h-9 w-20 shrink-0 items-center justify-center">
                <AppIcon :name="item.icon" :size="20" :class="isChildActive(item.children) ? 'text-primary' : ''" />
              </span>
              <span v-if="!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen"
                class="flex min-w-0 flex-1 items-center justify-between pr-4">
                <span class="truncate">{{ item.label }}</span>
                <AppIcon name="chevron-down" :size="14" :class="[
                  'shrink-0 transition-transform duration-150',
                  isOpen(item) ? 'rotate-180 text-primary' : '',
                ]" />
              </span>
            </button>

            <!-- Submenu khi mở dropdown -->
            <ul v-if="isOpen(item) && (!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen)"
              class="relative ml-14 mr-4 mt-1 space-y-1 pb-2 text-xs sm:text-sm text-text-alt">
              <li v-for="child in item.children" :key="child.label" class="relative min-h-7 pl-5">
                <span class="absolute left-0 top-0 h-4 w-3 rounded-bl-md border-b border-l border-border-main"></span>
                <NuxtLink v-if="child.to" :to="child.to"
                  class="block truncate py-1.5 font-medium transition-colors hover:text-primary">
                  {{ child.label }}
                </NuxtLink>
                <a v-else :href="child.href"
                  class="block truncate py-1.5 font-medium transition-colors hover:text-primary"
                  :target="child.external ? '_blank' : undefined" :rel="child.external ? 'noreferrer' : undefined">
                  {{ child.label }}
                </a>
              </li>
            </ul>

            <!-- Tooltip Popover khi Sidebar Thu Gọn trên Desktop -->
            <div v-if="appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen && hoveredTooltipId === item.id"
              class="absolute left-17.5 top-1/2 z-50 w-56 -translate-y-1/2 rounded-xl border border-border-main bg-bg-alt p-2.5 text-xs shadow-md">
              <div class="sr-only">submenu</div>
              <ul class="space-y-1">
                <li v-for="child in item.children" :key="child.label">
                  <NuxtLink v-if="child.to" :to="child.to" :class="[
                    'block truncate rounded-md px-2.5 py-2 font-medium transition-colors',
                    isActive(child.to)
                      ? 'bg-primary-subtle text-primary'
                      : 'text-text-main hover:bg-bg-sec hover:text-primary',
                  ]">
                    {{ child.label }}
                  </NuxtLink>
                  <a v-else :href="child.href"
                    class="block truncate rounded-md px-2.5 py-2 font-medium text-text-main transition-colors hover:bg-bg-sec hover:text-primary"
                    :target="child.external ? '_blank' : undefined" :rel="child.external ? 'noreferrer' : undefined">
                    {{ child.label }}
                  </a>
                </li>
              </ul>
            </div>
          </template>

          <template v-else>
            <NuxtLink v-if="item.to" :to="item.to" :aria-label="item.label" :class="[
              'relative flex h-10 w-full items-center text-xs sm:text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'text-primary font-bold'
                : 'text-text-main hover:text-primary',
            ]">
              <span v-if="isActive(item.to)"
                class="absolute right-0 top-1/2 h-7.5 w-px -translate-y-1/2 rounded-l-xs bg-primary"></span>

              <span class="flex h-9 w-20 shrink-0 items-center justify-center">
                <AppIcon :name="item.icon" :size="20" :class="isActive(item.to) ? 'text-primary' : ''" />
              </span>
              <span v-if="!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen"
                class="flex min-w-0 items-center gap-2 pr-4">
                <span class="truncate">{{ item.label }}</span>
                <span v-if="item.badge" class="text-[11px] font-semibold text-primary">{{ item.badge }}</span>
              </span>
            </NuxtLink>

            <a v-else :href="item.href" :aria-label="item.label"
              class="relative flex h-10 w-full items-center text-xs sm:text-sm font-medium text-text-main transition-colors hover:text-primary"
              :target="item.external ? '_blank' : undefined" :rel="item.external ? 'noreferrer' : undefined">
              <span class="flex h-9 w-20 shrink-0 items-center justify-center">
                <AppIcon :name="item.icon" :size="20" />
              </span>
              <span v-if="!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen"
                class="flex min-w-0 items-center gap-2 pr-4">
                <span class="truncate">{{ item.label }}</span>
                <span v-if="item.badge" class="text-[11px] font-semibold text-primary">{{ item.badge }}</span>
              </span>
            </a>


            <div
              v-if="appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen && hoveredTooltipId === item.id"
              class="pointer-events-none select-none absolute left-17.5 top-1/2 z-50 max-w-56 -translate-y-1/2 whitespace-nowrap rounded-xl border border-border-main bg-bg-alt px-3 py-2 text-xs font-medium text-text-main shadow-md"
            >
              {{ item.label }}
            </div>
          </template>
        </li>
      </ul>
    </nav>

    <!-- Footer Sidebar -->
    <div v-if="!isAdminPage && (!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen)"
      class="border-t border-border-subtle p-3 shrink-0 pb-8 lg:pb-3">
      <div class="p-3 text-center">
        <p class="text-[12px] font-medium leading-relaxed text-text-main">
          Re-built with <span class="font-semibold text-green-400">Nuxt 4</span>
        </p>
        <p class="mt-0.5 text-[11px] leading-tight text-text-muted">
          Inspired by
          <a href="https://median-ui.jagodesain.com/"
            class="font-medium text-text-main hover:underline decoration-primary underline-offset-2 transition-colors hover:text-primary"
            target="_blank" rel="noreferrer">
            Median UI
          </a>
        </p>
        <div class="mt-2.5 flex items-center justify-center gap-2.5 pt-2.5">
          <template v-for="link in footerSocials" :key="link.label">
            <NuxtLink v-if="link.to" :to="link.to"
              class="flex h-7 w-7 items-center justify-center rounded-lg border border-border-main bg-bg-base text-text-alt transition-colors hover:border-primary hover:text-primary"
              :title="link.label">
              <AppIcon :name="link.icon" :size="14" />
            </NuxtLink>
            <a v-else :href="link.href"
              class="flex h-7 w-7 items-center justify-center rounded-lg border border-border-main bg-bg-base text-text-alt transition-colors hover:border-primary hover:text-primary"
              :target="link.external ? '_blank' : undefined" :rel="link.external ? 'noreferrer' : undefined"
              :title="link.label">
              <AppIcon :name="link.icon" :size="14" />
            </a>
          </template>
        </div>
      </div>
    </div>
  </aside>
</template>
