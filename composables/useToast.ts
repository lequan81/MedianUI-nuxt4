import { toast } from "vue-sonner";

/**
 * useToast() — thin wrapper around vue-sonner's `toast` API.
 * Keeps the same method signatures (success, error, warning, info)
 * so existing callers (useContactForm.ts, etc.) don't need changes.
 */
export function useToast() {
  function success(message: string, title?: string) {
    toast.success(title || "Thành công", {
      description: message,
    });
  }

  function error(message: string, title?: string) {
    toast.error(title || "Thao tác thất bại", {
      description: message,
      duration: 6000,
    });
  }

  function warning(message: string, title?: string) {
    toast.warning(title || "Chú ý", {
      description: message,
      duration: 5000,
    });
  }

  function info(message: string, title?: string) {
    toast.info(title || "Thông báo", {
      description: message,
    });
  }

  return {
    success,
    error,
    warning,
    info,
  };
}
