import type { Placement } from "@floating-ui/dom";

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

export interface UseFloatingPopoverOptions {
  placement?: Placement;
  offsetDistance?: number;
  padding?: number;
  headerOffset?: number;
}
