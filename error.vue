<script setup lang="ts">
import { useError, clearError } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <!-- error.vue: Standalone Error Page với Mobile & Desktop UI/UX Responsive Tự Động -->
  <div class="error-page">
    <div class="error-content">
      <div class="not-found-number">{{ error?.statusCode || 404 }}</div>

      <div class="not-found-body">
        <h1 class="not-found-title">
          {{ error?.statusCode === 404 ? "Page Not Found" : "System Error" }}
        </h1>
        <p class="not-found-desc">
          {{ error?.message || "Bài viết hoặc trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn không hợp lệ." }}
        </p>
      </div>

      <div class="not-found-actions">
        <button type="button" class="not-found-btn-primary" @click="handleError">
          <AppIcon name="arrow-left" :size="16" />
          <span>Back to Home</span>
        </button>

        <NuxtLink to="/contact" class="not-found-btn-secondary">
          <AppIcon name="mail" :size="16" />
          <span>Contact Support</span>
        </NuxtLink>
      </div>
    </div>

    <footer class="error-footer">© 2026. Lê Quân.</footer>
  </div>
</template>

<style scoped>
.error-page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-base);
  color: var(--color-text-main);
  padding: 1.25rem 1rem;
  position: relative;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: clamp(1rem, 3dvh, 2.5rem);
  width: 100%;
}

.not-found-number {
  font-size: clamp(3.5rem, 12dvh, 9.5rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-primary);
  user-select: none;
}

.not-found-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.375rem, 1.2dvh, 0.875rem);
}

.not-found-title {
  font-size: clamp(1.125rem, 3.2dvh, 2.25rem);
  font-weight: 700;
  color: var(--color-text-main);
  letter-spacing: -0.02em;
}

.not-found-desc {
  font-size: clamp(0.7rem, 1.6dvh, 0.9rem);
  color: var(--color-text-alt);
  line-height: 1.6;
  max-width: 28rem;
}

.not-found-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  max-width: 20rem;
}

@media (min-width: 480px) {
  .not-found-actions {
    width: auto;
    max-width: none;
  }
}

.not-found-btn-primary,
.not-found-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.625rem;
  padding: 0.625rem 1.25rem;
  min-height: 42px;
  font-size: clamp(0.75rem, 1.5dvh, 0.875rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;
  width: 100%;
}

@media (min-width: 480px) {
  .not-found-btn-primary,
  .not-found-btn-secondary {
    width: auto;
  }
}

.not-found-btn-primary {
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.not-found-btn-primary:hover {
  background: var(--color-primary-hover);
}

.not-found-btn-secondary {
  border: 1px solid var(--color-border-main);
  background: color-mix(in srgb, var(--color-bg-alt) 80%, transparent);
  color: var(--color-text-main);
}

.not-found-btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.error-footer {
  position: absolute;
  bottom: 1.25rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
