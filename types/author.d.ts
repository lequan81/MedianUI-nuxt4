import type { LucideName } from "~/app/config/site";

export interface AuthorSocial {
  name?: string;
  label?: string;
  icon?: LucideName;
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
  socials: AuthorSocial[];
}
