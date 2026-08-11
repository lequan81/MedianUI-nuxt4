import { describe, it, expect } from "vitest";
import { moderateComment, MOD_FLAGS } from "~/server/utils/moderation";
import { scanBlacklist, getBlacklistSize } from "~/server/utils/blacklist-dict";

describe("Blacklist Dictionary", () => {
  it("should have a non-empty blacklist", () => {
    expect(getBlacklistSize()).toBeGreaterThan(30);
  });

  it("should detect Vietnamese profanity", () => {
    const res = scanBlacklist("thằng đm ngu vl");
    expect(res.matched).toBe(true);
    expect(res.category).toBe("PROFANITY");
    expect(res.score).toBeGreaterThan(0.8);
  });

  it("should detect NSFW keywords", () => {
    const res = scanBlacklist("xem clip hot gái gọi giá rẻ");
    expect(res.matched).toBe(true);
    expect(res.category).toBe("NSFW");
  });

  it("should detect gambling keywords", () => {
    const res = scanBlacklist("chơi tài xỉu online");
    expect(res.matched).toBe(true);
    expect(res.category).toBe("GAMBLING");
  });

  it("should detect spam link patterns", () => {
    const res = scanBlacklist("tham gia nhóm t.me/nhomcoin nha");
    expect(res.matched).toBe(true);
    expect(res.category).toBe("SPAM_LINK");
  });

  it("should return no match for clean text", () => {
    const res = scanBlacklist("Bài viết rất hay và hữu ích, cảm ơn!");
    expect(res.matched).toBe(false);
    expect(res.score).toBe(0);
  });
});

describe("Hybrid Moderation Engine (Score-Based 3-Tier)", () => {
  it("should APPROVE clean genuine comments", () => {
    const res = moderateComment("Bài viết rất hay và hữu ích, cảm ơn tác giả!");
    expect(res.tier).toBe("approved");
    expect(res.score).toBe(0);
    expect(res.flags).toBe(0);
  });

  it("should APPROVE normal question comments", () => {
    const res = moderateComment("Cho mình hỏi cấu hình Nuxt 4 với Tailwind v4 làm sao vậy?");
    expect(res.tier).toBe("approved");
  });

  it("should FLAG spam link invitations", () => {
    const res = moderateComment("Tham gia nhóm t.me/nhomkoin để nhận tín hiệu free!");
    expect(res.tier).toBe("flagged");
    expect(res.flags & MOD_FLAGS.BAD).toBeTruthy();
    expect(res.flags & MOD_FLAGS.SPAM_LINK).toBeTruthy();
  });

  it("should FLAG gambling keywords", () => {
    const res = moderateComment("Nhà cái uy tín 100% chơi tài xỉu rút tiền ngay trong ngày");
    expect(res.tier).toBe("flagged");
    expect(res.flags & MOD_FLAGS.GAMBLING).toBeTruthy();
  });

  it("should FLAG profanity and toxic insults", () => {
    const res = moderateComment("Đm cái thằng viết bài dốt thế");
    expect(res.tier).toBe("flagged");
    expect(res.flags & MOD_FLAGS.PROFANITY).toBeTruthy();
  });

  it("should FLAG repeated character spam", () => {
    const res = moderateComment("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(res.tier).toBe("flagged");
    expect(res.flags & MOD_FLAGS.BOT_PATTERN).toBeTruthy();
  });

  it("should set PENDING for URLs (suspicious but maybe legit)", () => {
    const res = moderateComment("Xem thêm tại https://nuxt.com/docs");
    expect(res.tier).toBe("pending");
    expect(res.flags & MOD_FLAGS.SPAM_LINK).toBeTruthy();
  });

  it("should set PENDING for very short comments", () => {
    const res = moderateComment("ok");
    expect(res.tier).toBe("pending");
  });

  it("should FLAG empty comments", () => {
    const res = moderateComment("");
    expect(res.tier).toBe("flagged");
  });
});
