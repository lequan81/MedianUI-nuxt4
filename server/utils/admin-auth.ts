import crypto from "node:crypto";
import { H3Event, parseCookies, setCookie, deleteCookie, createError } from "h3";
import { generateUUIDv7 } from "./id";

const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_PASSWORD_FALLBACK = "admin123";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getAdminSecret(): string {
  const config = useRuntimeConfig();
  return String(config.adminSecret || process.env.ADMIN_SECRET || ADMIN_PASSWORD_FALLBACK).trim();
}

export function signSession(sessionId: string, expiresAt: number, secret: string): string {
  const payload = `${sessionId}.${expiresAt}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifySessionToken(token: string, secret: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const sessionId = parts[0];
  const expiresAtStr = parts[1];
  const receivedHmac = parts[2];

  if (!sessionId || !expiresAtStr || !receivedHmac || receivedHmac.length !== 64) return false;

  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const expectedPayload = `${sessionId}.${expiresAt}`;
  const expectedHmac = crypto.createHmac("sha256", secret).update(expectedPayload).digest("hex");

  try {
    const receivedBuf = Buffer.from(receivedHmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");
    if (receivedBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(receivedBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function verifyAdminAuth(event: H3Event): boolean {
  const secret = getAdminSecret();
  const cookies = parseCookies(event);
  const sessionToken = cookies[ADMIN_COOKIE_NAME];

  if (!sessionToken) {
    return false;
  }

  return verifySessionToken(sessionToken, secret);
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

export async function verifyAdminPassword(passwordInput: string): Promise<boolean> {
  const secret = getAdminSecret();
  const trimmedInput = passwordInput.trim();

  // If running in Bun runtime and stored secret is an Argon2id hash
  if (secret.startsWith("$argon2id$") && typeof Bun !== "undefined" && typeof Bun.password?.verify === "function") {
    try {
      return await Bun.password.verify(trimmedInput, secret, "argon2id");
    } catch {
      return false;
    }
  }

  // Timing-safe fallback comparison for plaintext / sha256 secrets
  try {
    const inputBuf = Buffer.from(trimmedInput);
    const secretBuf = Buffer.from(secret);
    if (inputBuf.length !== secretBuf.length) return false;
    return crypto.timingSafeEqual(inputBuf, secretBuf);
  } catch {
    return false;
  }
}

export async function setAdminSession(event: H3Event, passwordInput: string): Promise<boolean> {
  const isMatch = await verifyAdminPassword(passwordInput);
  if (!isMatch) return false;

  const secret = getAdminSecret();
  const sessionId = generateUUIDv7();
  const expiresAt = Date.now() + SESSION_TTL_MS;

  const signedToken = signSession(sessionId, expiresAt, secret);

  setCookie(event, ADMIN_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });

  return true;
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, ADMIN_COOKIE_NAME, { path: "/" });
}
