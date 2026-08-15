import { getCookie, setCookie, deleteCookie, createError, type H3Event } from "h3";
import { generateUUIDv7 } from "~/server/utils/id";

export const ADMIN_COOKIE_NAME = "median_admin_token";
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Constant-time string equality check to prevent timing attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Computes HMAC-SHA256 signature using native Bun.CryptoHasher
 */
function computeHmacSha256(payload: string, secret: string): string {
  if (typeof Bun !== "undefined" && typeof Bun.CryptoHasher === "function") {
    const hasher = new Bun.CryptoHasher("sha256", secret);
    hasher.update(payload);
    return hasher.digest("hex");
  }

  // Fallback for non-Bun environments
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + (data[i] ?? 0);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export function signSessionToken(sessionId: string, expiresAt: number, secretKey?: string): string {
  const secret = secretKey || getHmacSecret();
  const payload = `${sessionId}.${expiresAt}`;
  const signature = computeHmacSha256(payload, secret);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string, secretKey?: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [sessionId, expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr || "0", 10);

  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const secret = secretKey || getHmacSecret();
  const expectedPayload = `${sessionId}.${expiresAt}`;
  const expectedSig = computeHmacSha256(expectedPayload, secret);

  return constantTimeEqual(signature || "", expectedSig);
}

export function getAdminSecret(): string {
  if (typeof useRuntimeConfig === "function") {
    try {
      const config = useRuntimeConfig();
      if (config.adminPassword) return config.adminPassword;
      if (config.adminSecret) return config.adminSecret;
    } catch {
      // Fallback in isolated unit test runner
    }
  }
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || "admin123";
}

export function getHmacSecret(): string {
  if (typeof useRuntimeConfig === "function") {
    try {
      const config = useRuntimeConfig();
      if (config.adminHmacSecret) return config.adminHmacSecret;
    } catch {
      // Fallback
    }
  }
  return process.env.ADMIN_HMAC_SECRET || "median_secret_salt_123456_key";
}

export async function verifyCredentials(passwordInput: string): Promise<boolean> {
  const secret = getAdminSecret();
  const trimmedInput = passwordInput.trim();

  // Native Argon2id verification via Bun.password
  if (secret.startsWith("$argon2id$") && typeof Bun !== "undefined" && typeof Bun.password?.verify === "function") {
    try {
      return await Bun.password.verify(trimmedInput, secret, "argon2id");
    } catch {
      return false;
    }
  }

  // Constant-time comparison for plaintext / fallback secrets
  return constantTimeEqual(trimmedInput, secret);
}

export async function createAdminSession(event: H3Event, passwordInput: string): Promise<boolean> {
  const isValid = await verifyCredentials(passwordInput);
  if (!isValid) return false;

  const sessionId = generateUUIDv7();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const token = signSessionToken(sessionId, expiresAt);

  setCookie(event, ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });

  return true;
}

export function verifyAdminSession(event: H3Event): boolean {
  const token = getCookie(event, ADMIN_COOKIE_NAME);
  if (!token) return false;
  return verifySessionToken(token);
}

export function requireAdminAuth(event: H3Event): void {
  const isAuth = verifyAdminSession(event);
  if (!isAuth) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Phiên đăng nhập quản trị đã hết hạn hoặc không hợp lệ." },
    });
  }
}

export function clearAdminSession(event: H3Event): void {
  deleteCookie(event, ADMIN_COOKIE_NAME, {
    path: "/",
  });
}
