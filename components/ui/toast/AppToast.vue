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
    :gap="10"
    theme="system"
    close-button
    :toast-options="{
      classes: {
        toast: 'sonner-median-toast',
        title: 'sonner-median-title',
        description: 'sonner-median-desc',
        closeButton: 'sonner-median-close',
      },
    }"
  />
</template>

<style>
/* ===== Median UI Premium Sonner Theme Overrides ===== */

[data-sonner-toaster] {
  font-family: "Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

/* Base Toast Container */
[data-sonner-toaster] [data-sonner-toast] {
  --normal-bg: var(--color-bg-alt);
  --normal-border: var(--color-border-main);
  --normal-text: var(--color-text-main);
  background: var(--color-bg-alt) !important;
  border: 1px solid var(--color-border-main) !important;
  color: var(--color-text-main) !important;
  border-radius: 0.875rem !important; /* 14px */
  padding: 0.875rem 2.25rem 0.875rem 1rem !important;
  min-width: 320px !important;
  max-width: 420px !important;
  align-items: flex-start !important;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 12px 24px -4px rgba(0, 0, 0, 0.12) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Dark mode contrast enhancement */
.dark [data-sonner-toaster] [data-sonner-toast] {
  background: #1e293b !important; /* High contrast elevated slate-800 */
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 20px 40px -8px rgba(0, 0, 0, 0.5),
    0 8px 16px -4px rgba(0, 0, 0, 0.3) !important;
}

/* Icon Container & Custom Badge Styling (Perfectly Aligned) */
[data-sonner-toaster] [data-sonner-toast] [data-icon] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 9999px !important;
  margin-right: 0.75rem !important;
  margin-top: 0.0625rem !important;
  flex-shrink: 0 !important;
  align-self: flex-start !important;
}

[data-sonner-toaster] [data-sonner-toast] [data-icon] svg {
  display: block !important;
  width: 1rem !important;
  height: 1rem !important;
  margin: 0 !important;
}

/* Status Type Colors for Icons */
[data-sonner-toaster] [data-sonner-toast][data-type="success"] [data-icon] {
  color: #10b981 !important;
  background-color: rgba(16, 185, 129, 0.14) !important;
  border: 1px solid rgba(16, 185, 129, 0.25) !important;
}

[data-sonner-toaster] [data-sonner-toast][data-type="error"] [data-icon] {
  color: #f43f5e !important;
  background-color: rgba(244, 63, 94, 0.14) !important;
  border: 1px solid rgba(244, 63, 94, 0.25) !important;
}

[data-sonner-toaster] [data-sonner-toast][data-type="warning"] [data-icon] {
  color: #f59e0b !important;
  background-color: rgba(245, 158, 11, 0.14) !important;
  border: 1px solid rgba(245, 158, 11, 0.25) !important;
}

[data-sonner-toaster] [data-sonner-toast][data-type="info"] [data-icon] {
  color: var(--color-primary, #6366f1) !important;
  background-color: var(--color-primary-light, rgba(99, 102, 241, 0.14)) !important;
  border: 1px solid rgba(99, 102, 241, 0.25) !important;
}

/* Title text typography */
[data-sonner-toaster] [data-sonner-toast] [data-title] {
  font-size: 0.8125rem !important; /* 13px */
  font-weight: 700 !important;
  line-height: 1.35 !important;
  color: var(--color-text-main) !important;
  letter-spacing: -0.01em !important;
}

.dark [data-sonner-toaster] [data-sonner-toast] [data-title] {
  color: #f8fafc !important;
}

/* Description text typography */
[data-sonner-toaster] [data-sonner-toast] [data-description] {
  font-size: 0.75rem !important; /* 12px */
  font-weight: 400 !important;
  line-height: 1.45 !important;
  color: #334155 !important; /* Slate-700 for high contrast in light mode */
  margin-top: 0.125rem !important;
}

.dark [data-sonner-toaster] [data-sonner-toast] [data-description] {
  color: #cbd5e1 !important; /* Slate-300 for bright, crisp legibility in dark mode */
}

/* Clean Dismiss/Close Button (No Border, No Background) */
[data-sonner-toaster] [data-sonner-toast] [data-close-button] {
  position: absolute !important;
  top: 0.75rem !important;
  right: 0.75rem !important;
  left: auto !important;
  transform: none !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--color-text-alt) !important;
  border-radius: 0.375rem !important;
  width: 1.25rem !important;
  height: 1.25rem !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 0.55;
  transition: all 0.15s ease !important;
  cursor: pointer !important;
}

.dark [data-sonner-toaster] [data-sonner-toast] [data-close-button] {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #94a3b8 !important;
}

[data-sonner-toaster] [data-sonner-toast] [data-close-button]:hover {
  opacity: 1 !important;
  border: none !important;
  background: transparent !important;
  color: var(--color-text-main) !important;
}

.dark [data-sonner-toaster] [data-sonner-toast] [data-close-button]:hover {
  border: none !important;
  background: transparent !important;
  color: #ffffff !important;
}
</style>
