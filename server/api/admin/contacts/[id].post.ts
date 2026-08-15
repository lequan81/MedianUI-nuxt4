import { defineEventHandler, readBody, createError } from "h3";
import { setContactStatus, removeContact } from "~/server/services/contact.service";

export default defineEventHandler(async (event) => {
  const contactId = String(event.context.params?.id || "");
  if (!contactId) {
    throw createError({ statusCode: 400, statusMessage: "Thiếu ID liên hệ." });
  }

  const body = await readBody(event);
  const action = body?.action;

  if (action === "read" || action === "unread" || action === "archived") {
    setContactStatus(contactId, action);
  } else if (action === "delete") {
    removeContact(contactId);
  } else {
    throw createError({ statusCode: 400, statusMessage: "Hành động không hợp lệ." });
  }

  return {
    success: true,
    message: "Cập nhật trạng thái liên hệ thành công.",
  };
});
