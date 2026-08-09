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
  author?: CommentAuthor;
  content: string;
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
