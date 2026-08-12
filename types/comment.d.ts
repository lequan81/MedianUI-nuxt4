import type { Ref } from "vue";

export interface CommentAuthor {
  name: string;
  avatar: string;
  isAuthor?: boolean;
}

export interface CommentItem {
  id: string;
  post_slug?: string;
  parent_id?: string | null;
  author_name?: string;
  author_email?: string;
  author_avatar?: string;
  author: CommentAuthor;
  content: string;
  status?: string;
  mod_flags?: number;
  mod_confidence?: number;
  mod_reason?: string;
  mod_source?: string;
  date?: string;
  created_at?: string;
  likes?: number;
  isAuthorLiked?: boolean;
  replyToAuthor?: string;
  replies?: CommentItem[];
}

export interface PaginatedCommentsResponse {
  comments: CommentItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type CommentReportReason = "spam" | "harassment" | "misinformation" | "other";

export interface CommentDiscussionState {
  isExpanded: boolean;
  newCommentText: string;
  visibleCount: number;
  isLoadingComments: boolean;
}

export interface CommentReplyState {
  activeReplyId: string | null;
  replyTargetAuthor?: string;
  replyText: string;
}

export interface CommentFeedbackState {
  likedCommentIds: Set<string>;
  reportedCommentIds: Set<string>;
  hiddenCommentIds: Set<string>;
}

export interface CommentCaptchaState {
  show: boolean;
  reason: string;
  token: string;
}

export interface CommentReportState {
  comment: CommentItem | null;
  reason: CommentReportReason;
  customText: string;
  shouldHide: boolean;
  isSubmitted: boolean;
}

export interface CommentContext {
  activeReplyId: Ref<string | null>;
  replyTargetAuthor: Ref<string | undefined>;
  replyText: Ref<string>;
  likedCommentIds: Ref<Set<string>>;
  reportedCommentIds: Ref<Set<string>>;
  hiddenCommentIds: Ref<Set<string>>;
  authorAvatar: string;
  toggleLike: (item: CommentItem) => void;
  openReportModal: (comment: CommentItem) => void;
  toggleHideComment: (id: string) => void;
  openReplyForm: (id: string, name?: string) => void;
  submitReply: (target: CommentItem) => void;
}
