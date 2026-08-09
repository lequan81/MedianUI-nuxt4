import { describe, expect, it } from "vitest";
import { formatDate, formatCompactNumber, truncateText } from "~/utils/formatters";

describe("formatters utils", () => {
  it("formatDate should format valid dates and fallback gracefully", () => {
    expect(formatDate("2024-11-10")).toContain("2024");
    expect(formatDate("invalid-date")).toBe("invalid-date");
    expect(formatDate("")).toBe("");
  });

  it("formatCompactNumber should format numbers with k/M suffixes", () => {
    expect(formatCompactNumber(500)).toBe("500");
    expect(formatCompactNumber(1000)).toBe("1k");
    expect(formatCompactNumber(2500)).toBe("2.5k");
    expect(formatCompactNumber(1000000)).toBe("1M");
  });

  it("truncateText should truncate strings longer than maxLength", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
    expect(truncateText("Short", 10)).toBe("Short");
  });
});
