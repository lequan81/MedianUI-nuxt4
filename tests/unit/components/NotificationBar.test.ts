import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import NotificationBar from "~/components/layout/NotificationBar.vue";

const cookieValue = ref<string | null>(null);

vi.stubGlobal("useCookie", () => cookieValue);

describe("NotificationBar UI Component Test", () => {
  beforeEach(() => {
    cookieValue.value = null;
  });

  it("should display notification bar when not dismissed before", async () => {
    const wrapper = mount(NotificationBar);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Welcome to Median UI v1.7");
  });

  it("should hide notification bar and store announcement ID in cookie when dismissed", async () => {
    const wrapper = mount(NotificationBar);
    await wrapper.vm.$nextTick();

    const closeBtn = wrapper.find("button[aria-label='Đóng thông báo']");
    expect(closeBtn.exists()).toBe(true);

    await closeBtn.trigger("click");
    await wrapper.vm.$nextTick();

    expect(cookieValue.value).toBe("median-v1.7.0-release");
  });

  it("should remain hidden on mount if dismissed announcement ID is already set", async () => {
    cookieValue.value = "median-v1.7.0-release";

    const wrapper = mount(NotificationBar);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("div").exists()).toBe(false);
  });
});
