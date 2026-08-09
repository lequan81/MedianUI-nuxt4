import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppInput from "~/components/ui/input/AppInput.vue";


describe("AppInput Primitive UI Component", () => {
  it("should render label and placeholder correctly", () => {
    const wrapper = mount(AppInput, {
      props: {
        label: "Họ và tên",
        placeholder: "Nhập tên...",
        required: true,
      },
    });

    expect(wrapper.text()).toContain("Họ và tên");
    expect(wrapper.text()).toContain("*");
    expect(wrapper.find("input").attributes("placeholder")).toBe("Nhập tên...");
  });

  it("should emit update:modelValue on input event", async () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: "" },
    });

    const input = wrapper.find("input");
    await input.setValue("Lê Quân");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Lê Quân"]);
  });

  it("should display error message and red border when error prop is set", () => {
    const wrapper = mount(AppInput, {
      props: { error: "Email không hợp lệ" },
    });

    expect(wrapper.text()).toContain("Email không hợp lệ");
    expect(wrapper.find("input").classes()).toContain("border-rose-500");
  });
});
