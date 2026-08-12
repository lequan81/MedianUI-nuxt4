import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const state = reactive({
    isSidebarCollapsed: true,
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isDarkMode: false,
    viewMode: 'grid' as 'grid' | 'list',
    bookmarkedPostIds: [1, 3] as number[],
  })

  // Actions
  function toggleSidebar() {
    state.isSidebarCollapsed = !state.isSidebarCollapsed
  }

  function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen
  }

  function closeMobileMenu() {
    state.isMobileMenuOpen = false
  }

  function toggleSearchModal() {
    state.isSearchOpen = !state.isSearchOpen
  }

  function closeSearchModal() {
    state.isSearchOpen = false
  }

  function initTheme() {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('median_theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDocDark = document.documentElement.classList.contains('dark')

      if (savedTheme === 'dark' || (!savedTheme && systemDark) || isDocDark) {
        state.isDarkMode = true
        document.documentElement.classList.add('dark')
      } else {
        state.isDarkMode = false
        document.documentElement.classList.remove('dark')
      }
    }
  }

  function toggleDarkMode() {
    if (import.meta.client) {
      const isCurrentlyDark = document.documentElement.classList.contains('dark')
      const targetState = !isCurrentlyDark

      state.isDarkMode = targetState
      if (targetState) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('median_theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('median_theme', 'light')
      }
    } else {
      state.isDarkMode = !state.isDarkMode
    }
  }

  function setViewMode(mode: 'grid' | 'list') {
    state.viewMode = mode
  }

  function toggleBookmark(postId: number) {
    const index = state.bookmarkedPostIds.indexOf(postId)
    if (index > -1) {
      state.bookmarkedPostIds.splice(index, 1)
    } else {
      state.bookmarkedPostIds.push(postId)
    }
  }

  function isBookmarked(postId: number) {
    return state.bookmarkedPostIds.includes(postId)
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
    isBookmarked
  }
})
