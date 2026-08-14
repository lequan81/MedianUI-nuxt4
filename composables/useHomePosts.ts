import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { getLabelCounts, sortPinnedFirst } from "~/composables/usePosts";
import { useAuthor } from "~/composables/useAuthor";
import type { PostItem } from "~/types/post";

export function useHomePosts() {
  const route = useRoute();
  const pageSize = 8;
  const dropdownContainer = ref<HTMLElement | null>(null);

  const state = reactive({
    currentSlide: 0,
    displayCount: 6,
    currentPage: 1,
    isAddCategoryOpen: false,
  });

  const { data: posts, status } = useAsyncData("home-posts", async () => {
    const result = await queryCollection("posts").all();
    return (result || []) as unknown as PostItem[];
  });


  function getAuthorInfo(post: PostItem | any) {
    return useAuthor(post?.author);
  }

  const selectedCategories = computed(() => {
    const param = String(route.query.category || route.query.categories || "");
    if (!param) return [];
    return param
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  });

  const allCategoriesList = computed(() => {
    const labelMap = getLabelCounts(posts.value || []);
    return labelMap.map((l) => l.name);
  });

  const unselectedCategories = computed(() => {
    const activeSet = new Set(selectedCategories.value.map((c) => c.toLowerCase()));
    return allCategoriesList.value.filter((cat) => !activeSet.has(cat.toLowerCase()));
  });

  const orderedPosts = computed(() => sortPinnedFirst(posts.value || []));

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

  const pinnedPosts = computed(() => {
    if (selectedCategories.value.length) return [];
    return filteredPosts.value.filter((post: any) => post.pinned);
  });

  const storyPosts = computed(() => {
    if (selectedCategories.value.length) return filteredPosts.value;
    return filteredPosts.value.filter((post: any) => !post.pinned);
  });

  const totalPages = computed(() => {
    return Math.ceil(storyPosts.value.length / pageSize) || 1;
  });

  const visibleStoryPosts = computed(() => {
    if (!selectedCategories.value.length) {
      return storyPosts.value.slice(0, state.displayCount);
    }
    const start = (state.currentPage - 1) * pageSize;
    const end = start + pageSize;
    return storyPosts.value.slice(start, end);
  });

  const hasMoreHomeStories = computed(() => {
    return !selectedCategories.value.length && state.displayCount < storyPosts.value.length;
  });

  const hasPrevPage = computed(() => state.currentPage > 1);
  const hasNextPage = computed(() => state.currentPage < totalPages.value);

  function loadMoreStories() {
    state.displayCount += 6;
  }

  function nextPage() {
    if (hasNextPage.value) {
      state.currentPage++;
      scrollToSection();
    }
  }

  function prevPage() {
    if (hasPrevPage.value) {
      state.currentPage--;
      scrollToSection();
    }
  }

  function scrollToSection() {
    if (import.meta.client) {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }

  function addCategory(catName: string) {
    const nextList = [...selectedCategories.value, catName];
    state.isAddCategoryOpen = false;
    state.currentPage = 1;
    navigateTo({
      path: "/",
      query: { category: nextList.join(",") },
    });
  }

  function removeCategory(categoryName: string) {
    const remaining = selectedCategories.value.filter(
      (cat) => cat.toLowerCase() !== categoryName.toLowerCase()
    );

    state.currentPage = 1;

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
    state.currentPage = 1;
    state.isAddCategoryOpen = false;
    navigateTo("/");
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      dropdownContainer.value &&
      !dropdownContainer.value.contains(event.target as Node)
    ) {
      state.isAddCategoryOpen = false;
    }
  }

  onMounted(() => {
    window.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
  });

  return {
    posts,
    status,
    state,
    dropdownContainer,
    selectedCategories,
    unselectedCategories,
    sliderPosts,
    pinnedPosts,
    storyPosts,
    visibleStoryPosts,
    totalPages,
    hasMoreHomeStories,
    hasPrevPage,
    hasNextPage,
    getAuthorInfo,
    loadMoreStories,
    nextPage,
    prevPage,
    addCategory,
    removeCategory,
    clearAllCategories,
  };
}
