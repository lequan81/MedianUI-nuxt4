import type { AuthorConfig } from "~/app/config/author";

export interface PostPrice {
  original: string;
  sale: string;
}

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
  price?: PostPrice;
  discount?: string;
  isProduct?: boolean;
  body?: any;
}
