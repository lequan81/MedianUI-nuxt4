import type { FullSiteSettings } from "~/types/settings";
import type { LanguageItem, SupportedLocale, SupportedLanguage } from "~/types/lang";

/**
 * ── Single Source of Truth (SSOT) Language Runtime Configuration ────────
 */
export const SUPPORTED_LANGUAGES: readonly LanguageItem[] = [
  { code: "vi", countryCode: "vn", name: "Vietnamese", localName: "Tiếng Việt", flag: "🇻🇳", flagUrl: "https://flagcdn.com/w40/vn.png" },
  { code: "en", countryCode: "us", name: "English", localName: "English", flag: "🇺🇸", flagUrl: "https://flagcdn.com/w40/us.png" },
] as const;

export const SUPPORTED_LOCALE_SET: ReadonlySet<string> = new Set<SupportedLocale>(
  SUPPORTED_LANGUAGES.map((lang) => lang.code)
);

export function isSupportedLocale(code: string): code is SupportedLocale {
  return SUPPORTED_LOCALE_SET.has(code as SupportedLocale);
}

export const I18N_LOCALES = ["vi", "en"] as const;
export type I18nLocale = SupportedLocale;

export const I18N_LOCALE_SET: ReadonlySet<string> = new Set<SupportedLocale>(I18N_LOCALES);

export function isI18nLocale(code: string): code is SupportedLocale {
  return I18N_LOCALE_SET.has(code as SupportedLocale);
}

/**
 * ── Single Source of Truth (SSOT) Site Settings Runtime Configuration ────
 */
export const DEFAULT_SITE_SETTINGS: FullSiteSettings = {
  general: {
    title: {
      vi: "Median UI v1.7",
      en: "Median UI v1.7",
    },
    description: {
      vi: "Blog giao diện Median UI hiện đại trên nền Nuxt 4 và Tailwind CSS v4.",
      en: "Modern Median UI blog rebuilt with Nuxt 4 and Tailwind CSS v4.",
    },
    tagline: {
      vi: "Chia sẻ kiến thức lập trình & thiết kế giao diện",
      en: "Sharing programming insights & UI design",
    },
    logo: "",
    siteUrl: "https://lequan81.dev",
  },
  author: {
    name: "Lê Quân",
    avatar: "https://avatars.githubusercontent.com/u/10897086?v=4",
    location: "Việt Nam (UTC+07:00)",
    bio: {
      vi: "Đam mê công nghệ, kiến trúc phần mềm và thiết kế trải nghiệm người dùng hiện đại.",
      en: "Passionate about technology, software architecture, and modern UX design.",
    },
    socials: {
      facebook: "https://facebook.com/lequan81",
      github: "https://github.com/lequan81dev",
      twitter: "https://twitter.com/lequan81",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    },
  },
  navigation: [
    { id: "nav-home", label: { vi: "Trang chủ", en: "Home" }, to: "/", icon: "home", order: 0 },
    { id: "nav-tech", label: { vi: "Công nghệ", en: "Technology" }, to: "/?category=Technology", icon: "folder", order: 1 },
    { id: "nav-lifestyle", label: { vi: "Đời sống", en: "Lifestyle" }, to: "/?category=Lifestyle", icon: "sparkles", order: 2 },
    { id: "nav-about", label: { vi: "Giới thiệu", en: "About" }, to: "/about", icon: "user", order: 3 },
    { id: "nav-contact", label: { vi: "Liên hệ", en: "Contact" }, to: "/contact", icon: "mail", order: 4 },
  ],
  announcement: {
    enabled: true,
    id: "median-v1.7.0-release",
    badge: {
      vi: "Mới",
      en: "New",
    },
    text: {
      vi: "Chào mừng bạn đến với Median UI v1.7 tái thiết kế với Nuxt 4 & Tailwind v4!",
      en: "Welcome to Median UI v1.7 reconstructed with Nuxt 4 & Tailwind CSS v4!",
    },
    link: "/blog/median-ui-blogger-template",
  },
};

export const authorConfig = {
  name: DEFAULT_SITE_SETTINGS.author.name,
  handle: "@lequan81",
  avatar: DEFAULT_SITE_SETTINGS.author.avatar,
  roleBadge: "Blog cá nhân",
  bio: DEFAULT_SITE_SETTINGS.author.bio.vi,
  email: "contact@lequan81.dev",
  website: DEFAULT_SITE_SETTINGS.general.siteUrl,
  socials: [
    { name: "Facebook", icon: "facebook", href: DEFAULT_SITE_SETTINGS.author.socials.facebook || "https://facebook.com" },
    { name: "GitHub", icon: "github", href: DEFAULT_SITE_SETTINGS.author.socials.github || "https://github.com" },
    { name: "Twitter", icon: "twitter", href: DEFAULT_SITE_SETTINGS.author.socials.twitter || "https://twitter.com" },
  ],
} as const;

export const siteConfig = {
  name: DEFAULT_SITE_SETTINGS.general.title.vi,
  shortName: "Median UI",
  description: DEFAULT_SITE_SETTINGS.general.description.vi,
  copyright: `2026. ${DEFAULT_SITE_SETTINGS.author.name}.`,
  searchPlaceholder: "e.g. Typography",
};
