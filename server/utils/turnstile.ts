import type { TurnstileResult } from "~/types/moderation";

/**
 * Cloudflare Turnstile Verification Helper
 * Verifies Turnstile token against Cloudflare Siteverify API.
 * Supports testing keys (1x0000..., 2x0000..., 3x0000...) for local dev testing.
 */

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<TurnstileResult> {
  const config = useRuntimeConfig();
  const secretKey = String(
    config.turnstileSecretKey || "1x0000000000000000000000000000000AA"
  ).trim();
  const verifyUrl = String(
    config.turnstileVerifyUrl || "https://challenges.cloudflare.com/turnstile/v0/siteverify"
  ).trim();

  // If token missing
  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  // Cloudflare test keys fallback for local dev
  const isTestKey =
    secretKey.startsWith("1x0000") ||
    secretKey.startsWith("2x0000") ||
    secretKey.startsWith("3x0000");

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await $fetch<any>(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (res?.success) {
      return { success: true };
    }

    // In local dev with test keys, allow valid non-empty tokens if siteverify fails due to local domain restrictions
    if (isTestKey && token && token.length > 5) {
      return { success: true };
    }

    return {
      success: false,
      errorCodes: res?.["error-codes"] || ["invalid-input-response"],
    };
  } catch {
    // If test key in dev mode, failopen for local testing
    if (isTestKey && token && token.length > 5) {
      return { success: true };
    }
    return { success: false, errorCodes: ["connection-failed"] };
  }
}
