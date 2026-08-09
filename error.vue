<script setup lang="ts">
import { clearError } from "#imports";

defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="error-page">
    <NotFoundBlock
      :status-code="error?.statusCode || 404"
      :title="error?.statusCode === 404 ? 'Page Not Found' : 'System Error'"
      :message="error?.message || 'Bài viết hoặc trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn không hợp lệ.'"
      @back="handleError"
    />
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

.error-footer {
  position: absolute;
  bottom: 1.25rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>

