import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  srcDir: ".",
  css: ["~/assets/css/main.css"],

  components: [
    { path: "~/components/ui", pathPrefix: false },
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
      include: ["@iconify/vue", "@floating-ui/dom", "valibot", "pinia"],
    },
  },

  site: {
    url: "https://lequan81.dev",
    name: "Lê Quân (@lequan81) - Blog Cá Nhân",
    description: "Chia sẻ bài viết, trải nghiệm lập trình & công nghệ cá nhân.",
    defaultLocale: "vi",
  } as any,

  robots: {
    allow: "/",
    sitemap: "https://lequan81.dev/sitemap.xml",
  },

  sitemap: {
    zeroRuntime: true,
  },

  image: {
    ipx: {
      maxAge: 31536000,
    },
    domains: [
      "images.unsplash.com",
      "blogger.googleusercontent.com",
      "lh3.googleusercontent.com",
      "1.bp.blogspot.com",
      "2.bp.blogspot.com",
      "3.bp.blogspot.com",
      "4.bp.blogspot.com",
      "github.com",
      "avatars.githubusercontent.com",
      "raw.githubusercontent.com",
    ],
    format: ["webp"],
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
