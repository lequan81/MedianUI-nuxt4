import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppBadge from "~/components/ui/AppBadge.vue";

describe("AppBadge Primitive UI Component", () => {
  it("should render default primary badge variant and slot content", () => {
    const wrapper = mount(AppBadge, {
      slots: { default: "Tech" },
    });

    expect(wrapper.text()).toBe("Tech");
    expect(wrapper.classes()).toContain("bg-primary");
  });

  it("should render subtle and warning variants correctly", () => {
    const subtle = mount(AppBadge, {
      props: { variant: "subtle" },
    });
    expect(subtle.classes()).toContain("bg-primary-subtle/80");

    const warning = mount(AppBadge, {
      props: { variant: "warning" },
    });
    expect(warning.classes()).toContain("bg-amber-500/15");
  });
});
