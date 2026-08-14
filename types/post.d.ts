import type { AuthorConfig } from "~/types/author";

export interface PostItem {
  path: string;
  stem?: string;
  title: string;
  snippet?: string;
  category: string;
  tags?: string[];
  date: string;
  updatedAt?: string;
  publishedAt?: string;
  createdAt?: string;
  published?: string;
  author?: string | Partial<AuthorConfig> | any;
  readTime?: string;
  comments?: number;
  image?: string;
  pinned?: boolean;
  body?: any;
}

export interface TocItem {
  id: string;
  text: string;
  depth: number;
  children?: TocItem[];
}
