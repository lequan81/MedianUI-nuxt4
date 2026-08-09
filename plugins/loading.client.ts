export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  const overlay = document.createElement("div");
  overlay.id = "global-loading-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("data-nosnippet", "");
  overlay.className =
    "fixed inset-0 z-9999 flex items-center justify-center bg-bg-base/95 dark:bg-bg-base/95 select-none pointer-events-none opacity-0 transform-gpu";

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

  let loadStartTime = 0;
  const MIN_SHOW_MS = 450;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let maxSafetyTimer: ReturnType<typeof setTimeout> | null = null;

  function showLoader() {
    if (timer) clearTimeout(timer);
    if (maxSafetyTimer) clearTimeout(maxSafetyTimer);

    loadStartTime = performance.now();

    // Instant show (0ms delay)
    overlay.style.transition = "none";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";

    // Fast 0.01ms keyframe animation clock reset to t=0ms
    if (gridLoader) {
      gridLoader.classList.remove("run-anim");
      void gridLoader.offsetWidth;
      gridLoader.classList.add("run-anim");
    }

    document.body.classList.add("page-loading");

    // Safety fallback: auto dismiss after 3.5s
    maxSafetyTimer = setTimeout(hideLoader, 3500);
  }

  function hideLoader() {
    if (maxSafetyTimer) clearTimeout(maxSafetyTimer);
    if (timer) clearTimeout(timer);

    const elapsed = Math.round(performance.now() - loadStartTime);
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    timer = setTimeout(() => {
      // Step 1: Render <main> behind opaque overlay
      document.body.classList.remove("page-loading");

      // Step 2: Double rAF to complete GPU layout & paint behind overlay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Step 3: Smooth 0.2s curtain fade-out
          overlay.style.transition = "opacity 0.2s ease-out";
          overlay.style.opacity = "0";
          overlay.style.pointerEvents = "none";

          if (gridLoader) {
            gridLoader.classList.remove("run-anim");
          }
        });
      });
    }, remaining);
  }

  // Native Pointer Capture for instant 0ms response before router processing
  if (import.meta.client) {
    window.addEventListener(
      "click",
      (e) => {
        const target = (e.target as HTMLElement)?.closest("a");
        if (target && target.getAttribute("href")?.startsWith("/")) {
          const href = target.getAttribute("href");
          if (href && href !== window.location.pathname) {
            showLoader();
          }
        }
      },
      { capture: true, passive: true }
    );
  }

  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      showLoader();
    }
  });

  nuxtApp.hook("page:finish", hideLoader);
  nuxtApp.hook("app:error", hideLoader);
});
