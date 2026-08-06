// https://nuxt.com/docs/guide/directory-structure/app-config
export default defineAppConfig({
  site: {
    name: "Lê Quân's Blog",
    shortName: "Median UI",
    url: "https://lequan81.dev",
    description: "Chia sẻ bài viết, trải nghiệm lập trình & công nghệ cá nhân.",
    copyright: "2026. Lê Quân.",
    searchPlaceholder: "e.g. Typography",
    defaultLocale: "vi",
  },
  author: {
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
  },
  footerLinks: [
    { label: "Sitemap", href: "/sitemap.xml", external: true },
    { label: "Terms of Service", to: "/tos" },
    { label: "Disclaimer", to: "/disclaimer" },
    { label: "Privacy", to: "/privacy" },
    { label: "Faq", to: "/faq" },
  ],
  footerSocials: [
    { label: "Facebook", href: "https://www.facebook.com/lequan81", icon: "facebook", external: true },
    { label: "Twitter", href: "https://twitter.com/lequan81", icon: "twitter", external: true },
    { label: "GitHub", href: "https://github.com/lequan81", icon: "github", external: true },
  ],
  postText: {
    pinnedTitle: "Pinned Post",
    latestTitle: "Bài đăng mới nhất",
    allStoriesTitle: "All stories",
    relatedTitle: "Bạn có thể thích những bài đăng này",
    commentButton: "Join the discussion",
    shareLabel: "Chia sẻ:",
  },
});
