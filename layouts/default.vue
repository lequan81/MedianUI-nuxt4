<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "~/stores/useAppStore";
import AppHeader from "~/components/layout/AppHeader.vue";
import AppSidebar from "~/components/layout/AppSidebar.vue";
import RightSidebar from "~/components/layout/RightSidebar.vue";
import MobileNav from "~/components/layout/MobileNav.vue";
import SearchModal from "~/components/ui/SearchModal.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import AdBanner from "~/components/ui/AdBanner.vue";

const appStore = useAppStore();
const route = useRoute();

const isAdminPage = computed(() => {
  return route.path.startsWith("/admin");
});

const hasCategoryFilter = computed(() => {
  return Boolean(route.query.category || route.query.categories);
});

// Chỉ hiển thị RightSidebar (Popular Posts) ở Trang chủ (/) và các Trang bài viết (/blog/:slug).
// Tự động ẩn ở các trang tĩnh, trang Admin và trang 404.
const hideRightSidebar = computed(() => {
  if (hasCategoryFilter.value || isAdminPage.value) return true;
  if (route.path === "/") return false;
  if (route.path.startsWith("/blog/")) return false;
  return true;
});

onMounted(() => {
  appStore.initTheme();
});
</script>

<template>
  <div id="top" class="flex min-h-screen flex-col bg-bg-base text-text-main antialiased">
    <AppHeader />

    <div class="flex flex-1 min-h-[calc(100vh-var(--header-height))]">
      <AppSidebar />

      <div class="flex flex-1 flex-col min-w-0 transition-[margin] duration-200 ease-out pb-16 lg:pb-0"
        :class="appStore.isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'">
        <main class="flex-1 pb-(--content-space)">
          <div class="mx-auto mt-(--content-padding) max-w-310 px-4 sm:px-6 xl:pl-6 xl:pr-14">
            <AdBanner v-if="!isAdminPage && !hideRightSidebar" class="mb-(--content-space)" />

            <div class="flex justify-center gap-(--content-space)">
              <div
                class="min-w-0 flex-1"
                :class="hideRightSidebar ? 'w-full' : 'xl:w-[calc(100%-var(--sidebar-width)-var(--content-space))]'"
              >
                <slot />
              </div>

              <!-- Tự động ẩn RightSidebar (Popular Posts) khi cần -->
              <aside v-if="!hideRightSidebar" class="hidden w-(--sidebar-width) max-w-125 shrink-0 xl:block">
                <div class="sticky top-[calc(var(--header-height)+10px)]">
                  <RightSidebar />
                </div>
              </aside>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>

    <MobileNav />
    <SearchModal />
  </div>
</template>
