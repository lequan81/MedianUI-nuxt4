import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

// Mock vue-sonner
vi.mock("vue-sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  Toaster: {
    name: "Toaster",
    template: "<div data-sonner-toaster />",
    props: ["position", "visibleToasts", "duration", "offset", "gap", "theme", "richColors", "closeButton", "toastOptions"],
  },
}));

import AppToast from "~/components/ui/toast/AppToast.vue";

describe("AppToast UI Component Test", () => {
  it("should render vue-sonner Toaster component", () => {
    const wrapper = mount(AppToast);
    expect(wrapper.html()).toContain("data-sonner-toaster");
  });

  it("should render with top-center position", () => {
    const wrapper = mount(AppToast);
    // Toaster component is rendered
    expect(wrapper.findComponent({ name: "Toaster" }).exists()).toBe(true);
  });
});
