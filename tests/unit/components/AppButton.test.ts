import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppButton from "~/components/ui/AppButton.vue";

describe("AppButton Primitive UI Component", () => {
  it("should render primary variant classes by default", () => {
    const wrapper = mount(AppButton, {
      slots: { default: "Click Me" },
    });

    expect(wrapper.text()).toBe("Click Me");
    expect(wrapper.classes()).toContain("bg-primary");
    expect(wrapper.classes()).toContain("text-white");
  });

  it("should render secondary and outline variants correctly", () => {
    const secWrapper = mount(AppButton, {
      props: { variant: "secondary" },
    });
    expect(secWrapper.classes()).toContain("bg-bg-sec");

    const outlineWrapper = mount(AppButton, {
      props: { variant: "outline" },
    });
    expect(outlineWrapper.classes()).toContain("bg-transparent");
  });

  it("should apply disabled attribute and classes when disabled or loading", () => {
    const disabledWrapper = mount(AppButton, {
      props: { disabled: true },
    });
    expect(disabledWrapper.attributes("disabled")).toBeDefined();

    const loadingWrapper = mount(AppButton, {
      props: { loading: true },
    });
    expect(loadingWrapper.attributes("disabled")).toBeDefined();
    expect(loadingWrapper.html()).toContain("animate-spin");
  });
});
