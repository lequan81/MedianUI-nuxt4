/**
 * Cloudflare Turnstile token verification service
 */
export async function verifyCaptcha(
  token?: string,
  ip?: string,
  secretKey?: string,
  verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
): Promise<boolean> {
  if (!token) return false;

  // Allow Cloudflare always-pass test secret key in dev/test
  if (!secretKey || secretKey === "1x0000000000000000000000000000000AA") {
    return true;
  }

  try {
    const res = await $fetch<{ success: boolean }>(verifyUrl, {
      method: "POST",
      body: {
        secret: secretKey,
        response: token,
        remoteip: ip,
      },
    });
    return Boolean(res?.success);
  } catch {
    // If Cloudflare service is unreachable, fail-safe or allow depending on policy
    return true;
  }
}
