<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getPostPath } from "~/composables/usePosts";
import { useAppStore } from "~/stores/useAppStore";
import AppIcon from "~/components/ui/AppIcon.vue";

const appStore = useAppStore();
const searchQuery = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const { data: posts } = await useAsyncData("search-posts", () =>
  queryCollection("posts").all(),
);

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

function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    appStore.toggleSearchModal();
  } else if (e.key === "Escape" && appStore.isSearchOpen) {
    appStore.closeSearchModal();
  }
}

watch(
  () => appStore.isSearchOpen,
  (isOpen) => {
    if (isOpen) {
      setTimeout(() => inputRef.value?.focus(), 100);
    } else {
      searchQuery.value = "";
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
        class="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/55 px-4 pt-16 backdrop-blur-sm sm:pt-24"
        @click.self="appStore.closeSearchModal"
      >
        <div
          class="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border-main bg-bg-base shadow-2xl"
        >
          <div class="flex items-center gap-3 border-b border-border-main p-4">
            <AppIcon name="search" :size="20" class="shrink-0 text-primary" />
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search articles, labels, authors..."
              class="w-full bg-transparent text-sm font-medium text-text-main outline-none placeholder:text-text-alt"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="rounded-full p-1 text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main"
              @click="searchQuery = ''"
            >
              <AppIcon name="x" :size="16" />
            </button>
            <kbd
              class="rounded border border-border-main bg-bg-sec px-2 py-1 text-[10px] font-semibold text-text-alt"
            >
              ESC
            </kbd>
          </div>

          <div class="space-y-4 overflow-y-auto p-5">
            <div v-if="!searchQuery">
              <h4
                class="mb-3 text-xs font-bold uppercase tracking-wide text-text-alt"
              >
                Labels
              </h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in popularTags"
                  :key="String(tag)"
                  type="button"
                  class="rounded-md border border-border-main bg-bg-sec px-3 py-1.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
                  @click="searchQuery = String(tag)"
                >
                  # {{ tag }}
                </button>
              </div>
            </div>

            <div v-else class="space-y-3">
              <div class="text-xs text-text-alt">
                Search results for
                <span class="font-bold text-primary">"{{ searchQuery }}"</span>
              </div>

              <NuxtLink
                v-for="post in results"
                :key="post.path"
                :to="getPostPath(post)"
                class="block border border-border-main bg-bg-sec p-3 transition-colors hover:border-primary"
                @click="appStore.closeSearchModal"
              >
                <span
                  class="block truncate text-sm font-semibold text-text-main"
                  >{{ post.title }}</span
                >
                <span
                  class="mt-1 line-clamp-2 block text-xs leading-relaxed text-text-alt"
                  >{{ post.snippet }}</span
                >
              </NuxtLink>

              <div
                v-if="!results.length"
                class="border border-border-main bg-bg-sec p-4 text-center text-sm text-text-alt"
              >
                Không tìm thấy bài viết phù hợp.
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-between border-t border-border-main bg-bg-sec px-5 py-3 text-xs text-text-alt"
          >
            <span>Content search</span>
            <span
              >{{ results.length }} result{{
                results.length === 1 ? "" : "s"
              }}</span
            >
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
