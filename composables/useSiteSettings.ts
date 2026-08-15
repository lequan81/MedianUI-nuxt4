import { computed, ref } from "vue";
import { DEFAULT_SITE_SETTINGS } from "~/app/config/defaults";
import type { FullSiteSettings } from "~/types/settings";

export function useSiteSettings() {
  const settingsState =
    typeof useState === "function"
      ? useState<FullSiteSettings>("site_settings", () => DEFAULT_SITE_SETTINGS)
      : ref<FullSiteSettings>(DEFAULT_SITE_SETTINGS);

  // Fetch from server on initial SSR / client hydration when in Nuxt app context
  if (typeof useAsyncData === "function") {
    try {
      useAsyncData("site-settings-data", async () => {
        try {
          if (typeof $fetch === "function") {
            const res = await $fetch<{ success: boolean; data: FullSiteSettings }>("/api/settings");
            if (res?.success && res.data) {
              settingsState.value = res.data;
            }
          }
        } catch {
          // Gracefully maintain defaults
        }
        return settingsState.value;
      });
    } catch {
      // Fallback in isolated unit test runner
    }
  }

  const getLocale = (): "vi" | "en" => {
    try {
      if (typeof useNuxtApp === "function") {
        const nuxtApp = useNuxtApp() as any;
        if (nuxtApp?.$i18n?.locale?.value) {
          return nuxtApp.$i18n.locale.value === "en" ? "en" : "vi";
        }
      }
    } catch {
      // Fallback
    }
    return "vi";
  };

  const general = computed(() => {
    const locale = getLocale();
    const g = settingsState.value.general || DEFAULT_SITE_SETTINGS.general;
    return {
      title: g.title?.[locale] || g.title?.vi || "Median UI v1.7",
      description: g.description?.[locale] || g.description?.vi || "",
      tagline: g.tagline?.[locale] || g.tagline?.vi || "",
      logo: g.logo || "",
      siteUrl: g.siteUrl || "https://lequan81.dev",
    };
  });

  const author = computed(() => {
    const locale = getLocale();
    const a = settingsState.value.author || DEFAULT_SITE_SETTINGS.author;
    return {
      name: a.name || "Lê Quân",
      avatar: a.avatar || DEFAULT_SITE_SETTINGS.author.avatar,
      location: a.location || "Việt Nam",
      bio: a.bio?.[locale] || a.bio?.vi || DEFAULT_SITE_SETTINGS.author.bio.vi,
      socials: a.socials || DEFAULT_SITE_SETTINGS.author.socials,
    };
  });

  const navigation = computed(() => {
    const locale = getLocale();
    const nav = settingsState.value.navigation || DEFAULT_SITE_SETTINGS.navigation;
    return nav
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        id: item.id,
        name: item.label?.[locale] || item.label?.vi || item.to,
        to: item.to,
        icon: item.icon || "link",
        order: item.order,
      }));
  });

  const announcement = computed(() => {
    const locale = getLocale();
    const ann = settingsState.value.announcement || DEFAULT_SITE_SETTINGS.announcement;
    return {
      enabled: Boolean(ann.enabled),
      id: ann.id || "median-v1.7.0-release",
      badge: ann.badge?.[locale] || ann.badge?.vi || "Mới",
      text: ann.text?.[locale] || ann.text?.vi || "",
      link: ann.link || "/blog",
    };
  });

  return {
    rawSettings: settingsState,
    general,
    author,
    navigation,
    announcement,
  };
}
