<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "#imports";

const route = useRoute();


const isAdminPage = computed(() => {
  return route.path.startsWith("/admin");
});

const hideRightSidebar = computed(() => {
  if (isAdminPage.value) return true;
  return Boolean(route.meta.hideSidebar);
});
</script>

<template>
  <div id="top" class="flex min-h-screen flex-col bg-bg-base text-text-main antialiased relative">
    <NotificationBar />
    <AppHeader />

    <div class="flex flex-1 min-h-[calc(100vh-4rem)]">
      <AppSidebar />

      <div class="flex flex-1 flex-col min-w-0 transition-[margin] duration-200 ease-out">

        <main class="flex-1 pb-9">
          <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 xl:pl-6 xl:pr-14">
            <!-- AdBanner Nằm Ngay Phía Trên Của Cả Hero Slider Lẫn Right Sidebar -->
            <AdBanner v-if="!isAdminPage && !hideRightSidebar" class="mb-9" />
            <div class="flex justify-center gap-9">
              <div class="min-w-0 flex-1 w-full">
                <slot />
              </div>

              <!-- RightSidebar Container trên Desktop -->
              <aside v-if="!hideRightSidebar" class="hidden w-72 max-w-125 shrink-0 xl:block">
                <div class="sticky top-20">
                  <RightSidebar />
                </div>
              </aside>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>

    <!-- Modals & Toasts Global Overlay -->
    <ClientOnly>
      <LazySearchModal />
      <LazyLanguageModal />
      <LazyFloatingTopButton />
      <AppToast />
    </ClientOnly>
  </div>
</template>
