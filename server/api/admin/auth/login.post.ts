import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { createAdminSession } from "~/server/services/auth.service";
import { checkRateLimit } from "~/server/services/rate-limit.service";
import { adminLoginSchema } from "~/utils/validators/admin";

export default defineEventHandler(async (event) => {
  // Rate limit: Max 5 attempts per 15 minutes per IP
  checkRateLimit(event, "admin_login", 5, 15 * 60 * 1000);

  const body = await readBody(event);
  const result = v.safeParse(adminLoginSchema, body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { code: "VALIDATION_ERROR", message: "Vui lòng nhập mật khẩu quản trị." },
    });
  }

  const success = await createAdminSession(event, result.output.password);

  if (!success) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { code: "INVALID_CREDENTIALS", message: "Mật khẩu quản trị viên không đúng." },
    });
  }

  return {
    success: true,
    code: "SUCCESS",
    message: "Đăng nhập thành công!",
  };
});
