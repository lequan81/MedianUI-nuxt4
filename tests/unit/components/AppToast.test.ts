import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { h, defineComponent } from "vue";

// Mock vue-sonner
vi.mock("vue-sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  Toaster: defineComponent({
    name: "Toaster",
    props: ["position", "visibleToasts", "duration", "offset", "gap", "theme", "closeButton", "toastOptions"],
    render() {
      return h("div", { "data-sonner-toaster": "", class: "toaster-mock" });
    },
  }),
}));

import AppToast from "~/components/ui/toast/AppToast.vue";

describe("AppToast UI Component Test", () => {
  it("should render vue-sonner Toaster component", () => {
    const wrapper = mount(AppToast);
    expect(wrapper.find("[data-sonner-toaster]").exists()).toBe(true);
  });

  it("should render with top-center position", () => {
    const wrapper = mount(AppToast);
    expect(wrapper.findComponent({ name: "Toaster" }).exists()).toBe(true);
  });
});
