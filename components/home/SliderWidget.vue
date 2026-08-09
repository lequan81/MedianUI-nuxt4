<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import { getPostImage, getPostPath } from "~/composables/usePosts";

const props = withDefaults(
  defineProps<{
    posts?: any[];
  }>(),
  {
    posts: () => [],
  },
);

const currentSlide = ref(0);
let autoplayTimer: ReturnType<typeof setInterval> | null = null;
const AUTOPLAY_INTERVAL_MS = 5200;

function startAutoplay() {
  stopAutoplay();
  if (props.posts && props.posts.length > 1) {
    autoplayTimer = setInterval(() => {
      advanceSlide();
    }, AUTOPLAY_INTERVAL_MS);
  }
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function advanceSlide() {
  if (!props.posts || !props.posts.length) return;
  currentSlide.value = (currentSlide.value + 1) % props.posts.length;
}

function nextSlideManual() {
  advanceSlide();
  startAutoplay(); // Reset timer on manual user click
}

function prevSlideManual() {
  if (!props.posts || !props.posts.length) return;
  currentSlide.value =
    currentSlide.value === 0
      ? props.posts.length - 1
      : currentSlide.value - 1;
  startAutoplay(); // Reset timer on manual user click
}

function selectSlide(index: number) {
  currentSlide.value = index;
  startAutoplay(); // Reset timer on manual dot selection
}

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <section v-if="posts && posts.length" class="mb-8" aria-label="Bài viết nổi bật">
    <div class="relative overflow-hidden rounded-lg bg-bg-sec border border-border-subtle shadow-xs">
      <div class="relative aspect-[2.35/1] min-h-52 overflow-hidden sm:min-h-60">
        <TransitionGroup name="fade" tag="div" class="h-full w-full">
          <article v-for="(post, index) in posts" v-show="currentSlide === index" :key="post.path || index"
            class="absolute inset-0">
            <NuxtLink :to="getPostPath(post)" :aria-label="post.title" class="group relative block h-full w-full">
              <NuxtImg :src="getPostImage(post)" :alt="post.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager" fetchpriority="high" format="webp" quality="85" sizes="sm:100vw md:800px lg:1200px"
                width="1200" height="510" />
              <div
                class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/35 to-transparent p-4 sm:p-6">
                <span v-if="post.category"
                  class="mb-1.5 w-fit rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs">
                  {{ post.category }}
                </span>
                <h2
                  class="line-clamp-2 max-w-3xl text-base font-bold leading-snug text-white sm:text-xl lg:text-2xl drop-shadow-sm">
                  {{ post.title }}
                </h2>
                <div class="mt-1.5 flex items-center gap-2 text-xs text-slate-200 font-medium opacity-90">
                  <span v-if="post.date">{{ post.date }}</span>
                  <span v-if="post.date && post.readTime">•</span>
                  <span v-if="post.readTime">{{ post.readTime }}</span>
                </div>
              </div>
            </NuxtLink>
          </article>
        </TransitionGroup>

        <!-- Touch-optimized Navigation Buttons (min 44x44px) -->
        <button type="button"
          class="absolute left-3 top-1/2 z-20 flex h-11 w-11 min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-primary hover:scale-105 active:scale-95 cursor-pointer border border-white/20 shadow-md"
          aria-label="Slide trước đó" @click="prevSlideManual">
          <AppIcon name="chevron-left" :size="20" />
        </button>
        <button type="button"
          class="absolute right-3 top-1/2 z-20 flex h-11 w-11 min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-primary hover:scale-105 active:scale-95 cursor-pointer border border-white/20 shadow-md"
          aria-label="Slide tiếp theo" @click="nextSlideManual">
          <AppIcon name="chevron-right" :size="20" />
        </button>

      </div>
    </div>

    <!-- Slide Indicator Dots (Chuẩn UI/UX Median UI 1.7 gốc dạng div) -->
    <div class="my-2 flex h-3 items-center justify-center">
      <div class="flex items-center gap-1.5">
        <div v-for="(_, index) in posts" :key="index" tabindex="0" :class="[
          'h-1 rounded-full border-0 p-0 transition-all duration-200 cursor-pointer select-none',
          currentSlide === index
            ? 'w-4 bg-primary'
            : 'w-1 bg-border-main hover:bg-text-muted',
        ]" :aria-label="`Chuyển tới slide ${index + 1}`" @click="selectSlide(index)"
          @keydown.enter.prevent="selectSlide(index)" @keydown.space.prevent="selectSlide(index)"></div>
      </div>
    </div>


  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
