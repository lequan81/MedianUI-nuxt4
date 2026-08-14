import type { LucideName } from "~/types/ui";

export interface NavChild {
  readonly label: string;
  readonly to?: string;
  readonly href?: string;
  readonly external?: boolean;
}

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly to?: string;
  readonly href?: string;
  readonly icon: LucideName;
  readonly badge?: string;
  readonly external?: boolean;
  readonly dividerAfter?: boolean;
  readonly children?: readonly NavChild[];
}

export interface NavSocialIcons {
  readonly label: string;
  readonly to?: string;
  readonly href?: string;
  readonly icon: LucideName;
  readonly external?: boolean;
}

export interface BreadcrumbItem {
  readonly label: string;
  readonly to?: string;
}
