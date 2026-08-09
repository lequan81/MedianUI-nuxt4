<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from '~/components/ui/AppIcon.vue'

const isVisible = ref(false)
let lastScrollY = 0

function checkScroll() {
  if (typeof window === 'undefined') return
  if (window.innerWidth >= 640) {
    isVisible.value = false
    return
  }

  const y = Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  )

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

function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    isVisible.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    lastScrollY = window.scrollY || 0
    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    document.addEventListener('scroll', checkScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', checkScroll)
    document.removeEventListener('scroll', checkScroll)
  }
})
</script>

<template>
  <button
    type="button"
    class="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 sm:hidden"
    :class="isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'"
    aria-label="Về đầu trang"
    title="Về đầu trang"
    @click="scrollToTop"
  >
    <AppIcon name="arrow-up" :size="18" class="stroke-[2.5]" />
  </button>
</template>
