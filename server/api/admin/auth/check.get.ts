import { defineEventHandler } from "h3";
import { verifyAdminAuth } from "~/server/utils/admin-auth";

export default defineEventHandler((event) => {
  const authenticated = verifyAdminAuth(event);
  return { authenticated };
});
