import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { requireAdminAuth } from "~/server/utils/admin-auth";
import { resolveReport } from "~/server/utils/db";
import { adminReportActionSchema } from "~/utils/validators/admin";

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);
  const body = await readBody(event);
  const result = v.safeParse(adminReportActionSchema, body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { message: "Thao tác không hợp lệ." },
    });
  }

  resolveReport(result.output.report_id, result.output.action);

  return {
    success: true,
    message: result.output.action === "delete" ? "Đã xóa bình luận." : "Đã bỏ qua báo cáo.",
  };
});
