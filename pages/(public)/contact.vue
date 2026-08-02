<script setup lang="ts">
import { ref } from "vue";
import { useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";
import { authorConfig } from "~/app/config/site";

useSeoMeta({
  title: "Liên hệ - Lê Quân (@lequan81)",
  description: "Trang liên hệ trực tiếp với Lê Quân (@lequan81). Gửi tin nhắn, góp ý hoặc trao đổi hợp tác dự án.",
});

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);

function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.message) return;

  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    isSubmitted.value = true;
    form.value = { name: "", email: "", subject: "", message: "" };
  }, 1000);
}
</script>

<template>
  <article class="mx-auto max-w-5xl space-y-6">
    <!-- Header Title Chuẩn Spacing Giống Hệt Trang About 100% -->
    <div class="space-y-1.5">
      <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-text-alt mb-3">
        <NuxtLink to="/" class="shrink-0 text-text-muted transition-colors hover:text-primary">Trang chủ</NuxtLink>
        <span class="text-text-muted">/</span>
        <span class="truncate font-semibold text-text-main">Liên hệ</span>
      </nav>
      <h1 class="text-2xl font-bold text-text-main">
        Liên hệ
      </h1>
    </div>

    <!-- Layout 2 Cột Preline UI Dài Rộng Ngang (max-w-5xl) -->
    <div class="grid gap-6 lg:gap-8 lg:grid-cols-12 items-stretch">
      <!-- Cột Trái (Preline UI Icon-Blocks & Author Profile Card Tích Hợp Socials - Nét Đứt Highlight - 5 Cols) -->
      <div class="lg:col-span-5 flex flex-col justify-between space-y-4">
        <!-- Profile Header Block Tích Hợp Social Mashup Icons Bar Với Borderline (Nét Đứt Highlight) -->
        <div
          class="group relative overflow-hidden rounded-xl border border-dashed border-border-main bg-bg-alt/60 p-5 space-y-3.5 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt">
          <div class="flex items-center gap-3">
            <!-- Avatar Viền Ring CSS Tròn Tuyệt Đối 100% Không Lệch Hàng -->
            <img :src="authorConfig.avatar" :alt="authorConfig.name"
              class="h-9.5 w-9.5 shrink-0 rounded-full object-cover ring-2 ring-primary/20 shadow-xs transition-all duration-300 hover:ring-primary hover:scale-105 cursor-pointer" />
            <div class="min-w-0 flex-1">
              <h2
                class="text-sm sm:text-base font-bold text-text-main leading-tight group-hover:text-primary transition-colors">
                {{ authorConfig.name }}
              </h2>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="text-xs font-semibold text-primary">
                  {{ authorConfig.handle }}
                </span>
                <span class="text-xs text-text-muted">•</span>
                <span
                  class="inline-flex items-center rounded bg-primary-subtle/80 px-1.5 py-0.2 text-[11px] font-semibold text-primary">
                  23 tuổi
                </span>
              </div>
            </div>
          </div>

          <p class="text-xs leading-relaxed text-text-alt pt-0.5">
            Software Engineer & Tech Blogger. Đam mê nghiên cứu công nghệ mới, an toàn thông tin và xây dựng sản phẩm
            web tối ưu trải nghiệm đọc.
          </p>

          <!-- Social Icons Bar Tích Hợp Trực Tiếp Phân Cách Bằng Borderline -->
          <div class="pt-3.5 border-t border-border-subtle flex items-center gap-1.5">
            <a v-for="social in authorConfig.socials" :key="social.name" :href="social.href" target="_blank"
              rel="noreferrer" :title="social.name" :aria-label="social.name"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-border-main bg-bg-sec text-text-main transition-all duration-200 hover:border-primary hover:text-primary hover:bg-primary-subtle/40 hover:scale-105 shadow-2xs">
              <AppIcon :name="social.icon" :size="14" class="shrink-0" />
            </a>
          </div>
        </div>

        <!-- Preline UI Icon Blocks List (Email, Response Time, Location - Nét Đứt Highlight) -->
        <div
          class="group relative overflow-hidden rounded-xl border border-dashed border-border-main bg-bg-alt/60 p-5 space-y-3.5 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt flex-1 flex flex-col justify-center">
          <!-- Item 1: Email Block -->
          <div class="flex items-start gap-3">
            <div
              class="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-transform duration-300 group-hover:scale-105">
              <AppIcon name="mail" :size="15" />
            </div>
            <div class="space-y-0.5 min-w-0">
              <h3 class="text-xs font-bold text-text-main">Email trực tiếp</h3>
              <a :href="`mailto:${authorConfig.email}`"
                class="text-xs font-semibold text-primary hover:underline transition-colors block truncate">
                {{ authorConfig.email }}
              </a>
            </div>
          </div>

          <!-- Item 2: Response Time Block -->
          <div class="flex items-start gap-3 pt-3 border-t border-border-subtle">
            <div
              class="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-transform duration-300 group-hover:scale-105">
              <AppIcon name="clock" :size="15" />
            </div>
            <div class="space-y-0.5 min-w-0">
              <h3 class="text-xs font-bold text-text-main">Thời gian phản hồi</h3>
              <p class="text-xs text-text-alt">
                Cam kết phản hồi tin nhắn trong &lt; 24 giờ
              </p>
            </div>
          </div>

          <!-- Item 3: Location Block -->
          <div class="flex items-start gap-3 pt-3 border-t border-border-subtle">
            <div
              class="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-transform duration-300 group-hover:scale-105">
              <AppIcon name="map-pin" :size="15" />
            </div>
            <div class="space-y-0.5 min-w-0">
              <h3 class="text-xs font-bold text-text-main">Vị trí địa lý</h3>
              <p class="text-xs text-text-alt">
                Việt Nam (Múi giờ UTC+07:00)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột Phải (Contact Form Block - Viền Solid Active Tự Động Khi Focus) -->
      <div class="lg:col-span-7 flex flex-col">
        <div
          class="group relative overflow-hidden rounded-xl border border-border-main bg-bg-alt/60 p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:border-primary/60 hover:bg-bg-alt hover:shadow-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 focus-within:bg-bg-alt flex-1 flex flex-col justify-between space-y-4">
          <div
            class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500">
          </div>

          <div class="relative flex items-center justify-between gap-2 border-b border-border-subtle pb-3.5">
            <h3
              class="text-sm sm:text-base font-bold text-text-main group-hover:text-primary group-focus-within:text-primary transition-colors flex items-center gap-2">
              <AppIcon name="send" :size="15" class="text-primary shrink-0" />
              <span>Gửi tin nhắn trực tiếp</span>
            </h3>
            <span class="text-[11px] font-medium text-text-muted">Nhận phản hồi sớm nhất</span>
          </div>

          <!-- Alert Tin Nhắn Đã Gửi -->
          <div v-if="isSubmitted"
            class="relative my-auto rounded-xl border border-primary/30 bg-primary-subtle/30 p-6 text-center space-y-3">
            <div
              class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm">
              <AppIcon name="sparkles" :size="18" />
            </div>
            <h4 class="text-sm font-bold text-text-main">Cảm ơn bạn đã liên hệ!</h4>
            <p class="text-xs text-text-alt max-w-sm mx-auto leading-relaxed">
              Tin nhắn của bạn đã được gửi thành công. Mình sẽ phản hồi qua Email trong thời gian sớm nhất.
            </p>
            <button type="button"
              class="inline-flex rounded-lg border border-primary bg-bg-sec px-4 py-2 text-xs font-semibold text-primary shadow-2xs transition-all hover:bg-primary hover:text-white cursor-pointer"
              @click="isSubmitted = false">
              Gửi tin nhắn khác
            </button>
          </div>

          <!-- Form Fields Dài Rộng Theo Chiều Ngang -->
          <form v-else class="relative flex-1 flex flex-col justify-between space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-3.5">
              <div class="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label class="block text-xs font-medium text-text-main/90 pb-1.5">
                    Họ và tên <span class="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input v-model="form.name" type="text" required placeholder="Nhập tên của bạn"
                    class="w-full rounded-lg border border-border-main bg-bg-sec px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs" />
                </div>

                <div>
                  <label class="block text-xs font-medium text-text-main/90 pb-1.5">
                    Email <span class="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input v-model="form.email" type="email" required placeholder="your.email@example.com"
                    class="w-full rounded-lg border border-border-main bg-bg-sec px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-text-main/90 pb-1.5">
                  Tiêu đề
                </label>
                <input v-model="form.subject" type="text" placeholder="Tiêu đề lời nhắn (không bắt buộc)"
                  class="w-full rounded-lg border border-border-main bg-bg-sec px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs" />
              </div>

              <div>
                <label class="block text-xs font-medium text-text-main/90 pb-1.5">
                  Nội dung tin nhắn <span class="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <textarea v-model="form.message" required rows="4"
                  placeholder="Nội dung bạn muốn trao đổi với Lê Quân..."
                  class="w-full rounded-lg border border-border-main bg-bg-sec p-3.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs resize-y"></textarea>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button type="submit" :disabled="isSubmitting"
                class="group/btn inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-bg-sec px-5 py-2.5 text-xs font-semibold text-primary shadow-2xs transition-all duration-200 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer">
                <AppIcon v-if="!isSubmitting" name="send" :size="13"
                  class="text-primary transition-colors group-hover/btn:text-white" />
                <span>{{ isSubmitting ? "Đang gửi..." : "Gửi tin nhắn ngay" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </article>
</template>
