<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <!-- vue-sonner Toaster: center-top, max 2 visible, Median UI themed -->
  <Toaster
    position="top-center"
    :visible-toasts="2"
    :duration="4000"
    :offset="20"
    :gap="8"
    theme="system"
    rich-colors
    close-button
    :toast-options="{
      classes: {
        toast: 'sonner-median',
        title: 'sonner-median-title',
        description: 'sonner-median-desc',
        closeButton: 'sonner-median-close',
      },
    }"
  />
</template>

<style>
/* ===== Median UI Sonner Theme Override ===== */

/* Base toast card — match Median UI card aesthetic */
[data-sonner-toaster] [data-sonner-toast] {
  --normal-bg: var(--color-bg-alt);
  --normal-border: var(--color-border-main);
  --normal-text: var(--color-text-main);
  font-family: "Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  border-radius: 0.75rem;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Title text */
[data-sonner-toaster] [data-sonner-toast] [data-title] {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-main);
}

/* Description text */
[data-sonner-toaster] [data-sonner-toast] [data-description] {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-alt);
}

/* Close button */
[data-sonner-toaster] [data-sonner-toast] [data-close-button] {
  border: 1px solid var(--color-border-main) !important;
  background: var(--color-bg-sec) !important;
  color: var(--color-text-muted) !important;
}

[data-sonner-toaster] [data-sonner-toast] [data-close-button]:hover {
  background: var(--color-border-main) !important;
  color: var(--color-text-main) !important;
}

/* Dark mode shadow boost */
.dark [data-sonner-toaster] [data-sonner-toast] {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 12px 40px rgba(0, 0, 0, 0.35);
}
</style>
