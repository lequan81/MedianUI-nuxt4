import { H3Event, parseCookies, setCookie, deleteCookie, createError } from "h3";

const ADMIN_COOKIE_NAME = "admin_session";
// Fallback admin secret key (or set ADMIN_SECRET in env)
const ADMIN_PASSWORD_FALLBACK = "admin123";

export function verifyAdminAuth(event: H3Event): boolean {
  const config = useRuntimeConfig();
  const validSecret = String(config.adminSecret || process.env.ADMIN_SECRET || ADMIN_PASSWORD_FALLBACK).trim();
  const cookies = parseCookies(event);
  const sessionToken = cookies[ADMIN_COOKIE_NAME];

  if (!sessionToken || sessionToken !== validSecret) {
    return false;
  }
  return true;
}

export function requireAdminAuth(event: H3Event) {
  if (!verifyAdminAuth(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Phiên làm việc Quản trị viên không hợp lệ hoặc đã hết hạn." },
    });
  }
}

export function setAdminSession(event: H3Event, passwordInput: string): boolean {
  const config = useRuntimeConfig();
  const validSecret = String(config.adminSecret || process.env.ADMIN_SECRET || ADMIN_PASSWORD_FALLBACK).trim();

  if (passwordInput.trim() === validSecret) {
    setCookie(event, ADMIN_COOKIE_NAME, validSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    return true;
  }
  return false;
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, ADMIN_COOKIE_NAME, { path: "/" });
}
