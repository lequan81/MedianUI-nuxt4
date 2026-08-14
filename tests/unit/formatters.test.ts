import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatCompactNumber,
  formatTimeAgo,
  truncateText,
} from "~/utils/formatters";

describe("formatters utils", () => {
  it("formatDate should format valid dates and fallback gracefully", () => {
    expect(formatDate("2024-11-10", "en-US")).toContain("2024");
    expect(formatDate("invalid-date")).toBe("invalid-date");
    expect(formatDate("")).toBe("");
  });

  it("formatDateTime should format date and time", () => {
    const res = formatDateTime("2024-11-10T14:30:00Z", "en-US");
    expect(res).toContain("2024");
  });

  it("formatNumber and formatCompactNumber should format numbers compactly", () => {
    expect(formatNumber(500, "en-US")).toBe("500");
    expect(formatNumber(1000, "en-US")).toBe("1K");
    expect(formatNumber(2500, "en-US")).toBe("2.5K");
    expect(formatNumber(1000000, "en-US")).toBe("1M");
    expect(formatCompactNumber(1000, "en-US")).toBe("1K");
  });

  it("truncateText should truncate strings longer than maxLength", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
    expect(truncateText("Short", 10)).toBe("Short");
  });

  it("formatTimeAgo should format relative times properly", () => {
    const now = new Date();
    expect(formatTimeAgo(now)).toBe("Vừa xong");
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatTimeAgo(fiveMinsAgo)).toBe("5m");
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatTimeAgo(twoHoursAgo)).toBe("2h");
  });
});
