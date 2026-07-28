<script setup lang="ts">
import { useAppStore } from '~/stores/useAppStore'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import RightSidebar from '~/components/layout/RightSidebar.vue'
import MobileNav from '~/components/layout/MobileNav.vue'
import SearchModal from '~/components/ui/SearchModal.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="nB min-h-screen flex flex-col bg-[var(--color-bg-base)] text-[var(--color-text-main)] antialiased">
    <!-- mainH: Sticky Header (65px) -->
    <AppHeader />

    <!-- mainN: Main body container -->
    <div class="mainN flex" style="min-height: calc(100vh - var(--header-height));">
      <!-- mainL: Left Sidebar (75px) -->
      <AppSidebar />

      <!-- mainR: Content Area (100% - 75px) -->
      <div class="mainR flex-1 min-w-0" style="width: calc(100% - var(--side-width));">
        <div class="mainC" style="padding-block-end: var(--content-space);">
          <div class="maxC" style="margin-inline: auto; padding-inline: var(--content-padding); max-width: var(--content-max-width); margin-block-start: var(--content-padding);">
            
            <!-- Top Ad Banner: Spans ABOVE both Slider and Popular Posts! -->
            <div class="mainAd text-center text-[11px] text-slate-500 py-2 mb-[var(--content-space)] opacity-60">
              Ads go here
            </div>

            <!-- mainB: 2 Columns side-by-side naturally aligned at same top Y-level -->
            <div class="mainB flex justify-center" style="gap: var(--content-space);">
              <!-- blogB: Main Content Column -->
              <div class="blogB flex-1 min-w-0" style="width: calc(100% - (var(--sidebar-width) + var(--content-space)));">
                <slot />
              </div>

              <!-- sideB: Right Sidebar Column (Starts at exact same top level as blogB!) -->
              <aside 
                class="sideB hidden xl:flex flex-col flex-shrink-0" 
                style="gap: var(--content-space); width: var(--sidebar-width); max-width: 500px;"
              >
                <div class="sideSticky sticky" style="top: calc(var(--header-height) + 10px);">
                  <RightSidebar />
                </div>
              </aside>
            </div>
          </div>
        </div>

        <!-- mainF: Footer -->
        <footer 
          class="mainF relative mt-auto" 
          style="padding-block: 25px; color: var(--color-text-main); background-color: var(--color-bg-base);"
        >
          <div class="absolute top-0 border-t border-[var(--color-border-main)]" style="left: var(--content-padding); right: var(--content-padding);"></div>
          <div class="maxC flex items-center gap-[10px]" style="margin-inline: auto; padding-inline: var(--content-padding); max-width: var(--content-max-width);">
            <span class="mr-auto overflow-hidden text-ellipsis text-[small]">&copy; 2026. Median UI.</span>
            <div class="flex items-center gap-[10px]">
              <a href="#top" class="flex items-center gap-[5px] text-[small] opacity-80">
                Top
                <svg class="line" style="width: 14px; height: 14px;" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
              </a>
              <div class="flex items-center ml-1" style="margin-inline-end: -6px;">
                <span class="inline-flex items-center justify-center opacity-50" style="width: 30px; height: 30px;">
                  <svg style="width: 16px; height: 16px;" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </span>
                <span class="inline-flex items-center justify-center opacity-50" style="width: 30px; height: 30px;">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.25"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
                </span>
                <span class="inline-flex items-center justify-center opacity-50" style="width: 30px; height: 30px;">
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.25"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <MobileNav />
    <SearchModal />
  </div>
</template>
