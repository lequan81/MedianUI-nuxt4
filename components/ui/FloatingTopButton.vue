<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from '~/components/ui/AppIcon.vue'

const isVisible = ref(false)

function checkScroll() {
  if (typeof window === 'undefined') return
  const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
  isVisible.value = y > 150
}

function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
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
    class="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 flex lg:hidden h-9.5 w-9.5 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 border border-white/20 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
    :class="isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'"
    aria-label="Về đầu trang"
    title="Về đầu trang"
    @click="scrollToTop"
  >
    <AppIcon name="arrow-up" :size="18" class="stroke-[2.5]" />
  </button>
</template>
