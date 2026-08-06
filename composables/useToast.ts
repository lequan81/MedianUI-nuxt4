import { ref } from "vue";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
}

const toasts = ref<ToastItem[]>([]);

export function useToast() {
  function addToast(toast: Omit<ToastItem, "id">) {
    const id = typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now() + Math.random());
    const duration = toast.duration ?? 4000;

    const newItem: ToastItem = {
      ...toast,
      id,
    };

    toasts.value.push(newItem);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function success(message: string, title?: string) {
    addToast({ type: "success", message, title });
  }

  function error(message: string, title?: string) {
    addToast({ type: "error", message, title, duration: 6000 });
  }

  function warning(message: string, title?: string) {
    addToast({ type: "warning", message, title, duration: 5000 });
  }

  function info(message: string, title?: string) {
    addToast({ type: "info", message, title });
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
