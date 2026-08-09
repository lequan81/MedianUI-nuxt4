<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, navigateTo } from "#imports";
import {
  getLabelCounts,
  getPostImage,
  getPostPath,
  formatTimeAgo,
  sortPopularPosts,
} from "~/composables/usePosts";
import AppIcon from "~/components/ui/AppIcon.vue";

const route = useRoute();

const { data: posts, status } = await useAsyncData("right-sidebar-posts", () =>
  queryCollection("posts").all(),
);

const isAllLabelsVisible = ref(false);

const hasActiveCategoryFilter = computed(() => {
  return Boolean(route.query.category || route.query.categories);
});

// Tự động sắp xếp theo lượt tương tác/comments từ Database & loại bỏ bài viết đang đọc
const popularPosts = computed(() => {
  const currentSlug = route.params.slug as string | undefined;
  const allPopular = sortPopularPosts(posts.value || []);

  if (!currentSlug) {
    return allPopular.slice(0, 5);
  }

  return allPopular
    .filter((post) => {
      const slug = (post.stem || post.path || "").split("/").filter(Boolean).pop();
      return slug !== currentSlug;
    })
    .slice(0, 5);
});

const labels = computed(() => getLabelCounts(posts.value || []));
const visibleLabels = computed(() =>
  isAllLabelsVisible.value ? labels.value : labels.value.slice(0, 6),
);

// Hỗ trợ chọn nhiều Danh Mục cùng lúc
function toggleCategoryFilter(name: string) {
  const currentParam = String(route.query.category || route.query.categories || "");
  const currentList = currentParam
    ? currentParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const targetLower = name.toLowerCase();

  let nextList: string[];
  if (currentList.some((item) => item.toLowerCase() === targetLower)) {
    // Bỏ chọn danh mục này
    nextList = currentList.filter((item) => item.toLowerCase() !== targetLower);
  } else {
    // Thêm danh mục này vào bộ lọc
    nextList = [...currentList, name];
  }

  const query = { ...route.query };
  if (nextList.length > 0) {
    query.category = nextList.join(",");
  } else {
    delete query.category;
    delete query.categories;
  }

  navigateTo({ path: "/", query });
}

function isCategoryActive(name: string) {
  const currentParam = String(route.query.category || route.query.categories || "");
  if (!currentParam) return false;
  const list = currentParam.split(",").map((s) => s.trim().toLowerCase());
  return list.includes(name.toLowerCase());
}
</script>

<template>
  <div class="space-y-8">
    <!-- POPULAR POSTS (Tự động ẨN khi người dùng đang chọn Lọc Danh Mục) -->
    <section v-if="!hasActiveCategoryFilter" class="pt-1">
      <WidgetTitle title="Popular Posts" />

      <div class="flex flex-col gap-4">
        <article v-if="popularPosts[0]" class="group flex flex-col gap-4">
          <div class="relative overflow-hidden rounded-lg bg-bg-sec border border-border-subtle">
            <NuxtLink :to="getPostPath(popularPosts[0])" class="block aspect-video">
              <NuxtImg :src="getPostImage(popularPosts[0])" :alt="popularPosts[0].title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                loading="lazy" />
            </NuxtLink>
            <div class="absolute right-2 top-2 flex items-center gap-1.5 text-xs">
              <span
                class="flex h-6 items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2 text-white text-[11px] font-semibold border border-white/10 shadow-sm">
                <span>{{ popularPosts[0].comments || 0 }}</span>
                <AppIcon name="messages-square" :size="12" />
              </span>
            </div>
          </div>

          <div class="flex gap-2.5">
            <span class="w-6 shrink-0 text-sm font-bold text-text-muted">01</span>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-baseline text-xs text-text-alt">
                <span>{{
                  formatTimeAgo(popularPosts[0], popularPosts[0].date)
                }}</span>
                <span class="mx-1">/</span>
                <span class="font-medium text-primary">{{
                  popularPosts[0].category
                }}</span>
              </div>
              <h2
                class="line-clamp-2 text-sm font-semibold leading-snug text-text-main transition-colors group-hover:text-primary">
                <NuxtLink :to="getPostPath(popularPosts[0])" class="block transition-colors hover:text-primary">
                  {{ popularPosts[0].title }}
                </NuxtLink>
              </h2>
              <p v-if="popularPosts[0].snippet" class="mt-1 line-clamp-2 text-xs leading-relaxed text-text-alt">
                {{ popularPosts[0].snippet }}
              </p>
            </div>
          </div>
        </article>

        <article v-for="(post, index) in popularPosts.slice(1)" :key="post.path" class="group flex gap-2.5">
          <span class="w-6 shrink-0 text-sm font-bold text-text-muted">
            {{ String(index + 2).padStart(2, "0") }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="mb-0.5 flex items-baseline text-xs text-text-alt">
              <span>{{ formatTimeAgo(post, post.date) }}</span>
              <span class="mx-1">/</span>
              <span class="font-medium text-primary">{{ post.category }}</span>
            </div>
            <h2
              class="line-clamp-2 text-sm font-semibold leading-snug text-text-main transition-colors group-hover:text-primary">
              <NuxtLink :to="getPostPath(post)" class="block transition-colors hover:text-primary">
                {{ post.title }}
              </NuxtLink>
            </h2>
          </div>
        </article>
      </div>
    </section>

    <!-- WIDGET CATEGORIES (Chuẩn 100% Giao Diện Gốc Median UI & Có Nút Show All) -->
    <section class="pt-1">
      <WidgetTitle title="Categories" />

      <div class="grid grid-cols-2 gap-2">
        <button v-for="label in visibleLabels" :key="label.name" type="button" :class="[
          'flex min-w-0 items-center justify-between gap-2 border px-3 py-2 text-xs font-medium transition-all rounded cursor-pointer text-left',
          isCategoryActive(label.name)
            ? 'border-primary bg-primary-subtle text-primary font-semibold shadow-2xs'
            : 'border-border-main bg-bg-sec text-text-main hover:border-primary hover:text-primary'
        ]" @click="toggleCategoryFilter(label.name)">
          <span class="truncate">{{ label.name }}</span>
          <span
            :class="['inline-flex shrink-0 items-center gap-1 text-[11px]', isCategoryActive(label.name) ? 'text-primary font-semibold' : 'text-text-alt']">
            <span>{{ label.count }}</span>
            <AppIcon name="tag" :size="12" />
          </span>
        </button>
      </div>

      <!-- Nút Show All / Show Less khi có nhiều danh mục -->
      <div v-if="labels.length > 6" class="mt-2.5">
        <button type="button"
          class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
          @click="isAllLabelsVisible = !isAllLabelsVisible">
          <span>{{ isAllLabelsVisible ? "Show less" : "Show all" }}</span>
          <span v-if="!isAllLabelsVisible" class="text-text-alt font-normal">(+{{ labels.length - 6 }})</span>
        </button>
      </div>
    </section>

    <AdBanner />
  </div>
</template>
