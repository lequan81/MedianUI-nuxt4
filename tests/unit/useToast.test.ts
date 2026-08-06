import { describe, it, expect, beforeEach } from "vitest";
import { useToast } from "~/composables/useToast";

describe("useToast Composable", () => {
  const { toasts, success, error, warning, removeToast } = useToast();

  beforeEach(() => {
    toasts.value = [];
  });

  it("should add success toast item correctly", () => {
    success("Gửi tin nhắn thành công!");
    expect(toasts.value.length).toBe(1);
    expect(toasts.value[0]?.type).toBe("success");
    expect(toasts.value[0]?.message).toBe("Gửi tin nhắn thành công!");
  });

  it("should add error toast item with longer default duration", () => {
    error("Có lỗi máy chủ xảy ra.");
    expect(toasts.value.length).toBe(1);
    expect(toasts.value[0]?.type).toBe("error");
    expect(toasts.value[0]?.duration).toBe(6000);
  });

  it("should add warning toast item", () => {
    warning("Bạn đang gửi quá nhanh.");
    expect(toasts.value.length).toBe(1);
    expect(toasts.value[0]?.type).toBe("warning");
  });

  it("should remove toast item by id", () => {
    success("Message 1");
    error("Message 2");
    expect(toasts.value.length).toBe(2);

    const firstId = toasts.value[0]?.id || "";
    removeToast(firstId);

    expect(toasts.value.length).toBe(1);
    expect(toasts.value[0]?.message).toBe("Message 2");
  });
});
