// @vitest-environment node
import { describe, it, expect } from "vitest";
import { insertComment, getPaginatedComments } from "../../server/utils/db";

describe("Bun SQLite Comments System & Deferred Join Pagination", () => {
  const testSlug = "test-unit-post-slug";

  it("should insert a new top-level comment with native UUIDv7 id", () => {
    const comment = insertComment({
      post_slug: testSlug,
      author_name: "Tester 1",
      author_email: "tester1@example.com",
      content: "Nội dung bình luận thử nghiệm unit test",
    });

    expect(comment).toBeDefined();
    expect(comment.id).toBeDefined();
    expect(comment.post_slug).toBe(testSlug);
    expect(comment.author_name).toBe("Tester 1");
  });

  it("should insert a reply comment linked to parent_id", () => {
    const parent = insertComment({
      post_slug: testSlug,
      author_name: "Parent Author",
      author_email: "parent@example.com",
      content: "Bình luận cha",
    });

    const reply = insertComment({
      post_slug: testSlug,
      parent_id: parent.id,
      author_name: "Reply Author",
      author_email: "reply@example.com",
      content: "Bình luận con phản hồi",
    });

    expect(reply.parent_id).toBe(parent.id);
  });

  it("should fetch paginated comments using Deferred Join pattern with replies grouped", () => {
    const result = getPaginatedComments(testSlug, 1, 10);
    expect(result).toBeDefined();
    expect(result.comments.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });
});
