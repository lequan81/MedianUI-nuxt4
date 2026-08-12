import { defineEventHandler, getQuery } from "h3";
import { requireAdminAuth } from "~/server/utils/admin-auth";
import { getPaginatedContacts } from "~/server/utils/db";

export default defineEventHandler((event) => {
  requireAdminAuth(event);

  const query = getQuery(event);
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 20);

  return getPaginatedContacts(page, pageSize);
});
