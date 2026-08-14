<script setup lang="ts">
import { navigateTo } from "#imports";

definePageMeta({
  middleware: [
    () => navigateTo("/admin/contacts"),
  ],
});
</script>

<template>
  <div class="p-8 text-center text-xs text-text-muted">
    Đang chuyển hướng đến Hòm thư liên hệ...
  </div>
</template>
