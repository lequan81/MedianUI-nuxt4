import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { setAdminSession } from "~/server/utils/admin-auth";

import { adminLoginSchema } from "~/utils/validators/admin";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = v.safeParse(adminLoginSchema, body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { message: "Vui lòng nhập mật khẩu quản trị." },
    });
  }

  const success = setAdminSession(event, result.output.password);

  if (!success) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Mật khẩu quản trị viên không đúng." },
    });
  }

  return {
    success: true,
    message: "Đăng nhập thành công!",
  };
});
