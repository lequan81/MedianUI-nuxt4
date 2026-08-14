import { defineStore } from "pinia";
import { reactive, computed } from "vue";

export const useAppStore = defineStore("app", () => {
  const themeCookie = useCookie<string>("theme", {
    default: () => "light",
    maxAge: 31536000,
    path: "/",
  });

  // State
  const state = reactive({
    isSidebarCollapsed: true,
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isDarkMode: themeCookie.value === "dark",
    viewMode: "grid" as "grid" | "list",
    bookmarkedPostIds: [1, 3] as number[],
  });

  // Actions
  function toggleSidebar() {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
  }

  function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
  }

  function closeMobileMenu() {
    state.isMobileMenuOpen = false;
  }

  function toggleSearchModal() {
    state.isSearchOpen = !state.isSearchOpen;
  }

  function closeSearchModal() {
    state.isSearchOpen = false;
  }

  function initTheme() {
    if (import.meta.client) {
      const isDocDark = document.documentElement.classList.contains("dark");
      const isDark = themeCookie.value === "dark" || isDocDark;

      state.isDarkMode = isDark;
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }

  function toggleDarkMode() {
    const targetState = !state.isDarkMode;
    state.isDarkMode = targetState;
    themeCookie.value = targetState ? "dark" : "light";

    if (import.meta.client) {
      if (targetState) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }

  function setViewMode(mode: "grid" | "list") {
    state.viewMode = mode;
  }

  function toggleBookmark(postId: number) {
    const index = state.bookmarkedPostIds.indexOf(postId);
    if (index > -1) {
      state.bookmarkedPostIds.splice(index, 1);
    } else {
      state.bookmarkedPostIds.push(postId);
    }
  }

  function isBookmarked(postId: number) {
    return state.bookmarkedPostIds.includes(postId);
  }

  return {
    state,
    isSidebarCollapsed: computed(() => state.isSidebarCollapsed),
    isMobileMenuOpen: computed(() => state.isMobileMenuOpen),
    isSearchOpen: computed(() => state.isSearchOpen),
    isDarkMode: computed(() => state.isDarkMode),
    viewMode: computed(() => state.viewMode),
    bookmarkedPostIds: computed(() => state.bookmarkedPostIds),
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    toggleSearchModal,
    closeSearchModal,
    initTheme,
    toggleDarkMode,
    setViewMode,
    toggleBookmark,
    isBookmarked,
  };
});
