<script setup lang="ts">
import { computed, ref } from "vue";
import {
  getLabelCounts,
  getPostImage,
  getPostPath,
  sortPopularPosts,
} from "~/composables/usePosts";
import AppIcon from "~/components/ui/AppIcon.vue";
import WidgetTitle from "~/components/ui/WidgetTitle.vue";

const { data: posts } = await useAsyncData("right-sidebar-posts", () =>
  queryCollection("posts").all(),
);

const isAllLabelsVisible = ref(false);

const popularPosts = computed(() =>
  sortPopularPosts(posts.value || []).slice(0, 5),
);
const labels = computed(() => getLabelCounts(posts.value || []));
const visibleLabels = computed(() =>
  isAllLabelsVisible.value ? labels.value : labels.value.slice(0, 8),
);
</script>

<template>
  <div class="space-y-12">
    <section class="pt-1">
      <WidgetTitle title="Popular Posts" />

      <div class="flex flex-col gap-4">
        <article v-if="popularPosts[0]" class="flex flex-col gap-3">
          <div
            class="relative overflow-hidden rounded-(--content-bd-radius) bg-bg-sec"
          >
            <NuxtLink
              :to="getPostPath(popularPosts[0])"
              class="block aspect-video"
            >
              <img
                :src="getPostImage(popularPosts[0])"
                :alt="popularPosts[0].title"
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </NuxtLink>
            <div
              class="absolute right-2 top-2 flex items-center gap-1.5 text-xs"
            >
              <span
                class="flex h-7 items-center gap-1 rounded-full bg-white px-2 text-slate-800 shadow-md"
              >
                <span>{{ popularPosts[0].comments || 0 }}</span>
                <AppIcon name="book-open-text" :size="13" />
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <span class="w-6 shrink-0 text-sm font-bold text-text-alt/70"
              >01</span
            >
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-baseline text-xs text-text-alt">
                <span>{{ popularPosts[0].date }}</span>
                <span class="mx-1">/</span>
                <span class="font-medium text-primary">{{
                  popularPosts[0].category
                }}</span>
              </div>
              <h2
                class="line-clamp-2 text-base font-medium leading-snug text-text-main"
              >
                <NuxtLink
                  :to="getPostPath(popularPosts[0])"
                  class="transition-colors hover:text-primary"
                >
                  {{ popularPosts[0].title }}
                </NuxtLink>
              </h2>
              <p
                v-if="popularPosts[0].snippet"
                class="mt-1 line-clamp-2 text-xs leading-relaxed text-text-alt"
              >
                {{ popularPosts[0].snippet }}
              </p>
            </div>
          </div>
        </article>

        <article
          v-for="(post, index) in popularPosts.slice(1)"
          :key="post.path"
          class="flex gap-2"
        >
          <span class="w-6 shrink-0 text-sm font-bold text-text-alt/70">
            {{ String(index + 2).padStart(2, "0") }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="mb-0.5 flex items-baseline text-xs text-text-alt">
              <span>{{ post.date }}</span>
              <span class="mx-1">/</span>
              <span class="font-medium text-primary">{{ post.category }}</span>
            </div>
            <h2
              class="line-clamp-2 text-base font-medium leading-snug text-text-main"
            >
              <NuxtLink
                :to="getPostPath(post)"
                class="transition-colors hover:text-primary"
              >
                {{ post.title }}
              </NuxtLink>
            </h2>
          </div>
        </article>
      </div>
    </section>

    <section class="pt-1">
      <WidgetTitle title="Labels" />

      <div class="grid grid-cols-2 gap-2">
        <NuxtLink
          v-for="label in visibleLabels"
          :key="label.name"
          :to="`/?category=${encodeURIComponent(label.name)}`"
          class="flex min-w-0 items-center justify-between gap-2 border border-border-main bg-bg-sec p-2.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
        >
          <span class="truncate">{{ label.name }}</span>
          <span class="inline-flex shrink-0 items-center gap-1 text-text-alt">
            {{ label.count }}
            <AppIcon name="tag" :size="12" />
          </span>
        </NuxtLink>
      </div>

      <button
        v-if="labels.length > 8"
        type="button"
        class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        @click="isAllLabelsVisible = !isAllLabelsVisible"
      >
        <span>{{ isAllLabelsVisible ? "Show less" : "Show all" }}</span>
        <span v-if="!isAllLabelsVisible" class="text-text-alt"
          >(+{{ labels.length - 8 }})</span
        >
      </button>
    </section>

    <div class="pt-2 text-center text-xs text-text-alt/70">Ads go here</div>
  </div>
</template>
