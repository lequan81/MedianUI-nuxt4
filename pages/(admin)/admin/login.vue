<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useSeoMeta, navigateTo } from "#imports";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

definePageMeta({
  layout: false, // Standalone Login Page Layout
});

useSeoMeta({
  title: "Đăng nhập Quản trị - Median UI",
  description: "Trang đăng nhập hệ thống quản trị Blog Median UI v1.7",
});

const form = reactive({
  password: "",
  showPassword: false,
  isLoading: false,
  errorMessage: "",
});

const passwordInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  passwordInputRef.value?.focus();
});

async function handleLogin() {
  if (!form.password.trim()) {
    form.errorMessage = "Vui lòng nhập mật khẩu quản trị viên.";
    return;
  }

  form.isLoading = true;
  form.errorMessage = "";

  try {
    await $fetch("/api/admin/auth/login", {
      method: "POST",
      body: { password: form.password },
    });

    await navigateTo("/admin");
  } catch (err: any) {
    if (err?.statusCode === 429) {
      const waitSec = err?.data?.data?.retryAfter || 60;
      form.errorMessage = `Bạn đã nhập sai quá số lần quy định. Vui lòng thử lại sau ${waitSec} giây.`;
    } else {
      form.errorMessage =
        err?.data?.data?.message ||
        err?.data?.message ||
        "Mật khẩu quản trị không chính xác. Vui lòng thử lại.";
    }
  } finally {
    form.isLoading = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-bg-base text-text-main flex flex-col items-center justify-center p-4 selection:bg-primary/20"
  >
    <div class="w-full max-w-sm space-y-6">
      <!-- Top Brand Header -->
      <div class="text-center space-y-2">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 group">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md transition-transform group-hover:scale-105"
          >
            <AppIcon name="shield" :size="22" />
          </div>
          <span class="text-xl font-bold text-text-main tracking-tight">
            Median UI <span class="text-primary">Admin</span>
          </span>
        </NuxtLink>
        <p class="text-xs text-text-alt">
          Cổng truy cập bảng điều khiển hệ thống
        </p>
      </div>

      <!-- Login Form Card With Preline / Median UI Vibe -->
      <div
        class="overflow-hidden rounded-2xl border border-border-main bg-bg-alt/90 p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-5"
      >
        <div class="border-b border-border-subtle pb-4">
          <h1 class="text-base font-bold text-text-main">
            Xác thực Master Key
          </h1>
          <p class="text-xs text-text-alt mt-0.5">
            Nhập mật khẩu quản trị để mở khóa quyền điều hành.
          </p>
        </div>

        <!-- Error Alert -->
        <div
          v-if="form.errorMessage"
          class="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-500 font-medium"
        >
          <AppIcon name="alert-circle" :size="16" class="shrink-0 mt-0.5" />
          <span class="leading-relaxed">{{ form.errorMessage }}</span>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <div class="flex items-center justify-between pb-1.5">
              <label for="admin-password" class="block text-xs font-medium text-text-main/90">
                Mật khẩu quản trị <span class="text-rose-500 font-bold ml-0.5">*</span>
              </label>
            </div>
            <div class="relative">
              <input
                id="admin-password"
                ref="passwordInputRef"
                v-model="form.password"
                :type="form.showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="Nhập mật khẩu quản trị..."
                class="w-full rounded-lg border border-border-main bg-bg-sec pl-9 pr-10 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs"
              />
              <div class="absolute left-3 top-2.5 text-text-muted pointer-events-none">
                <AppIcon name="lock" :size="15" />
              </div>

              <!-- Toggle Show/Hide Password -->
              <button
                type="button"
                tabindex="-1"
                class="absolute right-3 top-2.5 text-text-muted hover:text-text-main transition-colors cursor-pointer"
                :title="form.showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                @click="form.showPassword = !form.showPassword"
              >
                <AppIcon :name="form.showPassword ? 'eye-off' : 'eye'" :size="15" />
              </button>
            </div>
          </div>

          <div class="pt-1">
            <button
              type="submit"
              :disabled="form.isLoading"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <AppIcon v-if="!form.isLoading" name="shield" :size="15" />
              <span v-if="form.isLoading">Đang xác thực...</span>
              <span v-else>Mở khóa Bảng điều khiển</span>
            </button>
          </div>
        </form>

        <div
          class="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted"
        >
          <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center gap-1">
            <AppIcon name="arrow-left" :size="13" />
            <span>Về trang chủ</span>
          </NuxtLink>

          <span class="text-[11.5px] font-mono text-text-muted">Median UI v1.7</span>
        </div>
      </div>
    </div>
  </div>
</template>
