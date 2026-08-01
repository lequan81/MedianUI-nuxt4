<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import { getPostImage, getPostPath } from "~/composables/usePosts";
import { postText } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";
import AuthorBio from "~/components/post/AuthorBio.vue";
import PostShareBar from "~/components/post/PostShareBar.vue";
import ShareModal from "~/components/post/ShareModal.vue";
import TableOfContents from "~/components/post/TableOfContents.vue";
import WidgetTitle from "~/components/ui/WidgetTitle.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const isShareModalOpen = ref(false);

const { data: post } = await useAsyncData(`post-${slug.value}`, async () => {
  const byPath = await queryCollection("posts")
    .path(`/blog/${slug.value}`)
    .first();
  if (byPath) return byPath;

  const all = await queryCollection("posts").all();
  return (
    all.find((item: any) => getPostPath(item) === `/blog/${slug.value}`) || null
  );
});

const { data: relatedPosts } = await useAsyncData(
  `related-${slug.value}`,
  async () => {
    const all = await queryCollection("posts").all();
    const currentTags = new Set(
      [post.value?.category, ...(post.value?.tags || [])]
        .filter(Boolean)
        .map((tag) => String(tag).toLowerCase()),
    );

    function scorePost(item: any) {
      const tags = new Set(
        [item.category, ...(item.tags || [])]
          .filter(Boolean)
          .map((tag) => String(tag).toLowerCase()),
      );

      let score = 0;
      for (const tag of tags) {
        if (currentTags.has(tag))
          score +=
            tag === String(post.value?.category || "").toLowerCase() ? 3 : 1;
      }

      return score;
    }

    function dateValue(value: unknown) {
      const timestamp = Date.parse(String(value || ""));
      return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
    }

    return all
      .filter((item: any) => item.path !== post.value?.path)
      .sort((a: any, b: any) => {
        const scoreDelta = scorePost(b) - scorePost(a);
        if (scoreDelta !== 0) return scoreDelta;

        const dateDelta = dateValue(b.date) - dateValue(a.date);
        if (dateDelta !== 0) return dateDelta;

        return (b.comments || 0) - (a.comments || 0);
      })
      .slice(0, 6);
  },
);

const allPostTags = computed(() => {
  const list: string[] = [];
  if (post.value?.category) {
    list.push(post.value.category);
  }
  if (post.value?.tags && Array.isArray(post.value.tags)) {
    post.value.tags.forEach((tag: string) => {
      if (!list.includes(tag)) {
        list.push(tag);
      }
    });
  }
  return list;
});

const windowWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1200);

function onWindowResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("resize", onWindowResize, { passive: true });
    onWindowResize();
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", onWindowResize);
  }
});

// Clean deterministic maxTags limit controlled via Markdown Frontmatter (default: 5)
const maxTagsLimit = computed(() => {
  if (typeof (post.value as any)?.maxTags === "number") {
    return (post.value as any).maxTags;
  }
  return 5;
});

const isOverflowingTags = computed(() => {
  return allPostTags.value.length > maxTagsLimit.value;
});

const visiblePostTags = computed(() => {
  if (isOverflowingTags.value) {
    return allPostTags.value.slice(0, maxTagsLimit.value - 1);
  }
  return allPostTags.value;
});

const hiddenPostTags = computed(() => {
  if (isOverflowingTags.value) {
    return allPostTags.value.slice(maxTagsLimit.value - 1);
  }
  return [];
});

const tocLinks = computed(() => {
  if (!post.value) return [];
  return post.value.body?.toc?.links || (post.value as any).toc?.links || [];
});

useSeoMeta({
  title: () =>
    post.value?.title ? `${post.value.title} - Median UI` : "Blog - Median UI",
  description: () => post.value?.snippet || "",
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.snippet,
  ogImage: () => post.value?.image,
});
</script>

