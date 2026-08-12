import { defineEventHandler, readBody, createError } from "h3";
import { requireAdminAuth } from "~/server/utils/admin-auth";
import { updateContactStatus, deleteContact } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  requireAdminAuth(event);

  const contactId = String(event.context.params?.id || "");
  if (!contactId) {
    throw createError({ statusCode: 400, statusMessage: "Thiếu ID liên hệ." });
  }

  const body = await readBody(event);
  const action = body?.action;

  if (action === "read" || action === "unread" || action === "archived") {
    updateContactStatus(contactId, action);
  } else if (action === "delete") {
    deleteContact(contactId);
  } else {
    throw createError({ statusCode: 400, statusMessage: "Hành động không hợp lệ." });
  }

  return { success: true, message: `Cập nhật trạng thái liên hệ thành công.` };
});
