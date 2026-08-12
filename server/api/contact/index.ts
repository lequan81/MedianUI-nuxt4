import { defineEventHandler, readBody, createError, getRequestIP } from "h3";
import * as v from "valibot";
import { contactConfig } from "~/app/config/contact";
import { insertContact } from "~/server/utils/db";
import { verifyTurnstileToken } from "~/server/utils/turnstile";
import type { RequestLog } from "~/types/contact";
import { contactSchema } from "~/utils/validators/contact";




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
        reason: "burst",
        retryAfter: retryAfterSeconds,
        message: contactConfig.messages.burstLimitExceeded(retryAfterSeconds),
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
        reason: "window",
        retryAfter: retryAfterSeconds,
        message: contactConfig.messages.windowLimitExceeded(retryAfterSeconds),
      },
    });
  }

  const body = await readBody(event);
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
        message: contactConfig.messages.validationError,
        fieldErrors,
      },
    });
  }

  // Verify Captcha token if provided
  if (body?.captcha_token) {
    const turnstile = await verifyTurnstileToken(body.captcha_token);
    if (!turnstile.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: { message: "Xác minh Captcha không hợp lệ. Vui lòng thử lại." },
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
    message: contactConfig.messages.success,
    contact: savedContact,
  };
});
