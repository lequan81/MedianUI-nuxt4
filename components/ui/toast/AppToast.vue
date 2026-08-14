<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <!-- vue-sonner Toaster: center-top, max 2 visible, Median UI themed via assets/css/components/toast.css -->
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
