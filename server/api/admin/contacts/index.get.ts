import { defineEventHandler, getQuery } from "h3";
import { listContacts } from "~/server/services/contact.service";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 20);

  const result = listContacts(page, pageSize);

  return {
    success: true,
    ...result,
  };
});
