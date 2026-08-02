<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAppStore } from "~/stores/useAppStore";
import { useLangStore } from "~/stores/useLangStore";
import { siteConfig } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";

const appStore = useAppStore();
const langStore = useLangStore();

const isLangOpen = ref(false);
const langDropdownRef = ref<HTMLElement | null>(null);

const currentFlag = computed(() => {
  return langStore.currentLang === 'vi' ? '🇻🇳' : '🇺🇸';
});

function selectLang(lang: 'vi' | 'en') {
  langStore.setLanguage(lang);
  isLangOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (langDropdownRef.value && !langDropdownRef.value.contains(event.target as Node)) {
    isLangOpen.value = false;
  }
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("click", handleClickOutside);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", handleClickOutside);
  }
});
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-(--header-height) w-full items-center gap-3.75 border-b border-border-main bg-bg-base/95 text-text-main backdrop-blur-md"
  >
    <div class="flex h-full w-(--side-width-expand) shrink-0 items-center">
      <button
        type="button"
        class="flex h-full w-(--side-width) items-center justify-center text-text-alt transition-colors hover:text-primary focus:outline-none focus-visible:outline-none outline-none border-none shadow-none cursor-pointer"
        aria-label="Toggle sidebar"
        @click="appStore.toggleSidebar"
      >
        <AppIcon name="panel-left" :size="20" />
      </button>

      <div class="min-w-0 pr-4">
        <h1 class="truncate text-[1.143em] font-medium leading-normal">
          <NuxtLink to="/" class="transition-colors hover:text-primary">
            {{ siteConfig.shortName }}
          </NuxtLink>
        </h1>
      </div>
    </div>

    <div class="flex min-w-0 flex-1 items-center gap-3 pr-(--content-padding)">
      <button
        type="button"
        class="group flex h-9 min-w-0 flex-[0_1_320px] items-center rounded-lg px-2 text-left text-[13px] text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
        @click="appStore.toggleSearchModal"
      >
        <span class="flex h-9 w-8 shrink-0 items-center justify-center">
          <AppIcon name="search" :size="16" />
        </span>
        <span class="hidden truncate md:inline">{{
          siteConfig.searchPlaceholder
        }}</span>
      </button>

      <div class="ml-auto flex items-center justify-end gap-1">
        <!-- Language Switcher Dropdown (Median UI x Preline UI Vibe Với Cờ Quốc Gia) -->
        <div ref="langDropdownRef" class="relative">
          <button
            type="button"
            class="flex h-(--icon-height) items-center gap-1.5 px-2.5 text-xs font-semibold text-text-alt transition-colors hover:text-primary cursor-pointer"
            :title="langStore.currentLang === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'"
            :aria-label="langStore.currentLang === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'"
            @click.stop="isLangOpen = !isLangOpen"
          >
            <span class="text-sm leading-none shrink-0">{{ currentFlag }}</span>
            <span class="text-[11px] font-bold uppercase tracking-wider text-text-main">{{ langStore.currentLang }}</span>
            <AppIcon
              name="chevron-down"
              :size="12"
              class="text-text-muted transition-transform duration-200"
              :class="{ 'rotate-180 text-primary': isLangOpen }"
            />
          </button>

          <!-- Dropdown Menu Card Popover -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-1"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-1"
          >
            <div
              v-if="isLangOpen"
              class="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border-main bg-bg-alt p-1.5 shadow-md backdrop-blur-md z-50 space-y-0.5"
            >
              <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border-subtle mb-1">
                Ngôn ngữ / Language
              </div>

              <button
                type="button"
                class="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer"
                :class="langStore.currentLang === 'vi' ? 'bg-primary-subtle text-primary font-bold' : 'text-text-main hover:bg-bg-sec hover:text-primary'"
                @click="selectLang('vi')"
              >
                <div class="flex items-center gap-2">
                  <span class="text-base leading-none">🇻🇳</span>
                  <span>Tiếng Việt</span>
                </div>
                <span v-if="langStore.currentLang === 'vi'" class="text-xs font-bold text-primary">✓</span>
              </button>

              <button
                type="button"
                class="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer"
                :class="langStore.currentLang === 'en' ? 'bg-primary-subtle text-primary font-bold' : 'text-text-main hover:bg-bg-sec hover:text-primary'"
                @click="selectLang('en')"
              >
                <div class="flex items-center gap-2">
                  <span class="text-base leading-none">🇺🇸</span>
                  <span>English</span>
                </div>
                <span v-if="langStore.currentLang === 'en'" class="text-xs font-bold text-primary">✓</span>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Original Median UI Theme Toggle Button (Giữ Nguyên Chuẩn 100% Vibe Gốc) -->
        <button
          type="button"
          class="flex h-(--icon-height) w-(--icon-width) items-center justify-center text-text-alt transition-colors hover:text-primary cursor-pointer"
          :title="
            appStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          "
          :aria-label="
            appStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          "
          @click="appStore.toggleDarkMode"
        >
          <AppIcon :name="appStore.isDarkMode ? 'sun' : 'moon'" :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>
