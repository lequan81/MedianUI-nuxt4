<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "~/stores/useAppStore";
import { useLangStore } from "~/stores/useLangStore";

const appStore = useAppStore();
const langStore = useLangStore();
const route = useRoute();

const activePath = useState("global_active_path", () => route.path);

watch(
  () => route.path,
  (newPath) => {
    activePath.value = newPath;
  },
  { immediate: true },
);

const isAdminPage = computed(() => {
  return route.path.startsWith("/admin");
});

const hasCategoryFilter = computed(() => {
  return Boolean(route.query.category || route.query.categories);
});

// Sử dụng route.path trực tiếp để RightSidebar xuất hiện lập tức từ 0.00ms khi chuyển sang / hoặc /blog/
const hideRightSidebar = computed(() => {
  if (hasCategoryFilter.value || isAdminPage.value) return true;
  if (route.path === "/" || route.path.startsWith("/blog/")) return false;
  return true;
});

onMounted(() => {
  appStore.initTheme();
  langStore.initLang();
  if (import.meta.client && !import.meta.dev && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => { });
  }
});
</script>

<template>
  <div id="top" class="flex min-h-screen flex-col bg-bg-base text-text-main antialiased relative">
    <NotificationBar />
    <AppHeader />

    <div class="flex flex-1 min-h-[calc(100vh-var(--header-height))]">
      <AppSidebar />

      <div class="flex flex-1 flex-col min-w-0 transition-[margin] duration-200 ease-out">

        <main class="flex-1 pb-(--content-space)">
          <div class="mx-auto mt-(--content-padding) max-w-310 px-4 sm:px-6 xl:pl-6 xl:pr-14">
            <!-- AdBanner Nằm Ngay Phía Trên Của Cả Hero Slider Lẫn Right Sidebar -->
            <AdBanner v-if="!isAdminPage && !hideRightSidebar" class="mb-(--content-space)" />
            <div class="flex justify-center gap-(--content-space)">
              <div class="min-w-0 flex-1 w-full">
                <slot />
              </div>

              <!-- RightSidebar Container trên Desktop -->
              <aside v-show="!hideRightSidebar" class="hidden w-(--sidebar-width) max-w-125 shrink-0 xl:block">
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

    <ClientOnly>
      <SearchModal />
      <LanguageModal />
      <FloatingTopButton />
      <AppToast />
    </ClientOnly>
  </div>
</template>
