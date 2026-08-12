import * as v from "valibot";

export const commentSchema = v.object({
  post_slug: v.pipe(
    v.string("Post slug không được để trống"),
    v.trim(),
    v.minLength(1)
  ),
  parent_id: v.optional(v.nullable(v.string())),
  author_name: v.pipe(
    v.string("Tên người bình luận không được để trống"),
    v.trim(),
    v.minLength(2, "Tên phải từ 2 ký tự trở lên"),
    v.maxLength(60, "Tên tối đa 60 ký tự")
  ),
  author_email: v.pipe(
    v.string("Email không được để trống"),
    v.trim(),
    v.email("Định dạng email không hợp lệ")
  ),
  content: v.pipe(
    v.string("Nội dung bình luận không được để trống"),
    v.trim(),
    v.minLength(1, "Nội dung bình luận không được để trống"),
    v.maxLength(1000, "Nội dung bình luận tối đa 1000 ký tự")
  ),
  captcha_token: v.optional(v.string()),
});

export const commentReportSchema = v.object({
  comment_id: v.pipe(v.string(), v.trim(), v.minLength(1)),
  reporter_session: v.pipe(v.string(), v.trim(), v.minLength(1)),
  reason: v.picklist(
    ["spam", "harassment", "misinformation", "other"],
    "Lý do báo cáo không hợp lệ"
  ),
  custom_text: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(500))),
});

export type CommentInput = v.InferInput<typeof commentSchema>;
export type CommentReportInput = v.InferInput<typeof commentReportSchema>;
