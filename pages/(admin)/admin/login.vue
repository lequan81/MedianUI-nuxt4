<script setup lang="ts">
import { ref } from "vue";
import { useSeoMeta, navigateTo } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

definePageMeta({
  layout: false, // Standalone Login Page Layout
});

useSeoMeta({
  title: "Đăng nhập Quản trị - Median UI",
  description: "Trang đăng nhập hệ thống quản trị Blog Median UI v1.7",
});

const username = ref("admin");
const password = ref("admin123");
const isLoading = ref(false);

function handleLogin() {
  isLoading.value = true;

  // Demo Mode: Bấm Enter hoặc Click là vào thẳng Dashboard Admin
  setTimeout(() => {
    isLoading.value = false;
    navigateTo("/admin");
  }, 400);
}
</script>

<template>
  <div class="min-h-screen bg-bg-base text-text-main flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md space-y-6">
      <!-- Top Brand Header -->
      <div class="text-center space-y-2">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5 group">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md transition-transform group-hover:scale-105">
            <AppIcon name="shield-check" :size="22" />
          </div>
          <span class="text-xl font-bold text-text-main tracking-tight">
            Median UI <span class="text-primary">Admin</span>
          </span>
        </NuxtLink>
        <p class="text-xs text-text-alt">
          Hệ thống Quản trị Blog & Nội dung Cá nhân (Demo Mode)
        </p>
      </div>

      <!-- Login Form Card With Preline / Median UI Vibe -->
      <div class="overflow-hidden rounded-2xl border border-dashed border-border-main bg-bg-alt/80 p-6 sm:p-8 shadow-md backdrop-blur-md space-y-5">
        <div class="border-b border-border-subtle pb-4">
          <h1 class="text-base font-bold text-text-main">
            Đăng nhập tài khoản
          </h1>
          <p class="text-xs text-text-alt mt-0.5">
            Chế độ Demo: Nhấn <kbd class="rounded bg-bg-sec px-1.5 py-0.5 text-[10px] font-mono border border-border-subtle">Enter</kbd> hoặc nút bên dưới để truy cập ngay.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-medium text-text-main/90 pb-1.5">
              Tên tài khoản hoặc Email
            </label>
            <div class="relative">
              <input
                v-model="username"
                type="text"
                required
                placeholder="admin"
                class="w-full rounded-lg border border-border-main bg-bg-sec pl-9 pr-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs"
                @keyup.enter="handleLogin"
              />
              <div class="absolute left-3 top-2.5 text-text-muted">
                <AppIcon name="user" :size="15" />
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between pb-1.5">
              <label class="block text-xs font-medium text-text-main/90">
                Mật khẩu
              </label>
              <span class="text-[11px] font-semibold text-primary">Demo sẵn</span>
            </div>
            <div class="relative">
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full rounded-lg border border-border-main bg-bg-sec pl-9 pr-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs"
                @keyup.enter="handleLogin"
              />
              <div class="absolute left-3 top-2.5 text-text-muted">
                <AppIcon name="lock" :size="15" />
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <AppIcon v-if="!isLoading" name="log-in" :size="15" />
              <span>{{ isLoading ? "Đang truy cập..." : "Đăng nhập ngay (Enter)" }}</span>
            </button>
          </div>
        </form>

        <div class="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
          <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center gap-1">
            <AppIcon name="arrow-left" :size="13" />
            <span>Về trang chủ</span>
          </NuxtLink>

          <span class="text-[11px] text-text-muted">Median UI v1.7</span>
        </div>
      </div>
    </div>
  </div>
</template>
