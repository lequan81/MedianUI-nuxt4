/**
 * Generates time-sortable UUIDv7 (using native Bun.randomUUIDv7 if available, fallback to global crypto.randomUUID).
 */
export function generateUUIDv7(): string {
  if (typeof Bun !== "undefined" && typeof Bun.randomUUIDv7 === "function") {
    return Bun.randomUUIDv7();
  }
  return crypto.randomUUID();
}
