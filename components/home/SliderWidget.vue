<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import { getPostImage, getPostPath } from "~/composables/usePosts";
import { useTimeout } from "~/composables/useTimeout";

const props = withDefaults(
    defineProps<{
        posts?: any[];
    }>(),
    {
        posts: () => [],
    },
);

const currentSlide = ref(0);
const isPaused = ref(false);
const AUTOPLAY_INTERVAL_MS = 5200;

const { set: setSlideTimer, clear: clearSlideTimer } = useTimeout();

function scheduleNextSlide() {
    clearSlideTimer();
    if (isPaused.value || !props.posts || props.posts.length <= 1) return;

    setSlideTimer(() => {
        advanceSlide();
        scheduleNextSlide();
    }, AUTOPLAY_INTERVAL_MS);
}

function advanceSlide() {
    if (!props.posts || !props.posts.length) return;
    currentSlide.value = (currentSlide.value + 1) % props.posts.length;
}

function nextSlideManual() {
    advanceSlide();
    scheduleNextSlide();
}

function prevSlideManual() {
    if (!props.posts || !props.posts.length) return;
    currentSlide.value =
        currentSlide.value === 0
            ? props.posts.length - 1
            : currentSlide.value - 1;
    scheduleNextSlide();
}

function selectSlide(index: number) {
    currentSlide.value = index;
    scheduleNextSlide();
}

function onMouseEnter() {
    isPaused.value = true;
    clearSlideTimer();
}

function onMouseLeave() {
    isPaused.value = false;
    scheduleNextSlide();
}

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function onTouchStart(e: TouchEvent) {
    touchStartX = e.changedTouches[0]?.screenX || 0;
    onMouseEnter();
}

function onTouchEnd(e: TouchEvent) {
    touchEndX = e.changedTouches[0]?.screenX || 0;
    handleSwipe();
    onMouseLeave();
}

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
            nextSlideManual(); // Swiped left -> next
        } else {
            prevSlideManual(); // Swiped right -> prev
        }
    }
}

function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
        clearSlideTimer();
    } else if (!isPaused.value) {
        scheduleNextSlide();
    }
}

function preloadSlideImages() {
    if (!import.meta.client || !props.posts || !props.posts.length) return;
    props.posts.forEach((post) => {
        const url = getPostImage(post);
        if (url) {
            const img = new Image();
            img.src = url;
            if (typeof img.decode === "function") {
                img.decode().catch(() => { });
            }
        }
    });
}

onMounted(() => {
    preloadSlideImages();
    scheduleNextSlide();
    document.addEventListener("visibilitychange", onVisibilityChange);
});

onUnmounted(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
});
</script>

<template>
    <section v-if="posts && posts.length" class="mb-8" aria-label="Bài viết nổi bật">
        <div class="relative overflow-hidden rounded-xl bg-bg-sec border border-border-subtle shadow-xs select-none"
            @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd">
            <div class="relative aspect-[2.35/1] min-h-52 overflow-hidden sm:min-h-60">
                <div class="h-full w-full relative">
                    <article
                        v-for="(post, index) in posts"
                        :key="post.path || index"
                        :class="[
                            'absolute inset-0 transition-opacity duration-500 ease-in-out',
                            currentSlide === index
                                ? 'opacity-100 z-10 pointer-events-auto'
                                : 'opacity-0 z-0 pointer-events-none',
                        ]"
                        :aria-hidden="currentSlide !== index"
                    >
                        <NuxtLink :to="getPostPath(post)" :aria-label="post.title"
                            class="group relative block h-full w-full">
                            <NuxtImg
                                :src="getPostImage(post)"
                                :alt="post.title"
                                class="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                :loading="index === 0 ? 'eager' : 'lazy'"
                                :fetchpriority="index === 0 ? 'high' : 'auto'"
                                format="webp"
                                quality="85"
                                sizes="sm:100vw md:800px lg:1200px"
                                width="1200"
                                height="510"
                            />
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
                                <div
                                    class="mt-1.5 flex items-center gap-2 text-xs text-slate-200 font-medium opacity-90">
                                    <span v-if="post.date">{{ post.date }}</span>
                                    <span v-if="post.date && post.readTime">•</span>
                                    <span v-if="post.readTime">{{ post.readTime }}</span>
                                </div>
                            </div>
                        </NuxtLink>
                    </article>
                </div>

                <!-- Touch-optimized Navigation Buttons (min 44x44px) -->
                <button type="button"
                    class="absolute left-3 top-1/2 z-20 flex h-11 w-11 min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-primary hover:scale-105 active:scale-95 cursor-pointer border border-white/20 shadow-md"
                    aria-label="Slide trước đó" @click.stop="prevSlideManual">
                    <AppIcon name="chevron-left" :size="20" />
                </button>
                <button type="button"
                    class="absolute right-3 top-1/2 z-20 flex h-11 w-11 min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-primary hover:scale-105 active:scale-95 cursor-pointer border border-white/20 shadow-md"
                    aria-label="Slide tiếp theo" @click.stop="nextSlideManual">
                    <AppIcon name="chevron-right" :size="20" />
                </button>
            </div>
        </div>

        <!-- Slide Indicator Dots (Visual only, aria-hidden to eliminate mobile tap target size penalties) -->
        <div class="my-2 flex h-3 items-center justify-center" aria-hidden="true">
            <div class="flex items-center gap-1.5">
                <div
                    v-for="(_, index) in posts"
                    :key="index"
                    :class="[
                        'h-1 rounded-full border-0 p-0 transition-all duration-200 cursor-pointer select-none',
                        currentSlide === index
                            ? 'w-4 bg-primary'
                            : 'w-1 bg-border-main hover:bg-text-muted',
                    ]"
                    @click="selectSlide(index)"
                ></div>
            </div>
        </div>
    </section>
</template>
