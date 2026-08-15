<script setup lang="ts">
import { computed, ref, shallowRef, watch, nextTick, onMounted, onUnmounted } from "vue";
import { getPostPath } from "~/composables/usePosts";
import { useAppStore } from "~/stores/useAppStore";
import { useTimeout } from "~/composables/useTimeout";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

const appStore = useAppStore();
const searchQuery = ref("");
const selectedIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const resultsContainerRef = ref<HTMLDivElement | null>(null);

const posts = shallowRef<any[]>([]);
let hasLoadedPosts = false;

async function ensurePostsLoaded() {
  if (hasLoadedPosts) return;
  hasLoadedPosts = true;
  try {
    const data = await queryCollection("posts").all();
    posts.value = data || [];
  } catch {}
}

const popularTags = computed(() => {
  const categories = new Set(
    (posts.value || []).map((post: any) => post.category).filter(Boolean),
  );
  return Array.from(categories).slice(0, 8);
});

const results = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  if (!keyword) return [];

  return (posts.value || [])
    .filter((post: any) => {
      return [post.title, post.snippet, post.category, post.author?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    })
    .slice(0, 8);
});

let isKeyboardNav = false;

function scrollToActiveItem(index: number) {
  nextTick(() => {
    const container = resultsContainerRef.value;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>("[data-search-item]");
    const activeEl = items[index];
    if (activeEl && typeof activeEl.scrollIntoView === "function") {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
}

watch(selectedIndex, (newIdx) => {
  if (isKeyboardNav) {
    scrollToActiveItem(newIdx);
  }
});

watch(searchQuery, () => {
  selectedIndex.value = 0;
  nextTick(() => {
    if (resultsContainerRef.value) {
      resultsContainerRef.value.scrollTop = 0;
    }
  });
});

function onMouseMove(index: number) {
  isKeyboardNav = false;
  selectedIndex.value = index;
}

const keyHandlers: Record<string, (e: KeyboardEvent) => void> = {
  Escape: () => appStore.closeSearchModal(),
  ArrowDown: (e) => {
    e.preventDefault();
    if (results.value.length) {
      isKeyboardNav = true;
      selectedIndex.value = (selectedIndex.value + 1) % results.value.length;
    }
  },
  ArrowUp: (e) => {
    e.preventDefault();
    if (results.value.length) {
      isKeyboardNav = true;
      selectedIndex.value =
        selectedIndex.value <= 0 ? results.value.length - 1 : selectedIndex.value - 1;
    }
  },
  Enter: (e) => {
    const targetPost = results.value[selectedIndex.value];
    if (targetPost) {
      e.preventDefault();
      appStore.closeSearchModal();
      navigateTo(getPostPath(targetPost));
    }
  },
};

function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    appStore.toggleSearchModal();
    return;
  }

  if (!appStore.isSearchOpen) return;

  const handler = keyHandlers[e.key];
  if (handler) {
    handler(e);
  }
}

const { set: setFocusTimer } = useTimeout();

watch(
  () => appStore.isSearchOpen,
  (isOpen) => {
    if (isOpen) {
      ensurePostsLoaded();
      selectedIndex.value = 0;
      setFocusTimer(() => inputRef.value?.focus(), 100);
    } else {
      searchQuery.value = "";
      selectedIndex.value = 0;
    }
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="appStore.isSearchOpen"
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-3 pt-6 sm:px-4 sm:pt-20 backdrop-blur-xs"
        @click.self="appStore.closeSearchModal"
      >
        <div
          class="flex max-h-[85vh] sm:max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border-main bg-bg-alt shadow-2xl space-y-0"
        >
          <!-- Search Header Input -->
          <div class="flex items-center gap-2.5 border-b border-border-subtle p-3 sm:p-4 bg-bg-alt/90">
            <AppIcon name="search" :size="17" class="shrink-0 text-primary" />
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm bài viết, chuyên mục... (Dùng ↑ ↓ để chọn, Enter để mở)"
              class="w-full bg-transparent text-xs sm:text-sm font-medium text-text-main outline-none placeholder:text-text-muted"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="rounded-full p-1 text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
              @click="searchQuery = ''"
            >
              <AppIcon name="x" :size="15" />
            </button>
            <kbd
              class="hidden sm:inline-block rounded-md border border-border-main bg-bg-sec px-1.5 py-0.5 text-[10px] font-semibold text-text-muted shadow-2xs"
            >
              ESC
            </kbd>
          </div>

          <!-- Content Search Body -->
          <div
            ref="resultsContainerRef"
            class="space-y-3 sm:space-y-4 overflow-y-auto p-3.5 sm:p-5 max-h-[60vh] sm:max-h-[65vh]"
          >
            <div v-if="!searchQuery">
              <h4
                class="mb-2.5 text-[10.5px] font-bold uppercase tracking-wider text-text-muted"
              >
                Chuyên mục phổ biến
              </h4>
              <div class="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  v-for="tag in popularTags"
                  :key="String(tag)"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-lg border border-border-main bg-bg-sec px-2.5 py-1 text-[11.5px] sm:text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
                  @click="searchQuery = String(tag)"
                >
                  <span class="text-primary font-semibold">#</span>
                  <span>{{ tag }}</span>
                </button>
              </div>
            </div>

            <div v-else class="space-y-2">
              <div class="text-[11px] sm:text-xs text-text-muted mb-2">
                Kết quả tìm kiếm cho:
                <span class="font-bold text-primary">"{{ searchQuery }}"</span>
              </div>

              <!-- Search Results Cards with Keyboard Navigation Highlight -->
              <NuxtLink
                v-for="(post, index) in results"
                :key="post.path"
                data-search-item
                :to="getPostPath(post)"
                :class="[
                  'group block rounded-xl border p-2.5 sm:p-3.5 transition-all duration-150 shadow-2xs cursor-pointer',
                  selectedIndex === index
                    ? 'border-primary bg-primary-subtle/30 ring-1 ring-primary/40'
                    : 'border-border-main bg-bg-sec hover:bg-bg-alt/70',
                ]"
                @mousemove="onMouseMove(index)"
                @click="appStore.closeSearchModal"
              >
                <div class="flex items-center justify-between gap-2 mb-0.5 sm:mb-1">
                  <span
                    :class="[
                      'block truncate text-xs sm:text-sm font-bold transition-colors',
                      selectedIndex === index ? 'text-primary' : 'text-text-main',
                    ]"
                  >
                    {{ post.title }}
                  </span>
                  <span
                    v-if="post.category"
                    class="shrink-0 text-[9.5px] sm:text-[10px] font-semibold text-primary rounded bg-primary-subtle px-1.5 py-0.5"
                  >
                    {{ post.category }}
                  </span>
                </div>
                <span
                  class="line-clamp-2 block text-[11px] sm:text-xs leading-relaxed text-text-alt"
                >
                  {{ post.snippet }}
                </span>
              </NuxtLink>

              <div
                v-if="!results.length"
                class="rounded-xl border border-border-main bg-bg-sec/80 p-4 text-center text-xs text-text-alt shadow-2xs"
              >
                Không tìm thấy bài viết phù hợp.
              </div>
            </div>
          </div>

          <!-- Modal Footer Info with Keyboard Shortcuts -->
          <div
            class="flex items-center justify-between border-t border-border-subtle bg-bg-sec/60 px-4 py-2.5 text-[11px] text-text-muted"
          >
            <div class="flex items-center gap-3">
              <span class="hidden sm:inline-flex items-center gap-1">
                <kbd class="rounded bg-bg-base px-1 py-0.2 border border-border-subtle text-[10px]">↑</kbd>
                <kbd class="rounded bg-bg-base px-1 py-0.2 border border-border-subtle text-[10px]">↓</kbd>
                <span>Di chuyển</span>
              </span>
              <span class="hidden sm:inline-flex items-center gap-1">
                <kbd class="rounded bg-bg-base px-1 py-0.2 border border-border-subtle text-[10px]">↵</kbd>
                <span>Mở bài viết</span>
              </span>
            </div>
            <span class="font-medium text-text-main">
              {{ results.length }} kết quả
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
