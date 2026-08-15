import type { AuthorConfig } from "~/types/author";

export interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}

export type TocItem = TocLink;

export interface PostItem {
  path: string;
  stem?: string;
  title: string;
  snippet?: string;
  category: string;
  tags?: string[];
  maxTags?: number;
  date: string;
  updatedAt?: string;
  publishedAt?: string;
  createdAt?: string;
  published?: string;
  author?: string | Partial<AuthorConfig>;
  readTime?: string;
  comments?: number;
  image?: string;
  pinned?: boolean;
  body?: unknown;
}
