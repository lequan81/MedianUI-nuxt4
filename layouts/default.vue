<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "~/stores/useAppStore";
import AppHeader from "~/components/layout/AppHeader.vue";
import AppSidebar from "~/components/layout/AppSidebar.vue";
import RightSidebar from "~/components/layout/RightSidebar.vue";
import MobileNav from "~/components/layout/MobileNav.vue";
import SearchModal from "~/components/ui/SearchModal.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import AdBanner from "~/components/ui/AdBanner.vue";

const appStore = useAppStore();

onMounted(() => {
  appStore.initTheme();
});
</script>

<template>
  <div id="top" class="min-h-screen bg-bg-base text-text-main antialiased">
    <AppHeader />

    <div class="flex min-h-[calc(100vh-var(--header-height))]">
      <AppSidebar />

      <div class="min-w-0 flex-1 transition-[margin] duration-200 ease-out"
        :class="appStore.isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'">
        <main class="pb-(--content-space)">
          <div class="mx-auto mt-(--content-padding) max-w-310 px-6 xl:pl-6 xl:pr-14">
            <AdBanner class="mb-(--content-space)" />

            <div class="flex justify-center gap-(--content-space)">
              <div class="min-w-0 flex-1 xl:w-[calc(100%-var(--sidebar-width)-var(--content-space))]">
                <slot />
              </div>

              <aside class="hidden w-(--sidebar-width) max-w-125 shrink-0 xl:block">
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
