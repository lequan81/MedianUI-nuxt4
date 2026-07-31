<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "#imports";
import {
  getPostImage,
  getPostPath,
  sortPinnedFirst,
} from "~/composables/usePosts";
import { postText } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";
import WidgetTitle from "~/components/ui/WidgetTitle.vue";

const route = useRoute();
const currentSlide = ref(0);

const { data: posts } = await useAsyncData("home-posts", () =>
  queryCollection("posts").all(),
);

const selectedCategory = computed(() => String(route.query.category || ""));
const orderedPosts = computed(() => sortPinnedFirst(posts.value || []));
const filteredPosts = computed(() => {
  if (!selectedCategory.value) return orderedPosts.value;
  return orderedPosts.value.filter(
    (post: any) => post.category === selectedCategory.value,
  );
});
const sliderPosts = computed(() => orderedPosts.value.slice(0, 4));
const pinnedPosts = computed(() =>
  filteredPosts.value.filter((post: any) => post.pinned),
);
const storyPosts = computed(() =>
  filteredPosts.value.filter((post: any) => !post.pinned),
);

let autoplayTimer: ReturnType<typeof setInterval> | null = null;

function nextSlide() {
  if (!sliderPosts.value.length) return;
  currentSlide.value = (currentSlide.value + 1) % sliderPosts.value.length;
}

function prevSlide() {
  if (!sliderPosts.value.length) return;
  currentSlide.value =
    currentSlide.value === 0
      ? sliderPosts.value.length - 1
      : currentSlide.value - 1;
}

onMounted(() => {
  autoplayTimer = setInterval(nextSlide, 5200);
});

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer);
});
</script>

