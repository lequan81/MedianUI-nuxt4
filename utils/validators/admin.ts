import * as v from "valibot";

export const adminLoginSchema = v.object({
  password: v.pipe(v.string("Mật khẩu không được để trống"), v.trim(), v.minLength(1)),
});

export const adminCommentActionSchema = v.object({
  action: v.picklist(["approve", "flag", "delete"], "Hành động không hợp lệ"),
});

export const adminReportActionSchema = v.object({
  report_id: v.number("ID báo cáo không hợp lệ"),
  action: v.picklist(["delete", "dismiss"], "Hành động không hợp lệ"),
});

export type AdminLoginInput = v.InferInput<typeof adminLoginSchema>;
