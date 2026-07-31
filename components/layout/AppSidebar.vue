<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "#imports";
import {
  footerSocials,
  sidebarItems,
  type NavSocialIcons,
  type NavItem,
} from "~/app/config/site";
import { useAppStore } from "~/stores/useAppStore";
import AppIcon from "~/components/ui/AppIcon.vue";

const appStore = useAppStore();
const route = useRoute();
const openDropdown = ref("products");
const hoveredTooltipId = ref("");

const sidebarWidthClass = computed(() => {
  if (appStore.isMobileMenuOpen) return "w-[min(320px,calc(100vw-32px))]";
  return appStore.isSidebarCollapsed
    ? "w-[var(--side-width)]"
    : "w-[var(--side-width-expand)]";
});

function toggleDropdown(id: string) {
  if (appStore.isSidebarCollapsed) return;
  openDropdown.value = openDropdown.value === id ? "" : id;
}

function isActive(path?: string) {
  if (!path) return false;
  return path === "/" ? route.path === "/" : route.path.startsWith(path);
}

function isChildActive(children?: NavChild[]) {
  return Boolean(children?.some((child) => isActive(child.to)));
}

function isOpen(item: NavItem) {
  return !appStore.isSidebarCollapsed && openDropdown.value === item.id;
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
  <div
    v-if="appStore.isMobileMenuOpen"
    class="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px] lg:hidden"
    @click="appStore.closeMobileMenu"
  ></div>

  <aside
    :class="[
      'fixed left-0 top-(--header-height) z-40 flex h-[calc(100vh-var(--header-height))] shrink-0 flex-col justify-between border-r border-border-main bg-bg-base transition-[width,transform] duration-200 ease-out lg:sticky',
      sidebarWidthClass,
      appStore.isMobileMenuOpen
        ? 'translate-x-0 shadow-2xl'
        : '-translate-x-full lg:translate-x-0',
      appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen
        ? 'overflow-visible'
        : 'overflow-y-auto overflow-x-hidden',
    ]"
  >
    <nav class="w-full py-3">
      <ul class="flex w-full list-none flex-col p-0">
        <li
          v-for="item in sidebarItems"
          :key="item.id"
          :class="[
            'group relative w-full py-1',
            item.dividerAfter ? 'mb-2 border-b border-border-main/60 pb-2' : '',
          ]"
          @mouseenter="openTooltip(item.id)"
          @mouseleave="closeTooltip(item.id)"
        >
          <template v-if="item.children">
            <button
              type="button"
              :aria-expanded="isOpen(item)"
              :class="[
                'flex h-10 w-full items-center text-left text-[13.5px] font-medium transition-colors',
                isChildActive(item.children)
                  ? 'text-primary'
                  : 'text-text-main/85 hover:text-primary',
              ]"
              @click="toggleDropdown(item.id)"
            >
              <span
                class="flex h-(--icon-height) w-(--side-width) shrink-0 items-center justify-center"
              >
                <AppIcon :name="item.icon" :size="20" />
              </span>
              <span
                v-if="!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen"
                class="flex min-w-0 flex-1 items-center justify-between pr-4"
              >
                <span class="truncate">{{ item.label }}</span>
                <AppIcon
                  name="chevron-down"
                  :size="14"
                  :class="[
                    'shrink-0 transition-transform duration-150',
                    isOpen(item) ? 'rotate-180' : '',
                  ]"
                />
              </span>
            </button>

            <ul
              v-show="isOpen(item)"
              class="relative ml-[calc(var(--side-width)-20px)] mr-4 mt-1 space-y-1 pb-2 text-[13px] text-text-alt"
            >
              <li
                v-for="child in item.children"
                :key="child.label"
                class="relative min-h-7 pl-5"
              >
                <span
                  class="absolute left-0 top-0 h-4 w-3 rounded-bl-md border-b border-l border-border-main"
                ></span>
                <NuxtLink
                  v-if="child.to"
                  :to="child.to"
                  class="block truncate py-1.5 font-medium transition-colors hover:text-primary"
                >
                  {{ child.label }}
                </NuxtLink>
                <a
                  v-else
                  :href="child.href"
                  class="block truncate py-1.5 font-medium transition-colors hover:text-primary"
                  :target="child.external ? '_blank' : undefined"
                  :rel="child.external ? 'noreferrer' : undefined"
                >
                  {{ child.label }}
                </a>
              </li>
            </ul>

            <div
              v-if="appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen"
              v-show="hoveredTooltipId === item.id"
              class="absolute left-17.5 top-1/2 z-50 w-56 -translate-y-1/2 border border-border-main bg-bg-alt p-2.5 text-xs shadow-2xl"
            >
              <div
                class="mb-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-alt"
              >
                {{ item.label }}
              </div>
              <ul class="space-y-1">
                <li v-for="child in item.children" :key="child.label">
                  <NuxtLink
                    v-if="child.to"
                    :to="child.to"
                    class="block truncate rounded-md px-2.5 py-2 font-medium text-text-main transition-colors hover:bg-bg-sec hover:text-primary"
                  >
                    {{ child.label }}
                  </NuxtLink>
                  <a
                    v-else
                    :href="child.href"
                    class="block truncate rounded-md px-2.5 py-2 font-medium text-text-main transition-colors hover:bg-bg-sec hover:text-primary"
                    :target="child.external ? '_blank' : undefined"
                    :rel="child.external ? 'noreferrer' : undefined"
                  >
                    {{ child.label }}
                  </a>
                </li>
              </ul>
            </div>
          </template>

          <template v-else>
            <NuxtLink
              v-if="item.to"
              :to="item.to"
              :class="[
                'relative flex h-10 w-full items-center text-[13.5px] font-medium transition-colors',
                isActive(item.to)
                  ? 'text-primary'
                  : 'text-text-main/85 hover:text-primary',
              ]"
            >
              <span
                v-if="isActive(item.to)"
                class="absolute bottom-1 left-0 top-1 w-0.5 rounded-r bg-primary"
              ></span>
              <span
                class="flex h-(--icon-height) w-(--side-width) shrink-0 items-center justify-center"
              >
                <AppIcon :name="item.icon" :size="20" />
              </span>
              <span
                v-if="!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen"
                class="flex min-w-0 items-center gap-2 pr-4"
              >
                <span class="truncate">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="text-[11px] font-semibold text-primary"
                  >{{ item.badge }}</span
                >
              </span>
            </NuxtLink>

            <a
              v-else
              :href="item.href"
              class="relative flex h-10 w-full items-center text-[13.5px] font-medium text-text-main/85 transition-colors hover:text-primary"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noreferrer' : undefined"
            >
              <span
                class="flex h-(--icon-height) w-(--side-width) shrink-0 items-center justify-center"
              >
                <AppIcon :name="item.icon" :size="20" />
              </span>
              <span
                v-if="!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen"
                class="flex min-w-0 items-center gap-2 pr-4"
              >
                <span class="truncate">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="text-[11px] font-semibold text-primary"
                  >{{ item.badge }}</span
                >
              </span>
            </a>

            <div
              v-if="appStore.isSidebarCollapsed && !appStore.isMobileMenuOpen"
              v-show="hoveredTooltipId === item.id"
              class="absolute left-17.5 top-1/2 z-50 max-w-56 -translate-y-1/2 whitespace-nowrap border border-border-main bg-bg-alt px-3 py-2 text-xs font-medium text-text-main shadow-xl"
            >
              {{ item.label }}
            </div>
          </template>
        </li>
      </ul>
    </nav>

    <div
      v-if="!appStore.isSidebarCollapsed || appStore.isMobileMenuOpen"
      class="p-4"
    >
      <div
        class="flex flex-col justify-between items-center gap-2 text-xs font-medium text-text-alt"
      >
        <p class="text-text-alt/70">
          Inspired by
          <a
            href="https://median-ui.jagodesain.com/"
            class="text-text-alt transition-colors hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Median UI
          </a>
        </p>
        <div class="flex items-center gap-x-2">
          <template
            v-for="(link, index) in footerSocials.slice(0, 3)"
            :key="link.label"
          >
            <NuxtLink
              v-if="link.to"
              :to="link.to"
              class="transition-colors hover:text-primary"
            >
              <AppIcon :name="link.icon" :size="16" />
            </NuxtLink>
            <a
              v-else
              :href="link.href"
              class="transition-colors hover:text-primary"
            >
              <AppIcon :name="link.icon" :size="16" />
            </a>
            <span v-if="index < 2" class="text-border-main">/</span>
          </template>
        </div>
      </div>
    </div>
  </aside>
</template>
