import { db, queryOne } from "~/server/db/client";
import { DEFAULT_SITE_SETTINGS } from "~/app/config/defaults";
import type {
  FullSiteSettings,
  GeneralSettings,
  AuthorSettings,
  NavigationItem,
  AnnouncementSettings,
} from "~/types/settings";

// In-Memory Singleton Cache for sub-millisecond public response
let cachedSettings: FullSiteSettings | null = null;

export function invalidateSettingsCache(): void {
  cachedSettings = null;
}

export function getRawSetting<T>(key: string, fallback: T): T {
  try {
    const row = queryOne<{ value: string }>("SELECT value FROM site_settings WHERE key = ?", key);
    if (row && row.value) {
      return JSON.parse(row.value) as T;
    }
  } catch {
    // Fallback if table not ready
  }
  return fallback;
}

export function getAllSettings(): FullSiteSettings {
  if (cachedSettings) {
    return cachedSettings;
  }

  const general = getRawSetting<GeneralSettings>("general", DEFAULT_SITE_SETTINGS.general);
  const author = getRawSetting<AuthorSettings>("author", DEFAULT_SITE_SETTINGS.author);
  const navigation = getRawSetting<NavigationItem[]>("navigation", DEFAULT_SITE_SETTINGS.navigation);
  const announcement = getRawSetting<AnnouncementSettings>("announcement", DEFAULT_SITE_SETTINGS.announcement);

  cachedSettings = {
    general,
    author,
    navigation: Array.isArray(navigation)
      ? navigation.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : DEFAULT_SITE_SETTINGS.navigation,
    announcement,
  };

  return cachedSettings;
}

export function saveSettingSection<K extends keyof FullSiteSettings>(key: K, data: FullSiteSettings[K]): void {
  const serialized = JSON.stringify(data);
  const existing = queryOne<{ key: string }>("SELECT key FROM site_settings WHERE key = ?", key);

  if (existing) {
    db.prepare("UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?").run(serialized, key);
  } else {
    db.prepare("INSERT INTO site_settings (key, value) VALUES (?, ?)").run(key, serialized);
  }

  invalidateSettingsCache();
}

export function saveAllSettings(fullSettings: Partial<FullSiteSettings>): void {
  if (fullSettings.general) saveSettingSection("general", fullSettings.general);
  if (fullSettings.author) saveSettingSection("author", fullSettings.author);
  if (fullSettings.navigation) saveSettingSection("navigation", fullSettings.navigation);
  if (fullSettings.announcement) saveSettingSection("announcement", fullSettings.announcement);

  invalidateSettingsCache();
}
