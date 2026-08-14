import { describe, it, expect } from "vitest";
import {
  getPostPath,
  getPostImage,
  getLabelCounts,
  sortPopularPosts,
  sortPinnedFirst,
  formatPostTimeAgo,
} from "../../composables/usePosts";

describe("usePosts Helpers", () => {
  it("should generate correct post path from slug or stem", () => {
    expect(getPostPath({ stem: "posts/my-first-post" })).toBe("/blog/my-first-post");
    expect(getPostPath({ path: "/blog/nuxt-guide" })).toBe("/blog/nuxt-guide");
    expect(getPostPath(null)).toBe("#");
  });

  it("should return post image or fallback image", () => {
    const customImg = "https://example.com/custom.png";
    expect(getPostImage({ image: customImg })).toBe(customImg);
    expect(getPostImage(null)).toContain("unsplash.com");
  });

  it("should count label categories correctly and sort alphabetically", () => {
    const mockPosts = [
      { category: "Tech" },
      { category: "Design" },
      { category: "Tech" },
      { category: "Coding" },
    ];
    const counts = getLabelCounts(mockPosts);
    expect(counts).toEqual([
      { name: "Coding", count: 1 },
      { name: "Design", count: 1 },
      { name: "Tech", count: 2 },
    ]);
  });

  it("should sort pinned posts first", () => {
    const mockPosts = [
      { id: 1, title: "Post 1", pinned: false, path: "/blog/post-1", category: "Tech", date: "2024-01-01" },
      { id: 2, title: "Post 2", pinned: true, path: "/blog/post-2", category: "Tech", date: "2024-01-02" },
      { id: 3, title: "Post 3", pinned: false, path: "/blog/post-3", category: "Tech", date: "2024-01-03" },
    ];
    const sorted = sortPinnedFirst(mockPosts);
    expect(sorted[0]?.title).toBe("Post 2");
  });

  it("should sort popular posts by comments count descending", () => {
    const mockPosts = [
      { id: 1, title: "Post 1", path: "/blog/post-1", category: "Tech", date: "2024-01-01", comments: 5 },
      { id: 2, title: "Post 2", path: "/blog/post-2", category: "Tech", date: "2024-01-02", comments: 20 },
      { id: 3, title: "Post 3", path: "/blog/post-3", category: "Tech", date: "2024-01-03", comments: 12 },
    ];
    const sorted = sortPopularPosts(mockPosts);
    expect(sorted[0]?.title).toBe("Post 2");
    expect(sorted[1]?.title).toBe("Post 3");
    expect(sorted[2]?.title).toBe("Post 1");
  });

  it("should format relative time ago strings correctly", () => {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    expect(formatPostTimeAgo({ date: tenMinutesAgo })).toBe("10m");
    expect(formatPostTimeAgo({ date: twoDaysAgo })).toBe("2d");
    expect(formatPostTimeAgo(null, "Unknown")).toBe("Unknown");
  });
});
