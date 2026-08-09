import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { autoUpdate, computePosition, flip, offset, shift, type Placement } from "@floating-ui/dom";

export interface UseFloatingPopoverOptions {
  placement?: Placement;
  offsetDistance?: number;
  padding?: number;
  headerOffset?: number;
}

export function useFloatingPopover(
  referenceRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  isOpenRef: Ref<boolean>,
  options: UseFloatingPopoverOptions = {}
) {
  const { placement = "top", offsetDistance = 8, padding = 12, headerOffset = 75 } = options;
  const x = ref<number>(-9999);
  const y = ref<number>(-9999);
  const currentPlacement = ref<Placement>(placement);
  const isPositioned = ref<boolean>(false);

  let cleanup: (() => void) | null = null;

  async function updatePosition() {
    if (!referenceRef.value || !floatingRef.value) return;

    try {
      const data = await computePosition(referenceRef.value, floatingRef.value, {
        placement,
        middleware: [
          offset(offsetDistance),
          flip({
            fallbackPlacements: ["bottom", "bottom-start", "top", "bottom-end"],
            padding: { top: headerOffset, bottom: padding, left: padding, right: padding },
          }),
          shift({
            padding: { top: headerOffset, bottom: padding, left: padding, right: padding },
          }),
        ],
      });

      x.value = data.x;
      y.value = data.y;
      currentPlacement.value = data.placement;
      isPositioned.value = true;
    } catch {
      // Fallback
    }
  }

  function setupAutoUpdate() {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }

    if (import.meta.client && referenceRef.value && floatingRef.value) {
      cleanup = autoUpdate(referenceRef.value, floatingRef.value, updatePosition, {
        elementResize: true,
        animationFrame: true,
      });
    }
  }

  watch(
    [referenceRef, floatingRef, isOpenRef],
    () => {
      if (isOpenRef.value) {
        setupAutoUpdate();
        updatePosition();
      } else {
        if (cleanup) {
          cleanup();
          cleanup = null;
        }
      }
    },
    { flush: "post", immediate: true }
  );

  onMounted(() => {
    setupAutoUpdate();
    updatePosition();
  });

  onUnmounted(() => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  });

  return {
    x,
    y,
    currentPlacement,
    isPositioned,
    updatePosition,
  };
}
