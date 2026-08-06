<script setup lang="ts">
import { computed, ref } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";
import TableOfContents from "~/components/post/TableOfContents.vue";
const appConfig = useAppConfig();
const authorConfig = appConfig.author;

const { data: page } = await useAsyncData("page-about", async () => {
  return (await queryCollection("pages").path("/pages/about").first()) || null;
});

const tocLinks = computed(() => {
  if (!page.value) return [];
  return page.value.body?.toc?.links || (page.value as any).toc?.links || [];
});

usePageSeo({
  title: page.value?.title || "Giới thiệu",
  description: page.value?.description || "Giới thiệu bản thân, hành trình học vấn và blog cá nhân Lê Quân.",
});

const skillCategories = [
  {
    title: "Frontend Core",
    icon: "code",
    items: ["Nuxt 4", "Vue.js 3", "TypeScript", "Tailwind CSS v4"],
  },
  {
    title: "Backend & System",
    icon: "server",
    items: ["Node.js", "RESTful API", "SQLite", "Bun Runtime"],
  },
  {
    title: "Security & Tools",
    icon: "shield-check",
    items: ["Web Security", "Malware Analysis", "Git", "Automation"],
  },
];

// Thứ tự đảo chuẩn mốc thời gian: Mới nhất (2024 - Hiện tại) ở trên, cũ hơn (2020 - 2024) ở dưới
const timelineEvents = [
  {
    year: "2024 - Hiện tại",
    title: "Software Engineer & Tech Blogger",
    subtitle: "Sáng lập & Tác giả lequan81.dev",
    description: "Xây dựng dự án cá nhân chuẩn Median UI v1.7 trên Nuxt 4, nghiên cứu bảo mật và chia sẻ kiến thức lập trình thực tế cho cộng đồng.",
    icon: "rocket",
  },
  {
    year: "2020 - 2024",
    title: "Cử nhân Công nghệ Thông tin",
    subtitle: "Chuyên ngành Kỹ thuật Phần mềm",
    description: "Tốt nghiệp chuyên ngành Kỹ thuật Phần mềm. Nghiên cứu sâu về kiến trúc Web hiện đại (Nuxt/Vue), RESTful API, SQLite & Web Security.",
    icon: "graduation-cap",
  },
];

// Trạng thái Tap để mở rộng/kích hoạt Card trên Mobile
const expandedTimeline = ref<number | null>(null);
const activeCard = ref<string | null>(null);

function toggleTimeline(idx: number) {
  expandedTimeline.value = expandedTimeline.value === idx ? null : idx;
}

