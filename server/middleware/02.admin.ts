import { defineEventHandler, getRequestPath, createError } from "h3";
import { verifyAdminSession } from "~/server/services/auth.service";

export default defineEventHandler((event) => {
  const path = getRequestPath(event);

  // Protect all /api/admin/* endpoints, exempting login
  if (path.startsWith("/api/admin") && path !== "/api/admin/auth/login") {
    const isAuthorized = verifyAdminSession(event);

    if (!isAuthorized) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        data: {
          code: "UNAUTHORIZED",
          message: "Phiên đăng nhập quản trị đã hết hạn hoặc không hợp lệ.",
        },
      });
    }
  }
});
