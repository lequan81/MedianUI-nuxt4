import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const MIN_DISPLAY_TIME = 220;

  const overlay = document.createElement("div");
  overlay.id = "global-loading-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("data-nosnippet", "");
  overlay.className =
    "fixed inset-0 z-9999 flex items-center justify-center bg-bg-base/90 dark:bg-bg-base/90 backdrop-blur-xs select-none pointer-events-none opacity-0 transition-opacity duration-200 ease-out transform-gpu";

  overlay.innerHTML = `
    <div class="grid-loader">
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
      <div class="grid-subloader bg-primary"></div>
    </div>
  `;

  document.body.appendChild(overlay);
  const loader = overlay.querySelector(".grid-loader") as HTMLElement | null;

  let showTimer: ReturnType<typeof setTimeout> | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let safetyTimer: ReturnType<typeof setTimeout> | null = null;
  let startTime = 0;
  let isVisible = false;
  let isNavigating = false;

  function show() {
    isNavigating = true;
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    if (safetyTimer) clearTimeout(safetyTimer);

    // Hiển thị loader ngay khi bắt đầu chuyển trang
    showTimer = setTimeout(() => {
      if (!isNavigating) return;
      isVisible = true;
      startTime = performance.now();
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
      loader?.classList.add("run-anim");
      document.body.classList.add("page-loading");
    }, 40);

    // Timeout an toàn tối đa 4s tránh kẹt vĩnh viễn
    safetyTimer = setTimeout(forceHide, 4000);
  }

  async function waitForNewPageImage(): Promise<void> {
    // Đợi 2 frames để Vue render xong cây DOM của trang mới
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const img = document.querySelector<HTMLImageElement>(
      "article .prose-content img, article img, [data-hero-img]"
    );

    if (!img) return;
    if (img.complete && img.naturalHeight > 0) return;

    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      const timeout = setTimeout(done, 1200);

      if (typeof img.decode === "function") {
        img.decode().then(() => {
          clearTimeout(timeout);
          done();
        }).catch(() => {
          clearTimeout(timeout);
          done();
        });
      } else {
        img.addEventListener("load", () => {
          clearTimeout(timeout);
          done();
        }, { once: true });
        img.addEventListener("error", () => {
          clearTimeout(timeout);
          done();
        }, { once: true });
      }
    });
  }

  async function onPageFinish() {
    isNavigating = false;
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }

    if (!isVisible) {
      forceHide();
      return;
    }

    // Nếu chuyển vào trang blog chi tiết, đợi ảnh hero/thumbnail nạp xong
    if (router.currentRoute.value.path.startsWith("/blog/")) {
      await waitForNewPageImage();
    }

    // Đảm bảo DOM trang mới đã vẽ lên màn hình trước khi fade out loader
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(forceHide, remaining);
      });
    });
  }

  function forceHide() {
    isNavigating = false;
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    if (safetyTimer) clearTimeout(safetyTimer);
    showTimer = null;
    hideTimer = null;
    safetyTimer = null;
    isVisible = false;

    document.body.classList.remove("page-loading");
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    loader?.classList.remove("run-anim");
  }

  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.path !== from.path) {
      show();
    }
  });

  // QUAN TRỌNG: CHỈ ẩn loader khi Nuxt đã hoàn tất mount & render trang mới (hook page:finish)
  // Tuyệt đối không gọi trong router.afterEach vì sau đó Vue mới bắt đầu nạp DOM trang mới!
  nuxtApp.hook("page:finish", onPageFinish);
  nuxtApp.hook("page:transition:finish", onPageFinish);
  nuxtApp.hook("app:error", forceHide);
});
