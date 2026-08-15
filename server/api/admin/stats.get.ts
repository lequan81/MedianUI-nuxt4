import { defineEventHandler } from "h3";
import { getContactStats } from "~/server/services/contact.service";

export default defineEventHandler(() => {
  const stats = getContactStats();
  return {
    success: true,
    ...stats,
  };
});
