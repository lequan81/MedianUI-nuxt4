<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from '~/components/ui/icon/AppIcon.vue'

const isVisible = ref(false)
let lastScrollY = 0

let rafId: number | null = null

function checkScroll() {
  if (!import.meta.client) return
  if (window.innerWidth >= 640) {
    isVisible.value = false
    return
  }

  const y = window.scrollY || document.documentElement.scrollTop || 0

  if (y <= 200) {
    isVisible.value = false
  } else {
    if (y < lastScrollY - 4) {
      isVisible.value = false
    } else if (y > lastScrollY + 4) {
      isVisible.value = true
    }
  }

  lastScrollY = y
}

function handleScroll() {
  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      checkScroll()
      rafId = null
    })
  }
}

function scrollToTop() {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    isVisible.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    lastScrollY = window.scrollY || 0
    checkScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
    if (rafId) cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <button
    type="button"
    class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 sm:hidden"

    :class="isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'"
    aria-label="Về đầu trang"
    title="Về đầu trang"
    @click="scrollToTop"
  >
    <AppIcon name="arrow-up" :size="18" class="stroke-[2.5]" />
  </button>
</template>
