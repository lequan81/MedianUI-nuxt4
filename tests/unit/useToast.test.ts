import { describe, it, expect, vi } from "vitest";

// Mock vue-sonner since it's a third-party library
vi.mock("vue-sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  Toaster: { name: "Toaster", template: "<div />" },
}));

import { useToast } from "~/composables/useToast";
import { toast } from "vue-sonner";

describe("useToast Composable (vue-sonner wrapper)", () => {
  it("should call toast.success with correct title and description", () => {
    const { success } = useToast();
    success("Gửi tin nhắn thành công!");
    expect(toast.success).toHaveBeenCalledWith("Thành công", {
      description: "Gửi tin nhắn thành công!",
    });
  });

  it("should call toast.error with longer duration", () => {
    const { error } = useToast();
    error("Có lỗi máy chủ xảy ra.");
    expect(toast.error).toHaveBeenCalledWith("Thao tác thất bại", {
      description: "Có lỗi máy chủ xảy ra.",
      duration: 6000,
    });
  });

  it("should call toast.warning", () => {
    const { warning } = useToast();
    warning("Bạn đang gửi quá nhanh.");
    expect(toast.warning).toHaveBeenCalledWith("Chú ý", {
      description: "Bạn đang gửi quá nhanh.",
      duration: 5000,
    });
  });

  it("should use custom title when provided", () => {
    const { success } = useToast();
    success("Message body", "Custom Title");
    expect(toast.success).toHaveBeenCalledWith("Custom Title", {
      description: "Message body",
    });
  });
});
