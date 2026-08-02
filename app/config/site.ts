export type LucideName =
  | 'archive'
  | 'arrow-up'
  | 'badge-percent'
  | 'book-open-text'
  | 'bookmark'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'copy'
  | 'external-link'
  | 'facebook'
  | 'file-text'
  | 'file-x'
  | 'folder'
  | 'github'
  | 'globe'
  | 'graduation-cap'
  | 'home'
  | 'layout-dashboard'
  | 'layout-grid'
  | 'link'
  | 'log-out'
  | 'mail'
  | 'menu'
  | 'message-square'
  | 'moon'
  | 'newspaper'
  | 'panel-left'
  | 'rocket'
  | 'search'
  | 'search-x'
  | 'send'
  | 'share-2'
  | 'shield'
  | 'shield-check'
  | 'sparkles'
  | 'sun'
  | 'tag'
  | 'twitter'
  | 'user'
  | 'x'
  | (string & {})

export interface NavChild {
  label: string
  to?: string
  href?: string
  external?: boolean
}

export interface NavItem {
  id: string
  label: string
  to?: string
  href?: string
  icon: LucideName
  badge?: string
  external?: boolean
  dividerAfter?: boolean
  children?: NavChild[]
}

export interface NavSocialIcons {
  label: string
  to?: string
  href?: string
  icon: LucideName
  external?: boolean
}

export interface AuthorSocial {
  name: string
  icon: LucideName
  href: string
}

export interface AuthorConfig {
  name: string
  handle: string
  avatar: string
  roleBadge: string
  bio: string
  email: string
  website: string
  socials: AuthorSocial[]
}

// Cấu hình tập trung cho Tác Giả Blog Cá Nhân
export const authorConfig: AuthorConfig = {
  name: "Lê Quân",
  handle: "@lequan81",
  avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL3yrcwWnlPeCOG6T3jtIoy42wtnpAvvPmo4s77w6SqVUi9xkSQam983z330vy7o-zOD77wK3qlMNIw5VhDcBAqMyJvtkcODRCf7FXXfsoCse2BRsdTXAPByodpi3C9zI/w40-h40-p-k-no-nu/juno-okyo-logo.png",
  roleBadge: "Blog cá nhân",
  bio: "Chia sẻ bài viết, trải nghiệm lập trình & công nghệ cá nhân.",
  email: "contact@lequan81.dev",
  website: "https://lequan81.dev",
  socials: [
    { name: "Facebook", icon: "facebook", href: "https://facebook.com/lequan81" },
    { name: "GitHub", icon: "github", href: "https://github.com/lequan81" },
    { name: "Website", icon: "globe", href: "https://lequan81.dev" },
    { name: "Email", icon: "mail", href: "mailto:contact@lequan81.dev" },
  ],
}

export const siteConfig = {
  name: "Lê Quân's Blog",
  shortName: 'Median UI',
  description:
    'A Nuxt-powered Median UI inspired personal blog focused on technology, programming, and personal sharing.',
  copyright: '2026. Lê Quân.',
  searchPlaceholder: 'e.g. Typography',
}

export const sidebarItems: NavItem[] = [
  {
    id: 'home',
    label: 'Trang chủ',
    to: '/',
    icon: 'home',
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'folder',
    children: [
      { label: 'Fshare Code', href: 'https://j2team.dev/fshare-code', external: true },
      { label: 'URL Shortener', href: 'https://j2team.dev', external: true },
      { label: 'Shopee Analytics', href: 'https://j2team.org', external: true },
      { label: 'ShopeeFood Analytics', href: 'https://j2team.org', external: true },
    ],
  },
  {
    id: 'communities',
    label: 'Communities',
    icon: 'folder',
    dividerAfter: true,
    children: [
      { label: 'J2TEAM Community', href: 'https://www.facebook.com/groups/j2team.community', external: true },
      { label: 'J2TEAM Relax', href: 'https://www.facebook.com/groups/j2team.relax', external: true },
      { label: 'J2TEAM Girls', href: 'https://www.facebook.com/groups/j2team.girls', external: true },
    ],
  },
  {
    id: 'about',
    label: 'About',
    to: '/about',
    icon: 'user',
  },
  {
    id: 'contact',
    label: 'Contact',
    to: '/contact',
    icon: 'mail',
  }
]

export const footerLinks: NavChild[] = [
  { label: 'Sitemap', to: '/sitemap' },
  { label: 'Terms of Service', to: '/tos' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Faq', to: '/faq' },
]

export const footerSocials: NavSocialIcons[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/lequan81', icon: 'facebook', external: true },
  { label: 'Twitter', href: 'https://twitter.com/lequan81', icon: 'twitter', external: true },
  { label: 'GitHub', href: 'https://github.com/lequan81', icon: 'github', external: true },
]

export const mobileNavItems: NavItem[] = [
  { id: 'home', label: 'Home', to: '/', icon: 'home' },
  { id: 'menu', label: 'Menu', icon: 'menu' },
  { id: 'saved', label: 'Saved', to: '/#saved', icon: 'bookmark' },
  { id: 'theme', label: 'Theme', icon: 'moon' },
]

export const postText = {
  pinnedTitle: 'Pinned Post',
  latestTitle: 'Bài đăng mới nhất',
  allStoriesTitle: 'All stories',
  relatedTitle: 'Bạn có thể thích những bài đăng này',
  commentButton: 'Join the discussion',
  shareLabel: 'Chia sẻ:',
}
