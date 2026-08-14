import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtPlugin((nuxtApp: any) => {
  const router = useRouter();

  const MIN_SHOW_MS = 250; // Smooth visual feedback duration without stalling navigation

  const overlay = document.createElement("div");
  overlay.id = "global-loading-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("data-nosnippet", "");
  overlay.className =
    "fixed inset-0 z-9999 flex items-center justify-center bg-bg-base/90 dark:bg-bg-base/90 select-none pointer-events-none opacity-0 transition-opacity duration-200 ease-out transform-gpu";

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
  const gridLoader = overlay.querySelector(".grid-loader") as HTMLElement;

  let showTimer: ReturnType<typeof setTimeout> | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let maxSafetyTimer: ReturnType<typeof setTimeout> | null = null;
  let shownAt = 0;
  let isShown = false;

  function showLoader() {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    if (maxSafetyTimer) clearTimeout(maxSafetyTimer);

    // If navigation takes longer than 60ms, display the smooth loading animation
    showTimer = setTimeout(() => {
      isShown = true;
      shownAt = performance.now();
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
      if (gridLoader) {
        gridLoader.classList.add("run-anim");
      }
      document.body.classList.add("page-loading");
    }, 60);

    maxSafetyTimer = setTimeout(forceHide, 3500);
  }

  function hideLoader() {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }

    if (!isShown) {
      forceHide();
      return;
    }

    const elapsed = performance.now() - shownAt;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(forceHide, remaining);
  }

  function forceHide() {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
    if (maxSafetyTimer) clearTimeout(maxSafetyTimer);
    showTimer = null;
    hideTimer = null;
    maxSafetyTimer = null;
    isShown = false;

    document.body.classList.remove("page-loading");
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    if (gridLoader) {
      gridLoader.classList.remove("run-anim");
    }
  }

  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.path !== from.path) {
      showLoader();
    }
  });

  nuxtApp.hook("page:finish", hideLoader);
  nuxtApp.hook("app:error", forceHide);
});
