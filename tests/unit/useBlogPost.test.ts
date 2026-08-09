import { describe, expect, it } from "vitest";
import { useBlogPost } from "~/composables/useBlogPost";

describe("useBlogPost composable", () => {
  it("should initialize reactive post state and tags helpers", () => {
    const { isShareModalOpen, allPostTags, isOverflowingTags } = useBlogPost();
    expect(isShareModalOpen.value).toBe(false);
    expect(allPostTags.value).toEqual([]);
    expect(isOverflowingTags.value).toBe(false);
  });
});
