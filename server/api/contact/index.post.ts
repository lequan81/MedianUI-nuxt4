import { defineEventHandler, readBody, createError, getRequestIP, getCookie } from "h3";
import * as v from "valibot";
import { createContact } from "~/server/services/contact.service";
import { verifyCaptcha } from "~/server/services/captcha.service";
import { enforceContactRateLimit } from "~/server/services/rate-limit.service";
import { logSecurityAlert } from "~/server/utils/security-logger";
import { contactSchema } from "~/utils/validators/contact";

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";
  const guestId = getCookie(event, "guest_id") || "guest_unknown";
  const now = Date.now();

  // 1. Rate Limit Enforcement
  enforceContactRateLimit(event, ip, guestId);

  const body = await readBody(event);

  // 2. Honeypot Anti-Bot Trap
  if (body?.website_url && String(body.website_url).trim() !== "") {
    logSecurityAlert(ip, "HONEYPOT_TRIGGERED", { guestId, field: "website_url" });
    return {
      success: true,
      code: "SUCCESS",
    };
  }

  // 3. Time-to-Submit Anti-Bot Trap (< 1.5s)
  if (body?._t && typeof body._t === "number" && now - body._t < 1500) {
    logSecurityAlert(ip, "SUBMIT_TOO_FAST", { guestId, deltaMs: now - body._t });
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        code: "SUBMIT_TOO_FAST",
      },
    });
  }

  // 4. Schema Validation
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

  // 5. Captcha Verification
  if (body?.captcha_token) {
    const config = useRuntimeConfig(event);
    const isCaptchaValid = await verifyCaptcha(
      body.captcha_token,
      ip,
      config.turnstileSecretKey,
      config.turnstileVerifyUrl
    );

    if (!isCaptchaValid) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: {
          code: "CAPTCHA_INVALID",
        },
      });
    }
  }

  // 6. Persistence via Domain Service
  const contact = createContact(result.output, ip);

  return {
    success: true,
    code: "SUCCESS",
    contact,
  };
});
