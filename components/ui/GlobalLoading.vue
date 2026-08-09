<template>
  <!-- Overlay luôn có trong DOM, ẩn/hiện hoàn toàn bằng CSS class trên body -->
  <div
    id="global-loading-overlay"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-base/75 dark:bg-bg-base/85 backdrop-blur-xl select-none pointer-events-none opacity-0 transition-opacity duration-150"
    aria-hidden="true"
    data-nosnippet
  >
    <div class="grid-loader">
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
    </div>
  </div>
</template>
