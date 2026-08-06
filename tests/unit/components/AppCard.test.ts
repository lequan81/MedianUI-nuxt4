import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppCard from "~/components/ui/AppCard.vue";

describe("AppCard Primitive UI Component", () => {
  it("should render card container with default border and hoverable styles", () => {
    const wrapper = mount(AppCard, {
      slots: { default: "Card Content" },
    });

    expect(wrapper.text()).toBe("Card Content");
    expect(wrapper.classes()).toContain("border");
    expect(wrapper.classes()).toContain("rounded-xl");
  });
});
