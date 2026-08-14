// @vitest-environment node
import { describe, it, expect } from "vitest";
import { generateUUIDv7 } from "../../server/utils/id";
import { signSession, verifySessionToken } from "../../server/utils/admin-auth";

describe("Server Security & Auth Utilities", () => {
  it("should generate valid UUIDv7 strings", () => {
    const id1 = generateUUIDv7();
    const id2 = generateUUIDv7();

    expect(typeof id1).toBe("string");
    expect(id1.length).toBeGreaterThanOrEqual(32);
    expect(id1).not.toBe(id2);
  });

  it("should create and verify signed HMAC session tokens", () => {
    const secret = "test-secret-key-123456";
    const sessionId = generateUUIDv7();
    const expiresAt = Date.now() + 3600000;

    const token = signSession(sessionId, expiresAt, secret);
    expect(token).toBeDefined();

    const isValid = verifySessionToken(token, secret);
    expect(isValid).toBe(true);

    const isTamperedValid = verifySessionToken(token + "tampered", secret);
    expect(isTamperedValid).toBe(false);

    const isExpiredValid = verifySessionToken(signSession(sessionId, Date.now() - 1000, secret), secret);
    expect(isExpiredValid).toBe(false);
  });
});
