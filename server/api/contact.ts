import { defineEventHandler, readBody, createError, setHeader, getCookie, getRequestIP } from "h3";
import * as v from "valibot";
import { contactConfig } from "~/app/config/contact";

// Schema Validation siêu nhẹ với Valibot
const contactSchema = v.object({
  name: v.pipe(
    v.string("Tên không được để trống"),
    v.trim(),
    v.minLength(2, "Tên phải có ít nhất 2 ký tự"),
    v.maxLength(60, "Tên không quá 60 ký tự")
  ),
  email: v.pipe(
    v.string("Email không được để trống"),
    v.trim(),
    v.email("Định dạng email không hợp lệ")
  ),
  subject: v.optional(v.string()),
  message: v.pipe(
    v.string("Nội dung không được để trống"),
    v.trim(),
    v.minLength(10, "Nội dung tin nhắn phải có ít nhất 10 ký tự"),
    v.maxLength(2000, "Nội dung quá dài (tối đa 2000 ký tự)")
  ),
});

// Bộ nhớ In-Memory lưu vết Rate Limit theo IP và Guest ID
interface RequestLog {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RequestLog>();

// Tự động dọn dẹp các bản ghi quá 10 phút (600s)
setInterval(() => {
  const now = Date.now();
  const maxAge = contactConfig.rateLimit.maxWindowSeconds * 1000;

  for (const [key, log] of rateLimitStore.entries()) {
    log.timestamps = log.timestamps.filter((ts) => now - ts < maxAge);
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

  // 1. Kiểm tra Rate Limit 1: Burst Limit (Tối đa 3 lần / 30s)
  const burstWindowMs = contactConfig.rateLimit.burstWindowSeconds * 1000;
  const recentBurstRequests = log.timestamps.filter((ts) => now - ts < burstWindowMs);

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

  // 2. Kiểm tra Rate Limit 2: Window Limit (Tối đa 5 lần / 10 phút)
  const maxWindowMs = contactConfig.rateLimit.maxWindowSeconds * 1000;
  const recentWindowRequests = log.timestamps.filter((ts) => now - ts < maxWindowMs);

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

  // Parse Body & Valibot Validation
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

  // Ghi nhận timestamp gửi thành công vào log store
  log.timestamps.push(now);

  // Xử lý lưu/gửi tin nhắn
  console.log(`[CONTACT FORM] Message received from ${result.output.name} (${result.output.email}): ${result.output.message}`);

  return {
    success: true,
    message: contactConfig.messages.success,
  };
});
