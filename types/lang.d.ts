export type SupportedLocale = "vi" | "en";

export interface LanguageItem {
  readonly code: SupportedLocale;
  readonly countryCode: string;
  readonly name: string;
  readonly localName: string;
  readonly flag: string;
  readonly flagUrl: string;
}

export type SupportedLanguage = LanguageItem;
