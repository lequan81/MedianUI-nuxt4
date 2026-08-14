import { defineEventHandler, readBody, createError, getRequestIP, getCookie, setHeader } from "h3";
import * as v from "valibot";
import { contactConfig } from "~/app/config/contact";
import { insertContact } from "~/server/utils/db";
import type { RequestLog } from "~/types/contact";
import { contactSchema } from "~/utils/validators/contact";

async function verifyTurnstileToken(
  token: string,
  ip?: string,
  secretKey?: string,
  verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
): Promise<{ success: boolean }> {
  if (!secretKey || secretKey === "1x0000000000000000000000000000000AA") {
    return { success: true }; // Allow always-pass test key & local testing
  }
  try {
    const res = await $fetch<{ success: boolean }>(verifyUrl, {
      method: "POST",
      body: { secret: secretKey, response: token, remoteip: ip },
    });
    return { success: Boolean(res?.success) };
  } catch {
    return { success: true };
  }
}

const rateLimitStore = new Map<string, RequestLog>();

setInterval(() => {
  const now = Date.now();
  const maxAge = contactConfig.rateLimit.maxWindowSeconds * 1000;

  for (const [key, log] of rateLimitStore.entries()) {
    log.timestamps = log.timestamps.filter((ts: number) => now - ts < maxAge);
    if (log.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";
  const guestId = getCookie(event, "guest_id") || "guest_unknown";

  const key = `${guestId}:${ip}`;
  const now = Date.now();

  let log = rateLimitStore.get(key);
  if (!log) {
    log = { timestamps: [] };
    rateLimitStore.set(key, log);
  }

  // Rate Limit Burst Check
  const burstWindowMs = contactConfig.rateLimit.burstWindowSeconds * 1000;
  const recentBurstRequests = log.timestamps.filter((ts: number) => now - ts < burstWindowMs);

  if (recentBurstRequests.length >= contactConfig.rateLimit.maxBurstRequests) {
    const oldestInBurst = recentBurstRequests[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldestInBurst + burstWindowMs - now) / 1000));

    setHeader(event, "Retry-After", retryAfterSeconds);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "RATE_LIMIT_BURST",
        retryAfter: retryAfterSeconds,
      },
    });
  }

  // Rate Limit Window Check
  const maxWindowMs = contactConfig.rateLimit.maxWindowSeconds * 1000;
  const recentWindowRequests = log.timestamps.filter((ts: number) => now - ts < maxWindowMs);

  if (recentWindowRequests.length >= contactConfig.rateLimit.maxWindowRequests) {
    const oldestInWindow = recentWindowRequests[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldestInWindow + maxWindowMs - now) / 1000));

    setHeader(event, "Retry-After", retryAfterSeconds);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "RATE_LIMIT_WINDOW",
        retryAfter: retryAfterSeconds,
      },
    });
  }

  const body = await readBody(event);

  // Anti-bot Trap 1: Honeypot field (hidden website_url)
  if (body?.website_url && String(body.website_url).trim() !== "") {
    // Fake success return to trick bot without inserting into DB
    return {
      success: true,
      code: "SUCCESS",
    };
  }

  // Anti-bot Trap 2: Time-to-Submit trap (form completed < 1.5 seconds)
  if (body?._t && typeof body._t === "number" && now - body._t < 1500) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        code: "SUBMIT_TOO_FAST",
      },
    });
  }

  const result = v.safeParse(contactSchema, body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.issues) {
      if (issue.path && issue.path.length > 0) {
        const keyName = String(issue.path[0].key);
        fieldErrors[keyName] = issue.message;
      }
    }

    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        code: "VALIDATION_ERROR",
        fieldErrors,
      },
    });
  }

  // Verify Captcha token if provided
  if (body?.captcha_token) {
    const config = useRuntimeConfig(event);
    const turnstile = await verifyTurnstileToken(
      body.captcha_token,
      ip,
      config.turnstileSecretKey,
      config.turnstileVerifyUrl
    );
    if (!turnstile.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: {
          code: "CAPTCHA_INVALID",
        },
      });
    }
  }

  // Persist contact message to SQLite DB
  const savedContact = insertContact({
    name: result.output.name,
    email: result.output.email,
    subject: result.output.subject,
    message: result.output.message,
    ip,
  });

  log.timestamps.push(now);

  return {
    success: true,
    code: "SUCCESS",
    contact: savedContact,
  };
});
