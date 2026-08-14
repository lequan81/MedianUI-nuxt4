import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { setAdminSession } from "~/server/utils/admin-auth";
import { checkRateLimit } from "~/server/utils/rate-limit";
import { adminLoginSchema } from "~/utils/validators/admin";

export default defineEventHandler(async (event) => {
  // Rate limit: Max 5 failed attempts per 15 minutes per IP
  checkRateLimit(event, "admin_login", 5, 15 * 60 * 1000);

  const body = await readBody(event);
  const result = v.safeParse(adminLoginSchema, body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { message: "Vui lòng nhập mật khẩu quản trị." },
    });
  }

  const success = await setAdminSession(event, result.output.password);

  if (!success) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Mật khẩu quản trị viên không đúng." },
    });
  }

  return {
    message: "Đăng nhập thành công!",
  };
});
