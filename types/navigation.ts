import type { LucideName } from "~/app/config/site";

export interface NavChild {
  label: string;
  to?: string;
  href?: string;
  external?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  to?: string;
  href?: string;
  icon: LucideName;
  badge?: string;
  external?: boolean;
  dividerAfter?: boolean;
  children?: NavChild[];
}

export interface NavSocialIcons {
  label: string;
  to?: string;
  href?: string;
  icon: LucideName;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}
