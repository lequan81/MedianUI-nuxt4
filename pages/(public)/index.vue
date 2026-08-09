<script setup lang="ts">
import AppIcon from "~/components/ui/AppIcon.vue";
import AuthorTooltip from "~/components/post/AuthorTooltip.vue";
import { usePageSeo } from "~/composables/usePageSeo";
import { useRoute, navigateTo } from "#imports";
import {
  getPostImage,
  getPostPath,
  getLabelCounts,
  sortPinnedFirst,
} from "~/composables/usePosts";
import type { PostItem } from "~/types/post";
const appConfig = useAppConfig();
const postText = appConfig.postText;

usePageSeo({
  title: "Trang chủ",
  description: appConfig.site.description,
});

const route = useRoute();
const currentSlide = ref(0);
const pageSize = 8; // 8 bài viết 1 trang khi lọc
const displayCount = ref(6); // 6 bài ban đầu ở Trang Chủ, nhấn "Tải thêm bài đăng" để xem tiếp
const currentPage = ref(1);
const isAddCategoryOpen = ref(false);
const dropdownContainer = ref<HTMLElement | null>(null);

const { data: posts, status } = await useAsyncData("home-posts", async () => {
  const result = await queryCollection("posts").all();
  return (result || []) as PostItem[];
});




// Hỗ trợ thông tin Tác Giả tập trung
function getAuthorInfo(post: PostItem | any) {
  return useAuthor(post?.author);
}


// Hỗ trợ chọn nhiều danh mục dạng phẩy: ?category=Decor,Fitness
const selectedCategories = computed(() => {
  const param = String(route.query.category || route.query.categories || "");
  if (!param) return [];
  return param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
});

// Danh sách danh mục chưa được chọn để hiển thị trong Dropdown Thêm Danh Mục
const allCategoriesList = computed(() => {
  const labelMap = getLabelCounts(posts.value || []);
  return labelMap.map((l) => l.name);
});

const unselectedCategories = computed(() => {
  const activeSet = new Set(selectedCategories.value.map((c) => c.toLowerCase()));
  return allCategoriesList.value.filter((cat) => !activeSet.has(cat.toLowerCase()));
});

const orderedPosts = computed(() => sortPinnedFirst(posts.value || []));

// Lọc bài viết nếu khớp BẤT KỲ danh mục/thẻ nào trong danh sách được chọn
const filteredPosts = computed(() => {
  if (!selectedCategories.value.length) return orderedPosts.value;
  const targets = selectedCategories.value.map((c) => c.toLowerCase());

  return orderedPosts.value.filter((post: any) => {
    const category = String(post.category || "").toLowerCase();
    const tags = Array.isArray(post.tags)
      ? post.tags.map((t: string) => String(t).toLowerCase())
      : [];

    return (
      targets.includes(category) || targets.some((t) => tags.includes(t))
    );
  });
});

const sliderPosts = computed(() => orderedPosts.value.slice(0, 4));

// Khi không chọn danh mục filter: Pinned posts riêng
const pinnedPosts = computed(() => {
  if (selectedCategories.value.length) return [];
  return filteredPosts.value.filter((post: any) => post.pinned);
});

const storyPosts = computed(() => {
  if (selectedCategories.value.length) return filteredPosts.value;
  return filteredPosts.value.filter((post: any) => !post.pinned);
});

// Phân trang khi lọc hoặc cuộn danh sách
const totalPages = computed(() => {
  return Math.ceil(storyPosts.value.length / pageSize) || 1;
});

const visibleStoryPosts = computed(() => {
  if (!selectedCategories.value.length) {
    return storyPosts.value.slice(0, displayCount.value);
  }
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return storyPosts.value.slice(start, end);
});

const hasMoreHomeStories = computed(() => {
  return !selectedCategories.value.length && displayCount.value < storyPosts.value.length;
});

