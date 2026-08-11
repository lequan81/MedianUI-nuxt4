import { defineEventHandler } from "h3";
import { getUnresolvedReports } from "~/server/utils/db";

export default defineEventHandler(() => {
  return {
    success: true,
    reports: getUnresolvedReports(),
  };
});
