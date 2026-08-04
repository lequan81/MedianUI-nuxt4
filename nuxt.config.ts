import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  srcDir: ".",
  css: ["~/assets/css/main.css"],
  modules: ["@pinia/nuxt", "@nuxt/content"],
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
  app: {
    head: {
      title: "Lê Quân (@lequan81) - Blog Cá Nhân",
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('median_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})()`,
          type: 'text/javascript',
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
