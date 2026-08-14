import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

vi.stubGlobal("useRoute", () => ({ query: {} }));
vi.stubGlobal("useAsyncData", () => ({ data: ref([]), status: ref("idle") }));

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
