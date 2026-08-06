import { describe, it, expect } from "vitest";
import * as v from "valibot";

const contactSchema = v.object({
  name: v.pipe(
    v.string("Tên không được để trống"),
    v.trim(),
    v.minLength(2, "Tên phải có ít nhất 2 ký tự"),
    v.maxLength(60, "Tên không quá 60 ký tự")
  ),
  email: v.pipe(
    v.string("Email không được để trống"),
    v.trim(),
    v.email("Định dạng email không hợp lệ")
  ),
  subject: v.optional(v.string()),
  message: v.pipe(
    v.string("Nội dung không được để trống"),
    v.trim(),
    v.minLength(10, "Nội dung tin nhắn phải có ít nhất 10 ký tự"),
    v.maxLength(2000, "Nội dung quá dài (tối đa 2000 ký tự)")
  ),
});

describe("Contact Form Valibot Schema Validation", () => {
  it("should pass validation for valid input data", () => {
    const validData = {
      name: "Lê Quân",
      email: "lequan81@dev.io",
      subject: "Hợp tác làm dự án Nuxt 4",
      message: "Xin chào, mình rất ấn tượng với giao diện Median UI Nuxt này!",
    };

    const result = v.safeParse(contactSchema, validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.name).toBe("Lê Quân");
      expect(result.output.email).toBe("lequan81@dev.io");
    }
  });

  it("should fail validation when email format is invalid", () => {
    const invalidData = {
      name: "Lê Quân",
      email: "invalid-email-format",
      message: "Xin chào, tin nhắn này đủ dài 10 ký tự.",
    };

    const result = v.safeParse(contactSchema, invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.issues.find((i) => i.path?.[0]?.key === "email");
      expect(emailIssue?.message).toBe("Định dạng email không hợp lệ");
    }
  });

  it("should fail validation when message is shorter than 10 characters", () => {
    const invalidData = {
      name: "Lê Quân",
      email: "lequan81@dev.io",
      message: "Ngắn quá",
    };

    const result = v.safeParse(contactSchema, invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const msgIssue = result.issues.find((i) => i.path?.[0]?.key === "message");
      expect(msgIssue?.message).toBe("Nội dung tin nhắn phải có ít nhất 10 ký tự");
    }
  });
});
