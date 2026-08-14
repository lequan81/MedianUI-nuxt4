import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h } from "vue";
import AppTooltip from "~/components/ui/tooltip/AppTooltip.vue";

describe("AppTooltip Component", () => {
  it("renders trigger slot properly", () => {
    const wrapper = mount(AppTooltip, {
      slots: {
        trigger: () => h("button", { id: "trigger-btn" }, "Hover me"),
        default: () => h("div", "Tooltip Content"),
      },
    });

    expect(wrapper.find("#trigger-btn").exists()).toBe(true);
    expect(wrapper.text()).toContain("Hover me");
  });
});
