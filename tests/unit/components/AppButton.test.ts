import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppButton from "~/components/ui/button/AppButton.vue";

const globalConfig = {
  stubs: {
    AppIcon: true,
  },
};

describe("AppButton Primitive UI Component", () => {
  it("should render primary variant classes by default", () => {
    const wrapper = mount(AppButton, {
      slots: { default: "Click Me" },
      global: globalConfig,
    });

    expect(wrapper.text()).toBe("Click Me");
    expect(wrapper.classes()).toContain("bg-primary");
    expect(wrapper.classes()).toContain("text-white");
  });

  it("should render secondary and outline variants correctly", () => {
    const secWrapper = mount(AppButton, {
      props: { variant: "secondary" },
      global: globalConfig,
    });
    expect(secWrapper.classes()).toContain("bg-bg-sec");

    const outlineWrapper = mount(AppButton, {
      props: { variant: "outline" },
      global: globalConfig,
    });
    expect(outlineWrapper.classes()).toContain("bg-transparent");
  });

  it("should apply disabled attribute and classes when disabled or loading", () => {
    const disabledWrapper = mount(AppButton, {
      props: { disabled: true },
      global: globalConfig,
    });
    expect(disabledWrapper.attributes("disabled")).toBeDefined();

    const loadingWrapper = mount(AppButton, {
      props: { loading: true },
      global: globalConfig,
    });
    expect(loadingWrapper.attributes("disabled")).toBeDefined();
    expect(loadingWrapper.html()).toContain("animate-spin");
  });
});
