export interface I18nString {
  vi: string;
  en: string;
}

export interface GeneralSettings {
  title: I18nString;
  description: I18nString;
  tagline: I18nString;
  logo: string;
  siteUrl: string;
}

export interface SocialLinkItem {
  id: string;
  name: string;
  icon: string;
  href: string;
  order: number;
}

export interface AuthorSettings {
  name: string;
  avatar: string;
  location: string;
  bio: I18nString;
  socials: {
    facebook?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
  socialLinks?: SocialLinkItem[];
}

export interface NavigationChild {
  label: I18nString;
  to?: string;
  href?: string;
  isExternal?: boolean;
}

export interface NavigationItem {
  id: string;
  label: I18nString;
  to?: string;
  href?: string;
  icon: string;
  order: number;
  isExternal?: boolean;
  dividerAfter?: boolean;
  dividerBefore?: boolean;
  type?: "link" | "category" | "external" | "dropdown";
  children?: NavigationChild[];
}

export interface AnnouncementSettings {
  enabled: boolean;
  id: string;
  badge: I18nString;
  text: I18nString;
  link: string;
}

export interface FullSiteSettings {
  general: GeneralSettings;
  author: AuthorSettings;
  navigation: NavigationItem[];
  announcement: AnnouncementSettings;
}
