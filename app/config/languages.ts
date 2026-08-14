export const SUPPORTED_LANGUAGES = [
  { code: "vi", countryCode: "vn", name: "Vietnamese", localName: "Tiếng Việt", flag: "🇻🇳", flagUrl: "https://flagcdn.com/w40/vn.png" },
  { code: "en", countryCode: "us", name: "English", localName: "English", flag: "🇺🇸", flagUrl: "https://flagcdn.com/w40/us.png" },
  { code: "ja", countryCode: "jp", name: "Japanese", localName: "日本語", flag: "🇯🇵", flagUrl: "https://flagcdn.com/w40/jp.png" },
  { code: "zh", countryCode: "cn", name: "Chinese", localName: "中文", flag: "🇨🇳", flagUrl: "https://flagcdn.com/w40/cn.png" },
  { code: "ko", countryCode: "kr", name: "Korean", localName: "한국어", flag: "🇰🇷", flagUrl: "https://flagcdn.com/w40/kr.png" },
  { code: "es", countryCode: "es", name: "Spanish", localName: "Español", flag: "🇪🇸", flagUrl: "https://flagcdn.com/w40/es.png" },
  { code: "fr", countryCode: "fr", name: "French", localName: "Français", flag: "🇫🇷", flagUrl: "https://flagcdn.com/w40/fr.png" },
  { code: "de", countryCode: "de", name: "German", localName: "Deutsch", flag: "🇩🇪", flagUrl: "https://flagcdn.com/w40/de.png" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type SupportedLocale = SupportedLanguage["code"];

export const SUPPORTED_LOCALE_SET: ReadonlySet<string> = new Set(
  SUPPORTED_LANGUAGES.map((lang) => lang.code)
);

export function isSupportedLocale(code: string): code is SupportedLocale {
  return SUPPORTED_LOCALE_SET.has(code);
}
