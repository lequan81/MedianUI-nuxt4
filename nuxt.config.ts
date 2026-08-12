import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";
import { getHeadScripts } from "./app/config/scripts";

const env = (import.meta.env || {}) as Record<string, string | undefined>;
const readEnv = (key: string, fallback = "") => process.env[key] || env[key] || fallback;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  experimental: {
    asyncContext: true,
  },



  runtimeConfig: {
    dbFileName: readEnv("DB_FILE_NAME", "lequan81dev_app.sqlite"),
    geminiApiKey: readEnv("GEMINI_API_KEY"),
    geminiModels: readEnv(
      "GEMINI_MODELS",
      "gemini-3.1-flash-lite,gemini-2.0-flash-lite,gemini-1.5-flash"
    ),
    geminiBaseUrl: readEnv(
      "GEMINI_BASE_URL",
      "https://generativelanguage.googleapis.com/v1beta/models"
    ),
    geminiTimeout: Number(readEnv("GEMINI_TIMEOUT", "3000")) || 3000,
    turnstileSecretKey: readEnv("TURNSTILE_SECRET_KEY", "1x0000000000000000000000000000000AA"),
    turnstileVerifyUrl: readEnv(
      "TURNSTILE_VERIFY_URL",
      "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    ),
    public: {
      turnstileSiteKey: readEnv("NUXT_PUBLIC_TURNSTILE_SITE_KEY", "1x00000000000000000000AA"),
      turnstileScriptUrl: readEnv(
        "NUXT_PUBLIC_TURNSTILE_SCRIPT_URL",
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      ),
    },
  },

  nitro: {
    preset: "bun",
    compressPublicAssets: { gzip: true, brotli: true },
    prerender: {
      concurrency: 1,
      failOnError: false,
    },
    ignore: ["**/.data/**", "**/server/db/**", "**/*.sqlite*"],
    watchOptions: {
      ignored: ["**/.data/**", "**/server/db/**", "**/*.sqlite*", "**/*.sqlite-wal*", "**/*.sqlite-shm*"],
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
    server: {
      watch: {
        ignored: ["**/.data/**", "**/server/db/**", "**/*.sqlite*", "**/*.sqlite-wal*", "**/*.sqlite-shm*"],
      },
    },
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
    sources: ["/api/__sitemap__/urls"],
    autoLastmod: true,
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
        {
          name: "description",
          content: "Chia sẻ bài viết, trải nghiệm lập trình & công nghệ cá nhân.",
        },
      ],
      script: getHeadScripts(
        readEnv(
          "NUXT_PUBLIC_TURNSTILE_SCRIPT_URL",
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        )
      ),
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
