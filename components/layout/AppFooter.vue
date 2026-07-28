<template>
  <footer class="w-full bg-(--color-bg-card) border-t border-border-main mt-12 py-8 px-4 sm:px-6 transition-colors">
    <div
      class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-(--color-text-muted)">
      <!-- Left: Logo & Copyright -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="flex items-center gap-2 font-bold text-sm text-text-main">
          <div class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">M
          </div>
          Median UI v1.7
        </div>
        <span class="hidden sm:inline text-border-main">|</span>
        <span>&copy; {{ new Date().getFullYear() }} Median UI. Reconstructed with Nuxt 4 &amp; Tailwind CSS v4.</span>
      </div>

      <!-- Right: Links -->
      <div class="flex items-center gap-4 font-medium">
        <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
        <a href="#" class="hover:text-primary transition-colors">Documentation</a>
        <a href="#" class="hover:text-primary transition-colors">Sitemap</a>
      </div>
    </div>
  </footer>
</template>