<template>
  <div>
    <section v-if="sliderPosts.length" class="mb-(--content-space)">
      <div
        class="relative overflow-hidden rounded-(--slider-bd-radius) bg-bg-sec shadow-md"
      >
        <div
          class="relative aspect-16/7 min-h-65 overflow-hidden md:aspect-16/6"
        >
          <TransitionGroup name="fade" tag="div" class="h-full w-full">
            <article
              v-for="(post, index) in sliderPosts"
              v-show="currentSlide === index"
              :key="post.path"
              class="absolute inset-0"
            >
              <NuxtLink
                :to="getPostPath(post)"
                class="group relative block h-full w-full"
              >
                <img
                  :src="getPostImage(post)"
                  :alt="post.title"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="eager"
                />
                <div
                  class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/85 via-black/35 to-transparent p-5 sm:p-7"
                >
                  <span
                    class="mb-2 w-fit rounded-[3px] bg-primary px-2.5 py-1 text-xs font-medium text-white"
                  >
                    {{ post.category }}
                  </span>
                  <h2
                    class="line-clamp-2 max-w-3xl text-lg font-semibold leading-snug text-white sm:text-xl lg:text-2xl"
                  >
                    {{ post.title }}
                  </h2>
                  <div
                    class="mt-2 flex items-center gap-2 text-xs text-slate-200/90"
                  >
                    <span>{{ post.date }}</span>
                    <span>/</span>
                    <span>{{ post.readTime }}</span>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </TransitionGroup>

          <button
            type="button"
            class="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-primary"
            title="Previous slide"
            @click="prevSlide"
          >
            <AppIcon name="chevron-left" :size="20" />
          </button>
          <button
            type="button"
            class="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-primary"
            title="Next slide"
            @click="nextSlide"
          >
            <AppIcon name="chevron-right" :size="20" />
          </button>
        </div>
      </div>

      <div class="my-3 flex h-3 items-center justify-center">
        <div class="flex items-center gap-1.5">
          <button
            v-for="(_, index) in sliderPosts"
            :key="index"
            type="button"
            :class="[
              'h-1.5 rounded-full border-0 p-0 transition-all duration-200',
              currentSlide === index
                ? 'w-5 bg-primary'
                : 'w-1.5 bg-text-alt/40',
            ]"
            :aria-label="`Go to slide ${index + 1}`"
            @click="currentSlide = index"
          ></button>
        </div>
      </div>
    </section>

    <section v-if="pinnedPosts.length" class="mb-(--content-space)">
      <WidgetTitle :title="postText.pinnedTitle" />

      <div class="space-y-6">
        <article
          v-for="post in pinnedPosts"
          :key="post.path"
          class="group grid gap-5 sm:grid-cols-[minmax(220px,288px)_1fr]"
        >
          <NuxtLink
            :to="getPostPath(post)"
            class="relative block aspect-video overflow-hidden rounded-(--content-bd-radius) bg-bg-sec"
          >
            <img
              :src="getPostImage(post)"
              :alt="post.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <span
              class="absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-full bg-white px-2 text-xs font-medium text-slate-800 shadow-md"
            >
              {{ post.comments || 0 }}
              <AppIcon name="book-open-text" :size="13" />
            </span>
          </NuxtLink>

          <div class="flex min-w-0 flex-col justify-center">
            <div class="mb-1 text-xs text-text-alt">
              <span>in </span>
              <NuxtLink
                :to="`/?category=${encodeURIComponent(post.category)}`"
                class="font-medium text-primary hover:underline"
              >
                {{ post.category }}
              </NuxtLink>
            </div>
            <h2
              class="line-clamp-2 text-lg font-semibold leading-snug text-text-main lg:text-xl"
            >
              <NuxtLink
                :to="getPostPath(post)"
                class="transition-colors group-hover:text-primary"
              >
                {{ post.title }}
              </NuxtLink>
            </h2>
            <p
              v-if="post.snippet"
              class="my-2 line-clamp-2 text-sm leading-relaxed text-text-alt"
            >
              {{ post.snippet }}
            </p>
            <div class="text-xs text-text-alt">{{ post.date }}</div>
          </div>
        </article>
      </div>
    </section>

    <section>
      <div class="flex items-start justify-between gap-4">
        <WidgetTitle
          :title="
            selectedCategory
              ? `${postText.allStoriesTitle}: ${selectedCategory}`
              : postText.allStoriesTitle
          "
        />
        <NuxtLink
          v-if="selectedCategory"
          to="/"
          class="text-xs font-medium text-primary hover:underline"
        >
          Clear
        </NuxtLink>
      </div>

      <div
        v-if="storyPosts.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="post in storyPosts"
          :key="post.path"
          class="group flex min-w-0 flex-col"
        >
          <NuxtLink
            :to="getPostPath(post)"
            class="relative mb-3 block aspect-video overflow-hidden rounded-(--content-bd-radius) bg-bg-sec"
          >
            <img
              :src="getPostImage(post)"
              :alt="post.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div
              class="absolute right-2 top-2 flex items-center gap-1.5 text-xs"
            >
              <span
                v-if="post.isProduct"
                class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-800 shadow-md"
              >
                <AppIcon name="tag" :size="14" />
              </span>
              <span
                v-if="post.discount"
                class="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white shadow-md"
              >
                {{ post.discount }}
              </span>
            </div>
          </NuxtLink>

          <div class="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div class="mb-1 text-xs text-text-alt">
                <span>in </span>
                <NuxtLink
                  :to="`/?category=${encodeURIComponent(post.category)}`"
                  class="font-medium text-primary hover:underline"
                >
                  {{ post.category }}
                </NuxtLink>
              </div>
              <h2
                class="line-clamp-2 text-base font-medium leading-snug text-text-main"
              >
                <NuxtLink
                  :to="getPostPath(post)"
                  class="transition-colors group-hover:text-primary"
                >
                  {{ post.title }}
                </NuxtLink>
              </h2>
              <p
                v-if="post.snippet"
                class="my-1.5 line-clamp-2 text-xs leading-relaxed text-text-alt lg:text-sm"
              >
                {{ post.snippet }}
              </p>
            </div>

            <div
              class="mt-2 flex items-center justify-between border-t border-border-main/60 pt-2 text-xs text-text-alt"
            >
              <span>{{ post.date }}</span>
              <div v-if="post.price" class="flex items-center gap-1.5">
                <span class="text-[11px] text-text-alt line-through">{{
                  post.price.original
                }}</span>
                <span class="font-semibold text-primary">{{
                  post.price.sale
                }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div
        v-else
        class="border border-border-main bg-bg-sec p-8 text-center text-sm text-text-alt"
      >
        Không có bài viết trong danh mục này.
      </div>
    </section>
  </div>
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
