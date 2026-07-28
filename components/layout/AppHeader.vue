<script setup lang="ts">
import { useAppStore } from '~/stores/useAppStore'

const appStore = useAppStore()
</script>

<template>
  <!-- mainH: 65px header -->
  <header class="mainH sticky top-0 z-40 w-full flex items-center bg-[var(--color-bg-base)] border-b border-[var(--color-border-main)]" style="height: var(--header-height); gap: 15px;">

    <!-- headL -->
    <div class="flex items-center h-full" style="width: var(--side-width-expand);">
      <!-- Hamburger menu button -->
      <button 
        @click="appStore.toggleSidebar" 
        class="flex items-center justify-center h-full text-slate-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
        style="padding-inline-start: calc((var(--side-width) - var(--icon-width)) / 2); width: auto;"
        aria-label="Toggle Menu"
      >
        <span class="inline-flex items-center justify-center" style="width: var(--icon-width); height: var(--icon-height);">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </span>
      </button>

      <!-- Logo inside headI > h1.headN > a.headt (Chuẩn XML Median UI) -->
      <div class="headI flex items-center">
        <h1 class="headN m-0 p-0 font-medium text-[1.143em] leading-normal text-slate-100">
          <NuxtLink to="/" class="headt text-inherit no-underline hover:brightness-90">
            Median UI
          </NuxtLink>
        </h1>
      </div>
    </div>

    <!-- headR -->
    <div class="flex items-center flex-grow gap-[15px]" style="width: calc(100% - (var(--side-width-expand) + 15px)); padding-inline-end: var(--content-padding);">
      <!-- Search input -->
      <div class="flex-1">
        <div 
          @click="appStore.toggleSearchModal" 
          class="relative flex items-center rounded-[var(--content-bd-radius-alt)] overflow-hidden cursor-pointer"
          style="margin-inline: -10px;"
        >
          <span class="inline-flex items-center justify-center text-slate-400" style="min-width: 40px; height: 42px;">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <span class="text-[13px] text-slate-400 hidden md:inline">e.g. Typography</span>
        </div>
      </div>

      <!-- Right Action Icons -->
      <div class="flex items-center justify-end gap-[2px] relative ml-auto" style="margin-inline-end: -8px;">
        <!-- Theme toggle: Crescent Moon Outline -->
        <button 
          @click="appStore.toggleDarkMode" 
          class="inline-flex items-center justify-center text-slate-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          style="width: var(--icon-width); height: var(--icon-height);"
          title="Toggle Theme"
        >
          <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>

        <!-- Bookmark ribbon Outline Icon -->
        <button 
          class="ibook relative inline-flex items-center justify-center text-slate-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          style="width: var(--icon-width); height: var(--icon-height);"
          title="Saved Bookmarks"
        >
          <span class="bc relative inline-flex items-center justify-center">
            <svg class="relative z-0" style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            <span 
              class="absolute flex items-center justify-center font-medium text-[10px] text-[var(--color-primary)] bg-[var(--color-bg-base)] rounded-full z-10"
              style="top: 0px; right: 0px; width: 14px; height: 14px;"
            >
              {{ appStore.bookmarkedPostIds.length }}
            </span>
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
