import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === "undefined" || import.meta.dev) return;

  // Lắng nghe khi browser rảnh rỗi (requestIdleCallback) để tải trước ảnh nổi bật
  const scheduleIdleTask = (callback: () => void) => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(callback, { timeout: 3000 });
    } else {
      setTimeout(callback, 2000);
    }
  };

  nuxtApp.hook("app:mounted", () => {
    scheduleIdleTask(() => {
      // Chỉ tải trước tài nguyên ẢNH (Image Preloading) - an toàn 100%, không bị stale HTML/UI
      const imagesToPrefetch = [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
      ];

      imagesToPrefetch.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    });
  });
});
