import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { insertReport } from "~/server/utils/db";

const reportSchema = v.object({
  comment_id: v.pipe(v.string(), v.trim(), v.minLength(1)),
  reporter_session: v.pipe(v.string(), v.trim(), v.minLength(1)),
  reason: v.pipe(v.string(), v.trim(), v.minLength(1)),
  custom_text: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(500))),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = v.safeParse(reportSchema, body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { message: "Thông tin báo cáo không hợp lệ." },
    });
  }

  insertReport(result.output);

  return {
    success: true,
    message: "Báo cáo đã được ghi nhận. Cảm ơn bạn!",
  };
});