const hasPrevPage = computed(() => currentPage.value > 1);
const hasNextPage = computed(() => currentPage.value < totalPages.value);

function loadMoreStories() {
  displayCount.value += 6;
}

function nextPage() {
  if (hasNextPage.value) {
    currentPage.value++;
    scrollToSection();
  }
}

function prevPage() {
  if (hasPrevPage.value) {
    currentPage.value--;
    scrollToSection();
  }
}

function scrollToSection() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 300, behavior: "smooth" });
  }
}

function addCategory(catName: string) {
  const nextList = [...selectedCategories.value, catName];
  isAddCategoryOpen.value = false;
  currentPage.value = 1;
  navigateTo({
    path: "/",
    query: { category: nextList.join(",") },
  });
}

function removeCategory(categoryName: string) {
  const remaining = selectedCategories.value.filter(
    (cat) => cat.toLowerCase() !== categoryName.toLowerCase(),
  );

  currentPage.value = 1;

  if (remaining.length === 0) {
    clearAllCategories();
  } else {
    navigateTo({
      path: "/",
      query: { category: remaining.join(",") },
    });
  }
}

function clearAllCategories() {
  currentPage.value = 1;
  isAddCategoryOpen.value = false;
  navigateTo("/");
}

function handleClickOutside(event: MouseEvent) {
  if (
    dropdownContainer.value &&
    !dropdownContainer.value.contains(event.target as Node)
  ) {
    isAddCategoryOpen.value = false;
  }
}

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
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer);
  window.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div v-if="status === 'pending' || !posts" class="space-y-8">
    <HeroSliderSkeleton />
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PostCardSkeleton v-for="i in 6" :key="i" />
    </div>
  </div>
  <div v-else>
    <!-- BREADCRUMB KHI ĐANG LỌC DANH MỤC -->
    <AppBreadcrumb v-if="selectedCategories.length" :items="[{ label: selectedCategories.join(', ') }]" />

    <!-- SLIDER CAROUSEL (Chỉ hiện ở Trang Chủ khi không lọc danh mục) -->
    <SliderWidget :posts="sliderPosts" v-if="!selectedCategories.length" />

    <!-- PINNED POSTS SECTION (Chỉ hiện ở Trang Chủ khi không lọc danh mục) -->
    <section v-if="!selectedCategories.length && pinnedPosts.length" class="mb-8">
      <WidgetTitle :title="postText.pinnedTitle" />

      <div class="space-y-6">
        <article v-for="post in pinnedPosts" :key="post.path"
          class="group grid gap-5 sm:grid-cols-[minmax(220px,288px)_1fr]">
          <NuxtLink :to="getPostPath(post)" class="relative block aspect-video overflow-hidden rounded-xl bg-bg-sec">
            <NuxtImg :src="getPostImage(post)" :alt="post.title" :width="600" :height="338"
              sizes="sm:100vw md:50vw lg:33vw"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="eager" fetchpriority="high" />
            <span
              class="absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-full bg-white px-2 text-xs font-medium text-slate-800 shadow-md">
              {{ post.comments || 0 }}
              <AppIcon name="book-open-text" :size="13" />
            </span>
          </NuxtLink>


          <div class="flex min-w-0 flex-col justify-center">
            <div class="mb-1 text-xs text-text-alt">
              <span>in </span>
              <NuxtLink :to="`/?category=${encodeURIComponent(post.category)}`"
                class="font-medium text-primary hover:underline">
                {{ post.category }}
              </NuxtLink>
            </div>
            <h2 class="line-clamp-2 text-lg font-semibold leading-snug text-text-main lg:text-xl">
              <NuxtLink :to="getPostPath(post)" class="transition-colors group-hover:text-primary">
                {{ post.title }}
              </NuxtLink>
            </h2>
            <p v-if="post.snippet" class="my-2 line-clamp-2 text-sm leading-relaxed text-text-alt">
              {{ post.snippet }}
            </p>
            <div class="text-xs text-text-alt">{{ post.date }}</div>
          </div>
        </article>
      </div>
    </section>

    <!-- SECTION BÀI ĐĂNG MỚI NHẤT -->
    <section>
      <!-- WidgetTitle "Bài đăng mới nhất ———" CHỈ hiện khi ở Trang chủ Mặc định -->
      <div v-if="!selectedCategories.length" class="mb-4">
        <WidgetTitle :title="postText.latestTitle" />
      </div>

      <!-- Thanh Filter Pills, Dropdown Nút Thêm Danh Mục & Nút Xóa Tất Cả CÙNG HÀNG -->
      <div v-if="selectedCategories.length" class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold text-text-main">Đang lọc:</span>

          <div v-for="cat in selectedCategories" :key="cat"
            class="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary-subtle px-2.5 py-1 text-xs font-semibold text-primary shadow-2xs">
            <span>{{ cat }}</span>
            <button type="button"
              class="rounded-full p-0.5 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
              :aria-label="`Xóa danh mục ${cat}`" @click="removeCategory(cat)">
              <AppIcon name="x" :size="12" />
            </button>
          </div>

          <!-- Nút Dropdown Chọn Thêm Danh Mục -->
          <div v-if="unselectedCategories.length" ref="dropdownContainer" class="relative">
            <button type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-2.5 py-1 text-xs font-semibold text-text-main hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-2xs"
              @click.stop="isAddCategoryOpen = !isAddCategoryOpen">
              <AppIcon name="folder" :size="13" class="text-primary" />
              <span>Thêm danh mục</span>
              <AppIcon name="chevron-down" :size="12" />
            </button>

            <div v-if="isAddCategoryOpen"
              class="absolute left-0 top-full mt-1.5 z-40 min-w-48 rounded-xl border border-border-main bg-bg-base p-1.5 shadow-md space-y-0.5"
              @click.stop>
              <button v-for="cat in unselectedCategories" :key="cat" type="button"
                class="w-full text-left rounded-lg px-3 py-1.5 text-xs font-medium text-text-main hover:bg-primary-subtle hover:text-primary transition-colors cursor-pointer flex items-center justify-between group"
                @click="addCategory(cat)">
                <span>{{ cat }}</span>
                <AppIcon name="tag" :size="13" class="text-text-alt group-hover:text-primary" />
              </button>
            </div>
          </div>
        </div>

        <button type="button"
          class="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1 shrink-0"
          @click="clearAllCategories">
          <span>Xóa tất cả</span>
          <AppIcon name="x" :size="13" />
        </button>
      </div>

      <!-- Grid 4 CỘT khi lọc danh mục (Hoặc 3 CỘT khi ở Trang Chủ) -->
      <div v-if="storyPosts.length" :class="[
        'grid gap-6',
        selectedCategories.length
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      ]">
        <article v-for="(post, index) in visibleStoryPosts" :key="post.path" class="group flex min-w-0 flex-col">
          <NuxtLink :to="getPostPath(post)"
            class="relative mb-3 block aspect-video overflow-hidden rounded-xl bg-bg-sec">
            <NuxtImg :src="getPostImage(post)" :alt="post.title" :width="600" :height="338"
              sizes="sm:100vw md:50vw lg:33vw"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              :loading="index < 3 ? 'eager' : 'lazy'" />
            <div class="absolute right-2 top-2 flex items-center gap-1.5 text-xs">
              <span v-if="post.discount"
                class="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-md">
                {{ post.discount }}
              </span>
              <span v-if="post.isProduct"
                class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-800 shadow-md">
                <AppIcon name="tag" :size="14" />
              </span>
            </div>
          </NuxtLink>

          <div class="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <div class="mb-1 text-xs text-text-alt">
                <span>in </span>
                <NuxtLink :to="`/?category=${encodeURIComponent(post.category)}`"
                  class="font-medium text-primary hover:underline">
                  {{ post.category }}
                </NuxtLink>
              </div>
              <h2 class="line-clamp-2 text-base font-semibold leading-snug text-text-main">
                <NuxtLink :to="getPostPath(post)" class="transition-colors group-hover:text-primary">
                  {{ post.title }}
                </NuxtLink>
              </h2>
              <p v-if="post.snippet" class="my-1.5 line-clamp-2 text-xs leading-relaxed text-text-alt">
                {{ post.snippet }}
              </p>
            </div>

            <!-- Footer bài viết -->
            <div
              class="mt-3 flex items-center justify-between text-xs text-text-alt pt-2 border-t border-border-subtle">
              <AuthorTooltip :author="getAuthorInfo(post)" size="sm">
                <template #default="slotProps">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <NuxtImg :src="slotProps?.author?.avatar" :alt="slotProps?.author?.name" :width="20" :height="20"
                      class="w-5 h-5 shrink-0 rounded-full object-cover ring-1 ring-border-main" format="webp" loading="lazy" />
                    <span
                      class="font-medium text-text-main truncate max-w-24 text-[11px] hover:text-primary transition-colors">
                      {{ slotProps?.author?.name }}
                    </span>
                  </div>
                </template>
              </AuthorTooltip>

              <div class="flex items-center gap-1.5 text-[11px]">
                <span>{{ post.date }}</span>
                <div v-if="post.price" class="flex items-center gap-1 ml-1">
                  <span class="text-[10px] text-text-alt line-through">{{
                    post.price.original
                    }}</span>
                  <span class="font-semibold text-primary">{{
                    post.price.sale
                    }}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <AppEmptyState
        v-else
        icon="search-x"
        message="Không có bài viết thuộc các danh mục đã chọn."
        action-label="Xóa tất cả danh mục"
        @action="clearAllCategories"
      />

      <!-- 1. NÚT TẢI THÊM BÀI ĐĂNG Ở TRANG CHỦ (LUÔN HIỆN KHI CÒN BÀI VIẾT NỐI TIẾP) -->
      <div v-if="hasMoreHomeStories" class="text-center pt-8">
        <button type="button"
          class="group inline-flex items-center justify-center gap-2 rounded-lg border border-border-main bg-bg-sec px-6 py-2.5 text-xs font-bold text-text-main transition-all duration-200 hover:border-primary hover:text-primary shadow-2xs cursor-pointer"
          @click="loadMoreStories">
          <span>Tải thêm bài đăng</span>
          <AppIcon name="chevron-down" :size="14" class="text-text-alt group-hover:text-primary transition-colors" />
        </button>
      </div>

      <!-- 2. THANH PHÂN TRANG KHI LỌC DANH MỤC -->
      <div v-else-if="selectedCategories.length && totalPages > 1"
        class="mt-10 flex items-center justify-between gap-4 pt-4 border-t border-border-subtle">
        <button type="button" :disabled="!hasPrevPage" :class="[
          'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all shadow-2xs',
          hasPrevPage
            ? 'bg-bg-sec border border-border-main text-text-main hover:border-primary hover:text-primary cursor-pointer'
            : 'bg-bg-subtle border border-border-subtle text-text-muted cursor-not-allowed opacity-50'
        ]" @click="prevPage">
          <AppIcon name="chevron-left" :size="14" />
          <span>Trang trước</span>
        </button>

        <NuxtLink to="/"
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-md transition-colors hover:bg-primary/90"
          title="Trang chủ" @click="clearAllCategories">
          <AppIcon name="home" :size="16" />
        </NuxtLink>

        <button type="button" :disabled="!hasNextPage" :class="[
          'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all shadow-2xs',
          hasNextPage
            ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-md'
            : 'bg-bg-subtle border border-border-subtle text-text-muted cursor-not-allowed opacity-50'
        ]" @click="nextPage">
          <span>Trang sau</span>
          <AppIcon name="chevron-right" :size="14" />
        </button>
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
