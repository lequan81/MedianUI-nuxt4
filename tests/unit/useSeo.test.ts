import { describe, expect, it } from "vitest";
import { useSeo } from "~/composables/useSeo";

describe("useSeo unified composable", () => {
  it("should execute cleanly without throwing errors", () => {
    expect(() => {
      useSeo({ title: "Test Page", description: "Test Description" });
    }).not.toThrow();
  });
});
