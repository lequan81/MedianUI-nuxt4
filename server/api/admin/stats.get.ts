import { defineEventHandler } from "h3";
import { requireAdminAuth } from "~/server/utils/admin-auth";
import { getAdminStats } from "~/server/utils/db";

export default defineEventHandler((event) => {
  requireAdminAuth(event);
  return getAdminStats();
});
