export type { SupportedLocale, SupportedLanguage } from "~/app/config/languages";

export interface LanguageItem {
  readonly code: string;
  readonly countryCode: string;
  readonly name: string;
  readonly localName: string;
  readonly flag: string;
  readonly flagUrl: string;
}
