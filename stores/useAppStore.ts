import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const isSidebarCollapsed = ref(true)
  const isMobileMenuOpen = ref(false)
  const isSearchOpen = ref(false)
  const isDarkMode = ref(false)
  const viewMode = ref<'grid' | 'list'>('grid')
  const bookmarkedPostIds = ref<number[]>([1, 3])

  // Actions
  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }

  function toggleSearchModal() {
    isSearchOpen.value = !isSearchOpen.value
  }

  function closeSearchModal() {
    isSearchOpen.value = false
  }

  function initTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('median_theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDocDark = document.documentElement.classList.contains('dark')

      if (savedTheme === 'dark' || (!savedTheme && systemDark) || isDocDark) {
        isDarkMode.value = true
        document.documentElement.classList.add('dark')
      } else {
        isDarkMode.value = false
        document.documentElement.classList.remove('dark')
      }
    }
  }

  function toggleDarkMode() {
    if (typeof window !== 'undefined') {
      // Sync current reality before toggling in case initTheme wasn't called
      const isCurrentlyDark = document.documentElement.classList.contains('dark')
      const targetState = !isCurrentlyDark

      isDarkMode.value = targetState
      if (targetState) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('median_theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('median_theme', 'light')
      }
    } else {
      isDarkMode.value = !isDarkMode.value
    }
  }

  function setViewMode(mode: 'grid' | 'list') {
    viewMode.value = mode
  }

  function toggleBookmark(postId: number) {
    const index = bookmarkedPostIds.value.indexOf(postId)
    if (index > -1) {
      bookmarkedPostIds.value.splice(index, 1)
    } else {
      bookmarkedPostIds.value.push(postId)
    }
  }

  function isBookmarked(postId: number) {
    return bookmarkedPostIds.value.includes(postId)
  }

  return {
    isSidebarCollapsed,
    isMobileMenuOpen,
    isSearchOpen,
    isDarkMode,
    viewMode,
    bookmarkedPostIds,
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
