import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  experimental: {
    asyncContext: true,
  },


  nitro: {
    preset: "bun",
    compressPublicAssets: { gzip: true, brotli: true },
    prerender: {
      concurrency: 1,
      failOnError: false,
    },
  },


  routeRules: {
    "/": { isr: 60 },
    "/blog/**": { isr: 300 },
    "/about": { prerender: true },
    "/contact": { prerender: true },
    "/faq": { prerender: true },
    "/privacy": { prerender: true },
    "/tos": { prerender: true },
    "/disclaimer": { prerender: true },
    "/admin/**": { ssr: false },
  },
  srcDir: ".",
  css: ["~/assets/css/main.css"],

  components: [
    { path: "~/components/ui", pathPrefix: false },
    { path: "~/components/server", pathPrefix: false },
    { path: "~/components/post", pathPrefix: false },
    { path: "~/components/layout", pathPrefix: false },
    { path: "~/components", pathPrefix: false },
  ],


  modules: [
    "@pinia/nuxt",
    "@nuxt/content",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxt/scripts",
    "@nuxt/image",
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@iconify/vue", "@floating-ui/dom", "valibot", "pinia", "vue-sonner"],
    },
  },

  site: {
    url: "https://lequan81.dev",
    name: "Lê Quân (@lequan81) - Blog Cá Nhân",
    description: "Chia sẻ bài viết, trải nghiệm lập trình & công nghệ cá nhân.",
    defaultLocale: "vi",
  } as any,

  robots: {
    groups: [
      {
        userAgent: ["*"],
        allow: ["/"],
        disallow: ["/admin", "/admin/**", "/api/admin/**"],
      },
    ],
    sitemap: "https://lequan81.dev/sitemap.xml",
  },

  sitemap: {
    zeroRuntime: true,
  },

  image: {
    providers: {
      direct: {
        name: "direct",
        provider: "~/providers/direct.ts",
      },
    },
    provider: "direct",
  },

  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      title: "Lê Quân (@lequan81) - Blog Cá Nhân",
      htmlAttrs: {
        lang: "vi",
      },
      meta: [
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { name: "description", content: "Chia sẻ bài viết, trải nghiệm lập trình & công nghệ cá nhân." },
      ],

      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('median_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})()`,
          type: "text/javascript",
        },
      ],
      link: [
        { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
        { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
        { rel: "dns-prefetch", href: "https://images.unsplash.com" },
        { rel: "dns-prefetch", href: "https://flagcdn.com" },
        { rel: "dns-prefetch", href: "https://blogger.googleusercontent.com" },
        { rel: "dns-prefetch", href: "https://api.dicebear.com" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Fira+Mono:wght@400;500&display=swap",
        },

      ],
    },
  },

  content: {
    experimental: { sqliteConnector: "bun" },
  },
});

