import { defineEventHandler } from "h3";
import { getAllSettings } from "~/server/services/settings.service";

export default defineEventHandler(() => {
  return {
    success: true,
    data: getAllSettings(),
  };
});
