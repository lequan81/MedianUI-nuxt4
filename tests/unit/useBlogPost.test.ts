import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

// Setup global Nuxt mocks for isolated composable unit tests
vi.stubGlobal("useRoute", () => ({ params: { slug: "test-post" }, path: "/blog/test-post" }));
vi.stubGlobal("useAsyncData", (_key: string, handler: () => any) => ({
  data: ref({
    title: "Test Post",
    tags: ["tech", "nuxt"],
    body: { toc: { links: [] } },
  }),
  status: ref("idle"),
}));
vi.stubGlobal("useLazyAsyncData", () => ({ data: ref([]) }));
vi.stubGlobal("useSeo", () => {});

import { useBlogPost } from "~/composables/useBlogPost";

describe("useBlogPost composable", () => {
  it("should initialize reactive post state and tags helpers", () => {
    const { isShareModalOpen, allPostTags, isOverflowingTags } = useBlogPost();
    expect(isShareModalOpen.value).toBe(false);
    expect(allPostTags.value).toEqual(["tech", "nuxt"]);
    expect(isOverflowingTags.value).toBe(false);
  });
});
