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
  | (string & {});

export * from "./author";
export * from "./navigation";

export const siteConfig = {
  name: "Lê Quân's Blog",
  shortName: 'Median UI',
  description:
    'A Nuxt-powered Median UI inspired personal blog focused on technology, programming, and personal sharing.',
  copyright: '2026. Lê Quân.',
  searchPlaceholder: 'e.g. Typography',
};

export const postText = {
  pinnedTitle: 'Pinned Post',
  latestTitle: 'Bài đăng mới nhất',
  allStoriesTitle: 'All stories',
  relatedTitle: 'Bạn có thể thích những bài đăng này',
  commentButton: 'Join the discussion',
  shareLabel: 'Chia sẻ:',
};
