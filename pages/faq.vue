<script setup lang="ts">
import { ref } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

useSeoMeta({
  title: "Câu hỏi thường gặp (FAQ) - Lê Quân (@lequan81)",
  description: "Giải đáp các câu hỏi thường gặp về blog cá nhân và nội dung chia sẻ của Lê Quân.",
});

const activeFaq = ref<number | null>(0);

const faqs = [
  {
    q: "Blog này chia sẻ những nội dung chủ đạo nào?",
    a: "Blog tập trung chia sẻ các bài viết thực tế về phát triển Web hiện đại (Vue 3, Nuxt 4, TypeScript, Node.js, Tailwind CSS v4), kỹ thuật tối ưu UI/UX, kinh nghiệm bảo mật web và thủ thuật phần mềm hữu ích."
  },
  {
    q: "Tôi có thể sử dụng mã nguồn và trích dẫn bài viết không?",
    a: "Có. Bạn hoàn toàn có thể tham khảo mã nguồn và trích dẫn bài viết cho mục đích học tập cá nhân phi thương mại. Vui lòng ghi rõ nguồn tác giả Lê Quân và đính kèm đường link dẫn về bài viết gốc trên lequan81.dev."
  },
  {
    q: "Website được xây dựng dựa trên các công nghệ nào?",
    a: "Website được phát triển trên nền tảng Nuxt 4, Vue 3, Bun Runtime và Tailwind CSS v4, lấy cảm hứng từ thiết kế Median UI v1.7 kết hợp với chuẩn mực giao diện Preline UI cao cấp."
  },
  {
    q: "Làm thế nào để liên hệ trực tiếp hoặc gửi ý kiến đóng góp?",
    a: "Bạn có thể truy cập trang Liên Hệ hoặc gửi email trực tiếp tới contact@lequan81.dev. Mình luôn hoan nghênh và sẵn sàng lắng nghe các đóng góp ý kiến từ bạn đọc."
  }
];

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index;
}
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-8">
    <!-- Header Title Chuẩn Match 100% Trang About & Contact -->
    <div class="space-y-1.5">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-3">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Câu hỏi thường gặp</span>
      </nav>

      <h1 class="text-2xl font-bold text-text-main">
        Câu Hỏi Thường Gặp (FAQ)
      </h1>

      <div class="flex items-center gap-1.5 pt-0.5 text-xs text-text-muted italic">
        <AppIcon name="clock" :size="13" class="text-primary shrink-0" />
        <span>Cập nhật lần cuối: 01 tháng 08, 2026</span>
      </div>
    </div>

    <p class="text-xs sm:text-sm text-text-alt leading-relaxed">
      Tổng hợp giải đáp cho những thắc mắc phổ biến của người đọc khi trải nghiệm blog cá nhân của Lê Quân.
    </p>

    <!-- Preline UI Accordion Block List (Viền Solid) -->
    <div class="space-y-3">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt shadow-2xs"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between p-4.5 sm:p-5 text-left font-bold text-xs sm:text-sm text-text-main cursor-pointer hover:text-primary transition-colors"
          @click="toggleFaq(index)"
        >
          <span class="flex items-center gap-3">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-xs font-bold text-primary">
              {{ index + 1 }}
            </span>
            <span>{{ item.q }}</span>
          </span>
          <AppIcon
            name="chevron-down"
            :size="16"
            :class="[
              'shrink-0 text-text-muted transition-transform duration-200 ml-2',
              activeFaq === index ? 'rotate-180 text-primary' : ''
            ]"
          />
        </button>
        <div
          v-show="activeFaq === index"
          class="px-4.5 pb-4.5 sm:px-5 sm:pb-5 text-xs sm:text-sm leading-relaxed text-text-alt border-t border-border-subtle pt-3.5 pl-13.5"
        >
          {{ item.a }}
        </div>
      </div>
    </div>

    <!-- Preline UI Banner Hỗ Trợ (Viền Solid) -->
    <div class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 p-5 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-text-main">Vẫn còn thắc mắc khác?</h3>
          <p class="text-xs text-text-alt">Nếu chưa tìm thấy câu trả lời phù hợp, bạn có thể gửi câu hỏi trực tiếp cho mình.</p>
        </div>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-bg-sec px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white shrink-0 shadow-2xs"
        >
          <AppIcon name="help-circle" :size="13" />
          <span>Đặt câu hỏi ngay</span>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
