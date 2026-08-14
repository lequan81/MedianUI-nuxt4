import type { Ref } from "vue";
import type { PostItem } from "~/types/post";

export interface SeoOptions {
  title?: string | (() => string);
  description?: string | (() => string);
  image?: string | (() => string);
  type?: "website" | "article";
  publishedTime?: string | (() => string);
  jsonLdType?: "WebPage" | "BlogPosting";
  post?: Ref<PostItem | null> | PostItem | null;
}
