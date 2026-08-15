import { createError, setHeader, type H3Event } from "h3";
import { contactConfig } from "~/app/config/contact";
import type { RequestLog } from "~/types/contact";
import type { RateLimitRecord } from "~/types/rate-limit";

// In-memory stores
const contactRateLimitStore = new Map<string, RequestLog>();
const generalRateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  const maxContactAge = contactConfig.rateLimit.maxWindowSeconds * 1000;

  for (const [key, log] of contactRateLimitStore.entries()) {
    log.timestamps = log.timestamps.filter((ts: number) => now - ts < maxContactAge);
    if (log.timestamps.length === 0) {
      contactRateLimitStore.delete(key);
    }
  }

  for (const [key, record] of generalRateLimitStore.entries()) {
    if (now > record.resetTime) {
      generalRateLimitStore.delete(key);
    }
  }
}, 60 * 1000);

/**
 * General rate limit checker for actions (e.g. admin_login)
 */
export function checkRateLimit(
  event: H3Event,
  actionKey: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000
): void {
  const ip = event.context.clientIp || "127.0.0.1";
  const key = `${actionKey}:${ip}`;
  const now = Date.now();

  const record = generalRateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    generalRateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return;
  }

  if (record.count >= maxRequests) {
    const waitSec = Math.ceil((record.resetTime - now) / 1000);
    setHeader(event, "Retry-After", waitSec);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: waitSec,
      },
    });
  }

  record.count += 1;
}

/**
 * Contact rate limiter enforcing both Burst (e.g. 3 req/30s) and Window (e.g. 5 req/10m)
 */
export function enforceContactRateLimit(event: H3Event, ip: string, guestId: string): void {
  const key = `${guestId}:${ip}`;
  const now = Date.now();

  let log = contactRateLimitStore.get(key);
  if (!log) {
    log = { timestamps: [] };
    contactRateLimitStore.set(key, log);
  }

  // 1. Burst Check
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

  // 2. Window Check
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

  log.timestamps.push(now);
}
