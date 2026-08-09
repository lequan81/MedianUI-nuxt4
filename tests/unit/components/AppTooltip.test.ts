import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppTooltip from "~/components/ui/tooltip/AppTooltip.vue";

describe("AppTooltip Component", () => {
  it("renders trigger slot properly", () => {
    const wrapper = mount(AppTooltip, {
      slots: {
        trigger: "<button id='trigger-btn'>Hover me</button>",
        default: "<div>Tooltip Content</div>",
      },
    });

    expect(wrapper.find("#trigger-btn").exists()).toBe(true);
    expect(wrapper.text()).toContain("Hover me");
  });
});
