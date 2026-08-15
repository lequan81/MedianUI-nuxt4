import { defineEventHandler, readBody, createError } from "h3";
import { saveAllSettings, getAllSettings } from "~/server/services/settings.service";
import type { FullSiteSettings } from "~/types/settings";

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<FullSiteSettings>>(event);

  if (!body || typeof body !== "object") {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: { message: "Dữ liệu cấu hình không hợp lệ." },
    });
  }

  saveAllSettings(body);

  return {
    success: true,
    code: "SETTINGS_SAVED",
    message: "Đã lưu cài đặt hệ thống thành công!",
    data: getAllSettings(),
  };
});