function toggleCard(id: string) {
  activeCard.value = activeCard.value === id ? null : id;
}
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-10">
    <!-- Breadcrumb & Header Với Khoảng Thở Thoáng Đãng -->
    <div class="space-y-1.5">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-3">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Giới thiệu</span>
      </nav>
      <h1 class="text-lg sm:text-2xl md:text-3xl font-bold leading-snug tracking-tight text-text-main">
        Giới thiệu
      </h1>
    </div>

    <!-- Layout Gọn Gàng 2 Cột Cân Bằng Cực Kỳ Tinh Tế -->
    <div class="grid gap-4 lg:gap-6 lg:grid-cols-12 items-stretch">
      <!-- Cột Trái (Author Profile Card - Tap Active trên Mobile) -->
      <div class="lg:col-span-5 flex flex-col">
        <div @click="toggleCard('author')" :class="[
          'group relative overflow-hidden rounded-xl border border-dashed p-4.5 sm:p-5 shadow-2xs transition-all duration-300 cursor-pointer select-none flex-1 flex flex-col justify-between space-y-4',
          activeCard === 'author'
            ? 'border-primary bg-bg-alt shadow-md'
            : 'border-border-main bg-bg-alt/60 hover:border-primary/60 hover:bg-bg-alt hover:shadow-md'
        ]">
          <div
            class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          </div>

          <div class="relative space-y-3.5">
            <div class="flex items-center gap-2.5">
              <!-- Avatar Viền Ring CSS Tròn Tuyệt Đối 100% -->
              <NuxtImg :src="authorConfig.avatar" :alt="authorConfig.name" :class="[
                'h-9 w-9 shrink-0 rounded-full object-cover ring-2 shadow-xs transition-all duration-300',
                activeCard === 'author' ? 'ring-primary scale-105' : 'ring-primary/20 group-hover:ring-primary group-hover:scale-105'
              ]" format="webp" loading="lazy" />
              <div class="min-w-0 flex-1">
                <h2 :class="[
                  'text-sm font-bold leading-tight inline-block transition-colors',
                  activeCard === 'author' ? 'text-primary' : 'text-text-main group-hover:text-primary'
                ]">
                  {{ authorConfig.name }}
                </h2>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-xs font-semibold text-primary">
                    {{ authorConfig.handle }}
                  </span>
                  <span class="text-[10px] text-text-muted">•</span>
                  <span
                    class="inline-flex items-center rounded bg-primary-subtle/80 px-1.5 py-0.2 text-[10.5px] font-semibold text-primary">
                    23 tuổi
                  </span>
                </div>
              </div>
            </div>

            <p class="text-xs leading-relaxed text-text-alt pt-0.5">
              Software Engineer & Tech Blogger. Đam mê nghiên cứu công nghệ mới, an toàn thông tin và xây dựng sản phẩm
              web tối ưu trải nghiệm đọc.
            </p>
          </div>

          <!-- Social Icons Bar Tích Hợp Trực Tiếp Vào Card Phân Cách Bằng Border -->
          <div class="relative pt-3.5 border-t border-border-subtle flex items-center gap-1.5" @click.stop>
            <a v-for="social in authorConfig.socials" :key="social.name" :href="social.href" target="_blank"
              rel="noreferrer" :title="social.name" :aria-label="social.name"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-border-main bg-bg-sec text-text-main transition-all duration-200 hover:border-primary hover:text-primary hover:bg-primary-subtle/40 hover:scale-105 active:scale-95 shadow-2xs select-none">
              <AppIcon :name="social.icon" :size="14" class="shrink-0" />
            </a>
          </div>
        </div>
      </div>

      <!-- Cột Phải (Tech Stack Cards - Tap Active trên Mobile) -->
      <div class="lg:col-span-7 flex flex-col justify-between space-y-2.5">
        <div v-for="cat in skillCategories" :key="cat.title" @click="toggleCard(cat.title)" :class="[
          'group relative overflow-hidden rounded-xl border border-dashed p-3 space-y-2 shadow-2xs transition-all duration-300 cursor-pointer select-none flex-1 flex flex-col justify-center',
          activeCard === cat.title
            ? 'border-primary bg-bg-alt shadow-md'
            : 'border-border-main bg-bg-alt/60 hover:border-primary/60 hover:bg-bg-alt hover:shadow-md'
        ]">
          <div
            class="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>

          <div class="relative flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div :class="[
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary transition-transform duration-300',
                activeCard === cat.title ? 'scale-110' : 'group-hover:scale-110'
              ]">
                <AppIcon :name="cat.icon" :size="13" class="flex items-center justify-center" />
              </div>
              <h3 :class="[
                'text-xs font-bold transition-colors',
                activeCard === cat.title ? 'text-primary' : 'text-text-main group-hover:text-primary'
              ]">
                {{ cat.title }}
              </h3>
            </div>
            <span class="text-[10px] font-semibold text-text-muted">
              {{ cat.items.length }} skills
            </span>
          </div>

          <div class="relative flex flex-wrap gap-1 sm:gap-1.5">
            <span v-for="item in cat.items" :key="item"
              class="inline-flex items-center rounded-md border border-border-subtle bg-bg-sec px-1.5 py-0.5 text-[10.5px] sm:text-xs font-medium text-text-main transition-colors duration-200 hover:border-primary/40 hover:text-primary hover:bg-primary-subtle/50 active:scale-95 cursor-pointer select-none">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Render Markdown Content -->
    <div v-if="page" class="prose-content pt-6 sm:pt-8 border-t border-border-subtle">
      <ContentRenderer :value="page" />
    </div>

    <!-- Timeline Hành Trình & Học Vấn -->
    <section class="space-y-6 pt-6 sm:pt-8 border-t border-border-subtle">
      <div class="flex items-center justify-between">
        <h3 class="text-sm sm:text-base font-bold text-text-main flex items-center gap-2">
          <span>Hành Trình & Học Vấn</span>
        </h3>
        <span class="text-[11px] sm:text-xs text-text-muted font-medium">2020 — Hiện tại</span>
      </div>

      <div class="relative space-y-6">
        <div v-for="(event, idx) in timelineEvents" :key="idx"
          class="group relative flex items-start cursor-pointer select-none" @click="toggleTimeline(idx)">
          <!-- Phân Đoạn Đường Kẻ Nối Từ Tâm Node Hiện Tại Sang Tâm Node Tiếp Theo -->
          <div v-if="idx < timelineEvents.length - 1" :class="[
            'absolute left-3.75 top-4.5 -bottom-6 w-0.5 border-l-2 border-dashed transition-colors duration-300',
            expandedTimeline === idx ? 'border-primary/80' : 'border-border-main group-hover:border-primary/80'
          ]">
          </div>

          <!-- Timeline Icon Badge Node -->
          <div :class="[
            'absolute left-0 top-0.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-bg-alt text-primary ring-4 ring-bg-base transition-all duration-300 shadow-2xs',
            expandedTimeline === idx ? 'border-primary bg-primary-subtle scale-110' : 'border-border-main group-hover:border-primary group-hover:bg-primary-subtle group-hover:scale-110'
          ]">
            <AppIcon :name="event.icon" :size="14" class="text-primary" />
          </div>

          <!-- Timeline Event Card -->
          <div :class="[
            'ml-10 sm:ml-12 flex-1 rounded-xl border border-dashed p-3 sm:p-4.5 space-y-2 sm:space-y-3 transition-all duration-300 shadow-2xs active:scale-[0.99]',
            expandedTimeline === idx
              ? 'border-primary/80 bg-bg-alt shadow-md'
              : 'border-border-main bg-bg-alt/60 group-hover:border-primary/60 group-hover:bg-bg-alt'
          ]">
            <div class="space-y-1 min-w-0">
              <h4 class="text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-snug">
                {{ event.title }}
              </h4>
              <div class="flex items-center justify-between gap-2 pt-0.5">
                <p class="text-[11px] sm:text-xs font-semibold text-primary truncate">
                  {{ event.subtitle }}
                </p>
                <span
                  class="shrink-0 inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary-subtle px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-primary">
                  <AppIcon name="calendar" :size="10" />
                  <span>{{ event.year }}</span>
                </span>
              </div>
            </div>

            <!-- Mô Tả Chi Tiết: Bật Mở Khi Tap Trên Mobile Hoặc Tự Động Hiện Trên Desktop -->
            <p :class="[
              'text-xs leading-relaxed text-text-alt pt-2.5 border-t border-border-subtle transition-all duration-300',
              expandedTimeline === idx ? 'block' : 'hidden sm:block'
            ]">
              {{ event.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner Thông Tin Liên Hệ -->
    <section class="pt-2">
      <div @click="toggleCard('contact-banner')" :class="[
        'relative overflow-hidden rounded-2xl border bg-bg-alt/70 p-6 shadow-2xs transition-all duration-300 cursor-pointer select-none',
        activeCard === 'contact-banner'
          ? 'border-primary/80 bg-bg-alt shadow-md'
          : 'border-border-main hover:border-primary/60 hover:bg-bg-alt hover:shadow-md'
      ]">
        <div
          class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl opacity-0 hover:opacity-100 transition-opacity duration-500">
        </div>

        <div
          class="relative flex flex-col sm:flex-row items-center sm:items-center justify-between text-center sm:text-left gap-5">
          <div class="space-y-2 max-w-xl mx-auto sm:mx-0">
            <h4 class="text-base sm:text-lg font-bold text-text-main leading-snug">
              Bạn muốn trao đổi hoặc hợp tác?
            </h4>
            <p class="text-xs sm:text-sm leading-relaxed text-text-alt">
              Hãy thoải mái kết nối với mình qua Email hoặc các kênh truyền thông xã hội để cùng thảo luận về lập
              trình, an toàn thông tin hoặc ý tưởng dự án mới nhé!
            </p>
          </div>

          <div class="w-full sm:w-auto flex items-center justify-center shrink-0">
            <NuxtLink to="/contact"
              class="group/btn w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-primary/80 bg-primary-subtle/50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary shadow-2xs transition-all duration-200 hover:bg-primary hover:text-white cursor-pointer active:scale-95 select-none">
              <AppIcon name="send" :size="15" class="text-primary transition-colors group-hover/btn:text-white" />
              <span>Liên hệ ngay</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Table of Contents Button & Drawer (Chỉ hiển thị khi trang có từ 2 mục trở lên) -->
    <TableOfContents v-if="tocLinks.length > 1" :links="tocLinks" />
  </article>
</template>
