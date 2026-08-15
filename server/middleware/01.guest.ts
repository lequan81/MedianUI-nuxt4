import { defineEventHandler, getCookie, setCookie, getRequestIP } from "h3";
import { generateUUIDv7 } from "~/server/utils/id";

export default defineEventHandler((event) => {
  // Store client IP in event context for downstream services
  event.context.clientIp = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";

  const existingGuestId = getCookie(event, "guest_id");

  if (!existingGuestId) {
    const guestId = generateUUIDv7();

    setCookie(event, "guest_id", guestId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: "lax",
    });
  }
});
