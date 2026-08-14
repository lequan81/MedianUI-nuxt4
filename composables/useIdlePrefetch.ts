import { preloadRouteComponents } from "#imports";

/**
 * Prefetches the route JS/CSS chunk immediately when the user hovers over a link.
 */
export function prefetchOnHover(path: string) {
  if (import.meta.client && typeof preloadRouteComponents === "function") {
    preloadRouteComponents(path).catch(() => {
      // Ignore prefetch failures
    });
  }
}

/**
 * Executes non-critical tasks when the main browser thread is idle.
 */
export function runWhenIdle(task: () => void, timeoutMs: number = 2000) {
  if (import.meta.client && "requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout: timeoutMs });
  } else {
    setTimeout(task, 250);
  }
}
