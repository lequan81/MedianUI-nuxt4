import { siteConfig, authorConfig, postText } from "~/app/config/site";
import {
  footerLinks,
  footerSocials,
  sidebarItems,
  adminSidebarItems,
  mobileNavItems,
} from "~/app/config/navigation";
import { postConfig } from "~/app/config/post";

// https://nuxt.com/docs/guide/directory-structure/app-config
export default defineAppConfig({
  site: siteConfig,
  author: authorConfig,
  navigation: {
    sidebarItems,
    adminSidebarItems,
    footerLinks,
    footerSocials,
    mobileNavItems,
  },
  postText,
  postConfig,
});
