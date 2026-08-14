import type { SupportedLocale } from "~/app/config/languages";

export interface NuxtI18nComposer {
  locale: Ref<SupportedLocale>;
  locales: Ref<Array<{ code: SupportedLocale; name?: string }>>;
  t: (key: string, params?: Record<string, unknown>) => string;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  getLocaleCookie: () => string | undefined;
  setLocaleCookie: (locale: string) => void;
}

declare global {
  function useI18n(): NuxtI18nComposer;
}
