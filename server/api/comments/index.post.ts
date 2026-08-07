import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { insertComment } from "~/server/utils/db";

const commentSchema = v.object({
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
    v.minLength(3, "Nội dung bình luận phải từ 3 ký tự trở lên"),
    v.maxLength(1000, "Nội dung bình luận tối đa 1000 ký tự")
  ),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = v.safeParse(commentSchema, body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.issues) {
      if (issue.path && issue.path.length > 0) {
        const keyName = String(issue.path[0].key);
        fieldErrors[keyName] = issue.message;
      }
    }

    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Thông tin nhập chưa hợp lệ.",
        fieldErrors,
      },
    });
  }

  const newComment = insertComment(result.output);

  return {
    success: true,
    message: "Bình luận thành công!",
    comment: newComment,
  };
});
