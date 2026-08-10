import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import NotificationBar from "~/components/layout/NotificationBar.vue";

describe("NotificationBar UI Component Test", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should display notification bar when not dismissed before", async () => {
    const wrapper = mount(NotificationBar);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Welcome to Median UI v1.7");
  });

  it("should hide notification bar and store 7-day expiration timestamp when dismissed", async () => {
    const wrapper = mount(NotificationBar);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("div").exists()).toBe(true);

    const closeBtn = wrapper.find("button[aria-label='Đóng thông báo']");
    expect(closeBtn.exists()).toBe(true);

    await closeBtn.trigger("click");
    await wrapper.vm.$nextTick();

    const storedUntil = localStorage.getItem("median_notification_dismissed_until");
    expect(storedUntil).not.toBeNull();

    const untilTimestamp = parseInt(storedUntil || "0", 10);
    const expectedTimestamp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    expect(Math.abs(untilTimestamp - expectedTimestamp)).toBeLessThan(1000);
  });

  it("should remain hidden on mount if dismissed timestamp is still valid", async () => {
    const validUntil = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days in future
    localStorage.setItem("median_notification_dismissed_until", String(validUntil));

    const wrapper = mount(NotificationBar);
    await wrapper.vm.$nextTick();

    expect(wrapper.find("div").exists()).toBe(false);
  });
});
