<script setup lang="ts">
import { ref } from "vue";
import { useSeoMeta, definePageMeta } from "#imports";

definePageMeta({
  hideSidebar: true,
});


const { data: page } = await useAsyncData("page-faq", async () => {
  return (await queryCollection("pages").path("/pages/faq").first()) || null;
});

useSeo({
  title: page.value?.title || "Câu hỏi thường gặp (FAQ)",
  description: page.value?.description || "Giải đáp các câu hỏi thường gặp về blog cá nhân và mã nguồn Median UI.",
});

const openIndex = ref<number | null>(null);

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i;
}

const faqs = [
  {
    q: "Blog này được xây dựng bằng công nghệ gì?",
    a: "Blog sử dụng Nuxt 3 (Vue 3) kết hợp Nuxt Content v3 để quản lý bài viết dưới dạng Markdown. Giao diện được style bằng Tailwind CSS v4 và deploy lên Vercel.",
  },
  {
    q: "Tôi có thể sử dụng source code của blog này không?",
    a: "Mã nguồn được chia sẻ để tham khảo và học tập. Bạn có thể fork và chỉnh sửa cho dự án cá nhân. Tuy nhiên, vui lòng không copy nguyên xi để phân phối thương mại mà không ghi nguồn.",
  },
  {
    q: "Làm sao để liên hệ với tác giả?",
    a: "Bạn có thể liên hệ qua trang Contact, hoặc gửi email trực tiếp theo địa chỉ được ghi trong phần About. Tôi thường phản hồi trong vòng 1–3 ngày làm việc.",
  },
  {
    q: "Bài viết được cập nhật theo tần suất nào?",
    a: "Tôi cố gắng xuất bản ít nhất 2–4 bài mỗi tháng, tập trung vào các chủ đề về web development, DevOps, bảo mật và kinh nghiệm lập trình thực tế.",
  },
  {
    q: "Tôi có thể đóng góp bài viết cho blog không?",
    a: "Hiện tại blog chỉ chấp nhận bài viết từ tác giả. Tuy nhiên nếu bạn có ý tưởng hay chủ đề muốn đề xuất, hãy liên hệ qua trang Contact — rất vui khi nghe ý kiến của bạn!",
  },
  {
    q: "Nội dung bài viết có bản quyền không?",
    a: "Tất cả nội dung gốc trên blog đều thuộc bản quyền tác giả. Bạn có thể chia sẻ link bài viết tự do, nhưng việc sao chép toàn bộ nội dung cần được ghi rõ nguồn và tác giả.",
  },
  {
    q: "Tại sao một số bài viết hiển thị tiếng Anh?",
    a: "Một số bài viết kỹ thuật được viết bằng tiếng Anh để phục vụ đối tượng quốc tế và tiện tra cứu các thuật ngữ chuyên ngành. Blog dần sẽ có cả hai phiên bản ngôn ngữ.",
  },
];
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-8">
    <!-- Header + Breadcrumb -->
    <div class="space-y-2">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-5">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">FAQ</span>
      </nav>
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-snug tracking-tight text-text-main">
        Câu hỏi thường gặp (FAQ)
      </h1>
      <p v-if="page?.updatedAt || page?.date" class="text-xs text-text-muted pt-0.5">
        Cập nhật lần cuối: {{ page?.updatedAt || page?.date }}
      </p>
    </div>

    <!-- Intro text from CMS -->
    <div v-if="page" class="prose-content">
      <ContentRenderer :value="page" />
    </div>

    <!-- Accordion FAQ -->
    <div class="space-y-3">
      <div v-for="(item, i) in faqs" :key="i" class="rounded-xl border transition-all duration-200" :class="openIndex === i
        ? 'border-primary/60 bg-bg-alt shadow-sm'
        : 'border-border-main bg-bg-alt/50 hover:border-border-main'">
        <!-- Question row -->
        <button type="button"
          class="flex w-full items-start justify-between gap-4 px-5 py-4 text-left cursor-pointer select-none"
          @click="toggle(i)">
          <span class="text-sm font-semibold leading-snug transition-colors"
            :class="openIndex === i ? 'text-primary' : 'text-text-main'">
            {{ item.q }}
          </span>
          <span class="mt-0.5 shrink-0 transition-transform duration-200"
            :class="openIndex === i ? 'rotate-180 text-primary' : 'text-text-muted'">
            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 6l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>

        <!-- Answer panel -->
        <div v-show="openIndex === i" class="px-5 pb-4 pt-0">
          <div class="border-t border-border-subtle pt-3">
            <p class="text-sm leading-relaxed text-text-muted">{{ item.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
