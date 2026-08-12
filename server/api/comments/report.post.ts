import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { insertReport, hasUserReportedComment } from "~/server/utils/db";
import { checkRateLimit } from "~/server/utils/rate-limit";

import { commentReportSchema } from "~/utils/validators/comment";

export default defineEventHandler(async (event) => {
  // Rate limiting: max 3 reports per minute per IP
  checkRateLimit(event, "comment_report", 3, 60 * 1000);

  const body = await readBody(event);
  const result = v.safeParse(commentReportSchema, body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { message: "Thông tin báo cáo không hợp lệ." },
    });
  }

  const { comment_id, reporter_session } = result.output;

  // Prevent duplicate report from same session
  if (hasUserReportedComment(comment_id, reporter_session)) {
    return {
      success: true,
      message: "Bạn đã gửi báo cáo cho bình luận này rồi.",
    };
  }

  insertReport(result.output);

  return {
    success: true,
    message: "Báo cáo đã được ghi nhận. Cảm ơn bạn!",
  };
});
