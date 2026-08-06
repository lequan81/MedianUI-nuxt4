import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  srcDir: ".",

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
      include: [],
      exclude: [
        "@nuxtjs/mdc",
        "remark-gfm",
        "remark-emoji",
        "remark-mdc",
        "remark-rehype",
        "rehype-raw",
        "parse5",
        "unist-util-visit",
        "unified",
        "debug",
        "extend",
      ],
    },
  },

  routeRules: {
    // Prevent search engine indexing for admin and API routes (noindex)
    "/admin/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/api/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },

    // Prerender các trang thông tin tĩnh (Zero server latency, HTML tĩnh 0ms)
    "/about": { prerender: true },
    "/tos": { prerender: true },
    "/privacy": { prerender: true },
    "/disclaimer": { prerender: true },
    "/faq": { prerender: true },
    "/contact": { prerender: true },

    // Cache trang chủ và bài viết dạng SWR (Stale-While-Revalidate)
    "/": { swr: 600 },
    "/blog/**": { swr: 3600 },
  },

  image: {
    domains: ["images.unsplash.com", "blogger.googleusercontent.com", "github.com", "avatars.githubusercontent.com"],
    format: ["webp"],
  },

  nitro: {
    prerender: {
      failOnError: false,
    },
  },

  // SEO & Site Metadata
  site: {
    url: "https://lequan81.dev",
    name: "Lê Quân (@lequan81) - Blog Cá Nhân",
    description: "Chia sẻ bài viết, trải nghiệm lập trình & công nghệ cá nhân.",
    defaultLocale: "vi",
  },

  robots: {
    allow: "/",
    sitemap: "https://lequan81.dev/sitemap.xml",
  },

  sitemap: {
    zeroRuntime: true,
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "Lê Quân (@lequan81) - Blog Cá Nhân",
      htmlAttrs: {
        lang: "vi",
      },
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('median_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})()`,
          type: "text/javascript",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Fira+Mono:wght@400;500&display=swap",
        },
      ],
    },
  },
  content: {
    experimental: { sqliteConnector: "bun" },
  },
});
