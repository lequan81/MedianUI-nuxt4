import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { requireAdminAuth } from "~/server/utils/admin-auth";
import { updateCommentAdminStatus, deleteComment } from "~/server/utils/db";
import { adminCommentActionSchema } from "~/utils/validators/admin";

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);

  const commentId = String(event.context.params?.id || "");
  if (!commentId) {
    throw createError({ statusCode: 400, statusMessage: "Thiếu ID bình luận." });
  }

  const body = await readBody(event);
  const result = v.safeParse(adminCommentActionSchema, body);
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: "Hành động không hợp lệ." });
  }

  const action = result.output.action;

  if (action === "approve") {
    updateCommentAdminStatus(commentId, "approved");
  } else if (action === "flag") {
    updateCommentAdminStatus(commentId, "flagged");
  } else if (action === "delete") {
    deleteComment(commentId);
  } else {
    throw createError({ statusCode: 400, statusMessage: "Hành động không hợp lệ." });
  }

  return { success: true, message: `Thao tác '${action}' bình luận thành công.` };
});
