import { ref, onMounted, onUnmounted, watch, type Ref } from "vue";
import { computePosition, flip, shift, offset, type Placement } from "@floating-ui/dom";

export interface UseFloatingPopoverOptions {
  placement?: Placement;
  offsetDistance?: number;
  padding?: number;
}

export function useFloatingPopover(
  referenceRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  isOpenRef: Ref<boolean>,
  options: UseFloatingPopoverOptions = {}
) {
  const { placement = "top", offsetDistance = 8, padding = 8 } = options;
  const x = ref<number>(0);
  const y = ref<number>(0);

  async function updatePosition() {
    if (!referenceRef.value || !floatingRef.value || !isOpenRef.value) return;

    const data = await computePosition(referenceRef.value, floatingRef.value, {
      placement,
      middleware: [
        offset(offsetDistance),
        flip({ fallbackPlacements: ["bottom", "top", "right", "left"] }),
        shift({ padding }),
      ],
    });

    x.value = data.x;
    y.value = data.y;
  }

  watch([referenceRef, floatingRef, isOpenRef], () => {
    if (isOpenRef.value) {
      updatePosition();
    }
  });

  onMounted(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    }
  });

  return {
    x,
    y,
    updatePosition,
  };
}
