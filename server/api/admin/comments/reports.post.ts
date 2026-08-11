import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { resolveReport } from "~/server/utils/db";

const actionSchema = v.object({
  report_id: v.number(),
  action: v.picklist(["delete", "dismiss"]),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = v.safeParse(actionSchema, body);

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
