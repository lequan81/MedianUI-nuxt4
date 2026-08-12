import { H3Event, createError, getRequestIP } from "h3";
import type { RateLimitRecord } from "~/types/rate-limit";

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Enforce rate limit per key (e.g. IP or session ID).
 * @param event H3Event
 * @param actionIdentifier String key prefix (e.g. "comments_post", "report_post")
 * @param maxRequests Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default: 60s)
 */
export function checkRateLimit(
  event: H3Event,
  actionIdentifier: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000
) {
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";
  const key = `${actionIdentifier}:${clientIp}`;
  const now = Date.now();

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return;
  }

  if (record.count >= maxRequests) {
    const waitSec = Math.ceil((record.resetTime - now) / 1000);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        message: `Bạn thao tác quá nhanh. Vui lòng thử lại sau ${waitSec} giây.`,
      },
    });
  }

  record.count += 1;
}
