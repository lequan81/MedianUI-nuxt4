import { defineEventHandler, getCookie, setCookie } from "h3";

export default defineEventHandler((event) => {
  const existingGuestId = getCookie(event, "guest_id");

  if (!existingGuestId) {
    // Sử dụng Bun.randomUUIDv7() native của Bun runtime
    let guestId: string;
    if (typeof Bun !== "undefined" && typeof Bun.randomUUIDv7 === "function") {
      guestId = Bun.randomUUIDv7();
    } else {
      guestId = crypto.randomUUID();
    }

    setCookie(event, "guest_id", guestId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // allow client header access if needed
      sameSite: "lax",
    });
  }
});
