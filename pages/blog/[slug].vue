<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import { getPostImage, getPostPath } from "~/composables/usePosts";
import { postText } from "~/app/config/site";
import AppIcon from "~/components/ui/AppIcon.vue";
import AuthorBio from "~/components/post/AuthorBio.vue";
import PostShareBar from "~/components/post/PostShareBar.vue";
import TableOfContents from "~/components/post/TableOfContents.vue";
import WidgetTitle from "~/components/ui/WidgetTitle.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

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
  <article v-if="post" class="mx-auto max-w-4xl space-y-12">
    <nav class="flex min-w-0 items-center gap-1 overflow-hidden text-[13px]">
      <NuxtLink
        to="/"
        class="shrink-0 text-text-alt transition-colors hover:text-primary"
        >Trang chủ</NuxtLink
      >
      <span class="text-text-alt/60">/</span>
      <NuxtLink
        :to="`/?category=${encodeURIComponent(post.category)}`"
        class="truncate font-semibold text-text-main transition-colors hover:text-primary"
      >
        {{ post.category }}
      </NuxtLink>
    </nav>

    <section class="min-w-0 space-y-12">
      <header class="space-y-6">
        <div
          class="inline-flex items-center rounded-full border border-border-main bg-bg-sec px-3 py-1 text-xs font-medium text-primary"
        >
          {{ post.category }}
        </div>

        <div class="space-y-4">
          <h1
            class="text-3xl font-bold leading-[1.18] tracking-[-0.02em] text-text-main md:text-5xl"
          >
            {{ post.title }}
          </h1>
          <p
            v-if="post.snippet"
            class="max-w-3xl text-base leading-8 text-text-alt md:text-lg"
          >
            {{ post.snippet }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-sm text-text-alt">
          <div class="flex items-center gap-2">
            <img
              v-if="post.author?.avatar"
              :src="post.author.avatar"
              :alt="post.author.name"
              class="h-10 w-10 rounded-full object-cover ring-1 ring-border-main"
              loading="lazy"
            />
            <span
              v-else
              class="flex h-10 w-10 items-center justify-center rounded-full bg-bg-sec ring-1 ring-border-main"
            >
              <AppIcon name="user" :size="18" />
            </span>
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-[0.16em] text-text-alt">
                Author
              </p>
              <p class="truncate font-medium text-text-main">
                {{ post.author?.name }}
              </p>
            </div>
          </div>

          <div class="h-8 w-px bg-border-main/70"></div>

          <div>
            <p class="text-[11px] uppercase tracking-[0.16em] text-text-alt">
              Published
            </p>
            <p class="font-medium text-text-main">{{ post.date }}</p>
          </div>

          <div v-if="post.readTime">
            <p class="text-[11px] uppercase tracking-[0.16em] text-text-alt">
              Reading time
            </p>
            <p class="font-medium text-text-main">{{ post.readTime }}</p>
          </div>
        </div>
      </header>

      <div
        class="overflow-hidden rounded-xl border border-border-main bg-bg-sec shadow-sm"
      >
        <div class="aspect-video bg-bg-alt">
          <img
            :src="getPostImage(post)"
            :alt="post.title"
            class="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div class="space-y-12">
        <div
          class="text-[15px] leading-8 text-text-main [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:rounded-xl [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:bg-bg-sec [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-[0.95rem] [&_blockquote]:text-text-alt [&_h1]:scroll-mt-[calc(var(--header-height)+24px)] [&_h1]:mb-6 [&_h1]:mt-14 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:scroll-mt-[calc(var(--header-height)+24px)] [&_h2]:mb-5 [&_h2]:mt-14 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:scroll-mt-[calc(var(--header-height)+24px)] [&_h3]:mb-4 [&_h3]:mt-12 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h4]:scroll-mt-[calc(var(--header-height)+24px)] [&_h4]:mb-3 [&_h4]:mt-10 [&_h4]:text-xl [&_h4]:font-semibold [&_hr]:my-12 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border-main/80 [&_img]:my-0 [&_img]:w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-6 [&_p]:leading-8 [&_pre]:my-8 [&_pre]:overflow-hidden [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border-main [&_pre]:bg-bg-base [&_pre]:p-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-border-main [&_td]:border-border-main [&_td]:px-4 [&_td]:py-3 [&_th]:border-border-main [&_th]:bg-bg-sec [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6"
        >
          <ContentRenderer :value="post" />
        </div>

        <AuthorBio :author="post.author" />
        <PostShareBar :title="post.title" />
      </div>

      <section
        v-if="relatedPosts?.length"
        class="rounded-xl border border-border-main bg-bg-sec/70 p-5 sm:p-6"
      >
        <WidgetTitle :title="postText.relatedTitle" />

        <div class="grid gap-6 md:grid-cols-2">
          <article
            v-for="(item, index) in relatedPosts"
            :key="item.path"
            class="group overflow-hidden rounded-xl border border-border-main bg-bg-base transition-colors hover:border-primary/50"
          >
            <NuxtLink
              :to="getPostPath(item)"
              class="grid h-full grid-cols-[minmax(0,1fr)_92px] gap-4 p-4"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2 text-xs text-text-alt">
                  <span class="font-semibold text-primary">{{
                    String(index + 1).padStart(2, "0")
                  }}</span>
                  <span>•</span>
                  <span>{{ item.date }}</span>
                </div>

                <h2
                  class="mt-2 line-clamp-2 text-base font-semibold leading-snug text-text-main transition-colors group-hover:text-primary"
                >
                  {{ item.title }}
                </h2>

                <p
                  v-if="item.snippet"
                  class="mt-2 line-clamp-2 text-sm leading-7 text-text-alt"
                >
                  {{ item.snippet }}
                </p>
              </div>

              <div class="overflow-hidden rounded-lg bg-bg-sec">
                <img
                  :src="getPostImage(item)"
                  :alt="item.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
            </NuxtLink>
          </article>
        </div>

        <div class="mt-6 border-t border-border-main/70 pt-6">
          <button
            type="button"
            class="inline-flex h-12 w-full items-center justify-center rounded-lg border border-border-main bg-bg-base text-sm font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
          >
            {{ postText.commentButton }}
          </button>
        </div>
      </section>
    </section>

    <TableOfContents v-if="tocLinks.length" :links="tocLinks" />
  </article>

  <div v-else class="border border-border-main bg-bg-sec p-10 text-center">
    <h2 class="text-xl font-bold">Bài viết không tồn tại</h2>
    <p class="mt-2 text-sm text-text-alt">
      Bài viết bạn tìm kiếm không còn hoặc đường dẫn bị hỏng.
    </p>
    <NuxtLink
      to="/"
      class="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
    >
      Về trang chủ
    </NuxtLink>
  </div>
</template>
