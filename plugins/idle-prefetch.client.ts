import { preloadRouteComponents } from "#imports";

const prefetchedUrls = new Set<string>();

function prefetchImage(url: string) {
  if (!url || prefetchedUrls.has(url) || typeof document === "undefined") return;
  prefetchedUrls.add(url);

  const img = new Image();
  img.src = url;
  if (typeof img.decode === "function") {
    img.decode().catch(() => {});
  }

  try {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  } catch {}
}

function runWhenIdle(callback: () => void, timeout = 2000) {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 400);
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  const staticRoutes = ["/about", "/contact", "/admin/login"];

  function prefetchPageResources() {
    // 1. Prefetch above-the-fold images
    setTimeout(() => {
      const images = document.querySelectorAll<HTMLImageElement>("img[src]");
      images.forEach((img) => {
        const src = img.src || img.getAttribute("src");
        if (src) prefetchImage(src);
      });
    }, 100);

    // 2. Preload core routes during idle periods
    runWhenIdle(() => {
      staticRoutes.forEach((path) => {
        preloadRouteComponents(path).catch(() => {});
      });
    }, 1200);

    // 3. Preload in-viewport blog links
    runWhenIdle(() => {
      const blogLinks = document.querySelectorAll<HTMLAnchorElement>("a[href^='/blog']");
      blogLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href) {
          preloadRouteComponents(href).catch(() => {});
        }
      });
    }, 2500);
  }

  nuxtApp.hook("page:finish", prefetchPageResources);

  if (document.readyState === "complete") {
    prefetchPageResources();
  } else {
    window.addEventListener("load", prefetchPageResources, { once: true });
  }
});
