import type { NavChild, NavItem, NavSocialIcons } from "~/types/navigation";
export type { NavChild, NavItem, NavSocialIcons };

export const sidebarItems: readonly NavItem[] = [
  {
    id: "home",
    label: "Trang chủ",
    to: "/",
    icon: "home",
  },
  {
    id: "products",
    label: "Products",
    icon: "folder",
    children: [
      {
        label: "Fshare Code",
        href: "https://j2team.dev/fshare-code",
        external: true,
      },
      { label: "URL Shortener", href: "https://j2team.dev", external: true },
      { label: "Shopee Analytics", href: "https://j2team.org", external: true },
      {
        label: "ShopeeFood Analytics",
        href: "https://j2team.org",
        external: true,
      },
    ],
  },
  {
    id: "communities",
    label: "Communities",
    icon: "folder",
    dividerAfter: true,
    children: [
      {
        label: "J2TEAM Community",
        href: "https://www.facebook.com/groups/j2team.community",
        external: true,
      },
      {
        label: "J2TEAM Relax",
        href: "https://www.facebook.com/groups/j2team.relax",
        external: true,
      },
      {
        label: "J2TEAM Girls",
        href: "https://www.facebook.com/groups/j2team.girls",
        external: true,
      },
    ],
  },
  {
    id: "about",
    label: "About",
    to: "/about",
    icon: "user",
  },
  {
    id: "contact",
    label: "Contact",
    to: "/contact",
    icon: "mail",
  },
];

export const adminSidebarItems: readonly NavItem[] = [
  { id: "admin-home", label: "Tổng quan Admin", icon: "home", to: "/admin" },
  {
    id: "admin-contacts",
    label: "Hòm thư liên hệ",
    icon: "mail",
    to: "/admin/contacts",
  },
  {
    id: "admin-settings",
    label: "Cài đặt Website",
    icon: "settings",
    to: "/admin/settings",
  },
  {
    id: "admin-website",
    label: "Xem Website",
    icon: "external-link",
    to: "/",
    dividerAfter: true,
  },
  {
    id: "admin-logout",
    label: "Đăng xuất",
    icon: "log-out",
    to: "/admin/login",
  },
];

export const footerLinks: readonly NavChild[] = [
  { label: "Sitemap", href: "/sitemap.xml", external: true },
  { label: "Terms of Service", to: "/tos" },
  { label: "Disclaimer", to: "/disclaimer" },
  { label: "Privacy", to: "/privacy" },
  { label: "Faq", to: "/faq" },
];

export const footerSocials: readonly NavSocialIcons[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/lequan81",
    icon: "facebook",
    external: true,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/lequan81",
    icon: "twitter",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/lequan81",
    icon: "github",
    external: true,
  },
];

export const mobileNavItems: readonly NavItem[] = [
  { id: "home", label: "Home", to: "/", icon: "home" },
  { id: "menu", label: "Menu", icon: "menu" },
  { id: "saved", label: "Saved", to: "/#saved", icon: "bookmark" },
  { id: "theme", label: "Theme", icon: "moon" },
];
