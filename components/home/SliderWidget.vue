<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  totalSlides?: number
}>(), {
  totalSlides: 4
})

const currentSlide = ref(3)
</script>

<template>
  <section class="section mb-(--content-space)">
    <div class="slideB rounded-(--slider-bd-radius) overflow-hidden">
      <div class="slider-box relative pt-(--slider-ratio) bg-[#e0e0e0] dark:bg-[#1e293b] rounded-(--slider-bd-radius) transition-colors">
        <span class="absolute inset-0 flex items-center justify-center text-[#4a4a4a] dark:text-[#94a3b8] text-sm font-medium">
          Slider {{ currentSlide }}
        </span>
      </div>
    </div>

    <!-- slideI: ONLY 4 DOTS -->
    <div class="slideI flex items-center justify-center h-3 my-2">
      <div class="flex items-center gap-1.25">
        <button 
          v-for="i in totalSlides" 
          :key="i" 
          @click="currentSlide = i" 
          :class="[
            'h-1 rounded-full transition-all duration-200 border-0 p-0 cursor-pointer',
            currentSlide === i ? 'bg-primary w-3' : 'bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] w-1'
          ]" 
          :aria-label="'Go to slide ' + i"
        ></button>
      </div>
    </div>
  </section>
</template>
