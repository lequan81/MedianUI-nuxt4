import * as v from "valibot";

export const contactSchema = v.object({
  name: v.pipe(
    v.string("Tên không được để trống"),
    v.trim(),
    v.minLength(2, "Tên phải có ít nhất 2 ký tự"),
    v.maxLength(60, "Tên không quá 60 ký tự")
  ),
  email: v.pipe(
    v.string("Email không được để trống"),
    v.trim(),
    v.email("Địa chỉ Email không đúng định dạng")
  ),
  subject: v.optional(
    v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(100, "Tiêu đề không quá 100 ký tự")
    )
  ),
  message: v.pipe(
    v.string("Nội dung tin nhắn không được để trống"),
    v.trim(),
    v.minLength(5, "Nội dung lời nhắn phải từ 5 ký tự trở lên"),
    v.maxLength(1000, "Nội dung lời nhắn không quá 1000 ký tự")
  ),
});

export type ContactInput = v.InferInput<typeof contactSchema>;
