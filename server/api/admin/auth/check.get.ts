import { defineEventHandler } from "h3";
import { verifyAdminSession } from "~/server/services/auth.service";

export default defineEventHandler((event) => {
  const authenticated = verifyAdminSession(event);
  return {
    success: true,
    authenticated,
  };
});
