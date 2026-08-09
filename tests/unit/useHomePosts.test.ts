import { describe, expect, it } from "vitest";
import { useHomePosts } from "~/composables/useHomePosts";

describe("useHomePosts composable", () => {
  it("should initialize reactive state and helper methods", () => {
    const { state, selectedCategories } = useHomePosts();
    expect(state.currentSlide).toBe(0);
    expect(state.displayCount).toBe(6);
    expect(state.currentPage).toBe(1);
    expect(selectedCategories.value).toEqual([]);
  });
});
