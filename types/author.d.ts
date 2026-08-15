import type { LucideName } from "~/types/ui";

export interface AuthorSocial {
  name?: string;
  label?: string;
  icon?: LucideName | string;
  href: string;
}

export interface AuthorConfig {
  name: string;
  handle: string;
  avatar: string;
  roleBadge: string;
  bio: string;
  email: string;
  website: string;
  socials: readonly AuthorSocial[];
}
