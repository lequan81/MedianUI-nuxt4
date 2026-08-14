import { onBeforeUnmount, ref, type Ref } from "vue";

/**
 * Safe timer composable that automatically cleans up on component unmount / scope disposal.
 */
export function useTimeout() {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function set(fn: () => void, delayMs: number) {
    clear();
    timer = setTimeout(fn, delayMs);
    return timer;
  }

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  onBeforeUnmount(clear);

  return {
    set,
    clear,
  };
}

/**
 * Creates a reactive ref that temporarily changes value, then automatically resets after durationMs.
 * Completely leak-free with automatic onBeforeUnmount timer cleanup.
 */
export function useAutoReset<T>(
  defaultValue: T,
  resetValue: T = defaultValue,
  durationMs: number = 2000
): {
  state: Ref<T>;
  trigger: (temporaryValue: T) => void;
  reset: () => void;
} {
  const state = ref<T>(defaultValue) as Ref<T>;
  const { set, clear } = useTimeout();

  function trigger(temporaryValue: T) {
    state.value = temporaryValue;
    set(() => {
      state.value = resetValue;
    }, durationMs);
  }

  function reset() {
    clear();
    state.value = resetValue;
  }

  return {
    state,
    trigger,
    reset,
  };
}
