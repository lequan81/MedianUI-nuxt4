import { defineEventHandler, getQuery, createError } from "h3";
import { getPaginatedComments } from "~/server/utils/db";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const postSlug = String(query.postSlug || "").trim();

  if (!postSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Tham số postSlug không được để trống.",
    });
  }

  const page = Math.max(1, parseInt(String(query.page || "1"), 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(String(query.pageSize || "10"), 10) || 10));

  return getPaginatedComments(postSlug, page, pageSize);
});