<template>
  <article v-if="post" class="mx-auto max-w-4xl space-y-10">
    <section class="min-w-0 space-y-8">
      <header>
        <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-5">
          <NuxtLink to="/" class="shrink-0 text-text-alt/70 transition-colors hover:text-primary">Trang chủ</NuxtLink>
          <span class="text-text-alt/50">/</span>
          <NuxtLink :to="`/?category=${encodeURIComponent(post.category)}`"
            class="truncate font-semibold text-text-main transition-colors hover:text-primary">
            {{ post.category }}
          </NuxtLink>
        </nav>

        <h1
          class="text-3xl font-bold leading-tight tracking-[-0.02em] text-text-main md:text-4xl lg:text-[2.65rem] pb-4 mb-2">
          {{ post.title }}
        </h1>

        <p v-if="post.snippet" class="max-w-208 text-sm md:text-base leading-relaxed text-text-alt/80 mb-6">
          {{ post.snippet }}
        </p>

        <div class="flex items-center justify-between gap-4 pt-1 text-xs">
          <div class="flex flex-wrap items-center gap-2 text-text-alt">
            <img v-if="post.author?.avatar" :src="post.author.avatar" :alt="post.author.name"
              class="h-7 w-7 rounded-full object-cover ring-1 ring-border-main" loading="lazy" />
            <span v-else
              class="flex h-7 w-7 items-center justify-center rounded-full bg-bg-sec ring-1 ring-border-main">
              <AppIcon name="user" :size="13" />
            </span>
            <span class="font-semibold uppercase tracking-wider text-text-main ml-0.5">
              {{ post.author?.name }}
            </span>
            <span class="text-text-alt/70">• {{ post.date }}</span>
            <span v-if="post.readTime" class="text-text-alt/70">• {{ post.readTime }}</span>
          </div>

          <button type="button"
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-alt transition-colors hover:bg-bg-sec hover:text-primary"
            title="Chia sẻ bài viết" aria-label="Chia sẻ bài viết" @click="isShareModalOpen = true">
            <AppIcon name="share-2" :size="16" />
          </button>
        </div>
      </header>

      <div class="space-y-6">
        <div class="prose-content">
          <ContentRenderer :value="post" />
        </div>

        <!-- Post Footer Meta Row: Hashtags (Left) & Author Bio (Right) -->
        <div
          class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-4 border-t border-border-main/50">
          <div v-if="allPostTags.length" class="flex flex-wrap items-center gap-2 min-w-0 flex-1 pt-0.5">
            <NuxtLink v-for="tag in visiblePostTags" :key="tag" :to="`/?category=${encodeURIComponent(tag)}`"
              class="inline-flex max-w-35 items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-3 py-1.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs">
              <span class="text-primary font-bold">#</span>
              <span class="truncate">{{ tag }}</span>
            </NuxtLink>

            <!-- +N Hover Tooltip Pill & Interactive Popover -->
            <div v-if="isOverflowingTags" class="relative group/more inline-block">
              <span
                class="inline-flex items-center gap-1 rounded-lg border border-border-main/80 bg-bg-sec px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:border-primary shadow-2xs cursor-pointer">
                +#{{ hiddenPostTags.length }}
              </span>

              <!-- Floating Tooltip Popover -->
              <div class="absolute left-0 bottom-full pb-2 hidden group-hover/more:block z-50 pointer-events-auto">
                <div class="w-56 p-2.5 rounded-xl border border-border-main bg-bg-base shadow-2xl space-y-1.5">
                  <div
                    class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-text-alt/60 pb-1 border-b border-border-main/40">
                    <span>Thẻ khác</span>
                    <span class="text-primary font-bold">+{{ hiddenPostTags.length }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5 pt-0.5">
                    <NuxtLink v-for="tag in hiddenPostTags" :key="tag" :to="`/?category=${encodeURIComponent(tag)}`"
                      class="inline-flex items-center gap-1 rounded-md border border-border-main/80 bg-bg-sec px-2 py-1 text-[11.5px] font-medium text-text-main transition-colors hover:border-primary hover:text-primary hover:bg-primary/5">
                      <span class="text-primary font-bold">#</span>
                      <span>{{ tag }}</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AuthorBio :author="post.author" class="shrink-0" />
        </div>

        <PostShareBar :title="post.title" />
      </div>

      <!-- Related Posts Standalone Section -->
      <section v-if="relatedPosts?.length" class="mt-6">
        <WidgetTitle :title="postText.relatedTitle" />

        <div class="grid gap-3.5 sm:grid-cols-2">
          <article v-for="(item, index) in relatedPosts" :key="item.path"
            class="group overflow-hidden rounded-xl border border-border-main/70 bg-bg-sec/40 p-3.5 transition-colors hover:border-primary/60 hover:bg-bg-sec/70">
            <NuxtLink :to="getPostPath(item)" class="grid h-full grid-cols-[minmax(0,1fr)_84px] gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 text-[11px] text-text-alt">
                  <span class="font-bold text-primary">{{ String(index + 1).padStart(2, "0") }}</span>
                  <span>•</span>
                  <span>{{ item.date }}</span>
                </div>

                <h3
                  class="mt-1.5 line-clamp-2 text-xs font-semibold leading-snug text-text-main transition-colors group-hover:text-primary">
                  {{ item.title }}
                </h3>

                <p v-if="item.snippet" class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-text-alt/80">
                  {{ item.snippet }}
                </p>
              </div>

              <div class="h-20 overflow-hidden rounded-lg bg-bg-sec">
                <img :src="getPostImage(item)" :alt="item.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy" />
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <!-- Post Discussion Section -->
      <PostComments />
    </section>

    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
    <ShareModal :is-open="isShareModalOpen" :title="post.title" @close="isShareModalOpen = false" />
  </article>

  <div v-else class="border border-border-main bg-bg-sec p-10 text-center">
    <h2 class="text-xl font-bold">Bài viết không tồn tại</h2>
    <p class="mt-2 text-sm text-text-alt">
      Bài viết bạn tìm kiếm không còn hoặc đường dẫn bị hỏng.
    </p>
    <NuxtLink to="/" class="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white">
      Về trang chủ
    </NuxtLink>
  </div>
</template>
