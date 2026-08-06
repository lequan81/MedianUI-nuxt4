import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import AppToast from "~/components/ui/AppToast.vue";
import { useToast } from "~/composables/useToast";

describe("AppToast UI Component Test", () => {
  const { toasts, success, error } = useToast();

  beforeEach(() => {
    toasts.value = [];
  });

  it("should render toast notification in DOM when toast is triggered", async () => {
    // 1. Mount component AppToast trong môi trường DOM giả lập happy-dom
    const wrapper = mount(AppToast);

    // Ban đầu chưa có toast nào ➔ DOM không có thẻ div.border-border-main
    expect(wrapper.text()).toBe("");

    // 2. Kích hoạt Toast success
    success("Thêm thành công bài viết!");
    await wrapper.vm.$nextTick();

    // 3. Kiểm tra DOM hiển thị đúng văn bản và class viền xanh emerald
    expect(wrapper.text()).toContain("Thêm thành công bài viết!");
    expect(wrapper.html()).toContain("border-l-emerald-500");
  });

  it("should remove toast from DOM when clicking close button", async () => {
    error("Thông báo lỗi hệ thống!");
    const wrapper = mount(AppToast);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Thông báo lỗi hệ thống!");

    // Giả lập người dùng bấm nút Đóng (Close Button)
    const closeBtn = wrapper.find("button[aria-label='Đóng thông báo']");
    expect(closeBtn.exists()).toBe(true);

    await closeBtn.trigger("click");
    await wrapper.vm.$nextTick();

    // Toast đã bị gỡ khỏi DOM
    expect(wrapper.text()).not.toContain("Thông báo lỗi hệ thống!");
  });
});
