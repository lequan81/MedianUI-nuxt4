import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { insertComment, updateCommentStatus } from "~/server/utils/db";
import { moderateComment } from "~/server/utils/moderation";
import { geminiModerate } from "~/server/utils/gemini-pool";
import { verifyTurnstileToken } from "~/server/utils/turnstile";

const commentSchema = v.object({
  post_slug: v.pipe(
    v.string("Post slug không được để trống"),
    v.trim(),
    v.minLength(1)
  ),
  parent_id: v.optional(v.nullable(v.string())),
  author_name: v.pipe(
    v.string("Tên người bình luận không được để trống"),
    v.trim(),
    v.minLength(2, "Tên phải từ 2 ký tự trở lên"),
    v.maxLength(60, "Tên tối đa 60 ký tự")
  ),
  author_email: v.pipe(
    v.string("Email không được để trống"),
    v.trim(),
    v.email("Định dạng email không hợp lệ")
  ),
  content: v.pipe(
    v.string("Nội dung bình luận không được để trống"),
    v.trim(),
    v.minLength(1, "Nội dung bình luận không được để trống"),
    v.maxLength(1000, "Nội dung bình luận tối đa 1000 ký tự")
  ),
  captcha_token: v.optional(v.string()),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = v.safeParse(commentSchema, body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.issues) {
      if (issue.path && issue.path.length > 0) {
        const keyName = String(issue.path[0].key);
        fieldErrors[keyName] = issue.message;
      }
    }

    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Thông tin nhập chưa hợp lệ.",
        fieldErrors,
      },
    });
  }

  const { content, captcha_token } = result.output;

  // ── Layer 1+2: Fast local moderation (<1ms) ──────────────────────────
  const modResult = moderateComment(content);

  // If comment is uncertain (pending) AND user hasn't completed Captcha yet
  if (modResult.tier === "pending" && !captcha_token) {
    return {
      success: false,
      require_captcha: true,
      reason: modResult.reason || "Nội dung có thể chứa thông tin nhạy cảm. Vui lòng xác minh Captcha.",
    };
  }

  // If Captcha token provided, verify with Cloudflare
  if (captcha_token) {
    const turnstile = await verifyTurnstileToken(captcha_token);
    if (!turnstile.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: { message: "Xác minh Captcha không hợp lệ. Vui lòng thử lại." },
      });
    }
  }

  // ── Insert with initial status ────────────────────────────────────────
  const newComment = insertComment({
    ...result.output,
    status: modResult.tier,
    mod_flags: modResult.flags,
    mod_confidence: modResult.score,
  });

  // ── Layer 3: Async Gemini gate for "pending" comments ─────────────────
  if (modResult.tier === "pending") {
    geminiModerate(content)
      .then((geminiResult) => {
        if (!geminiResult) {
          updateCommentStatus(newComment.id, "approved", 0x80, 0.0);
          return;
        }
        const isBad = (geminiResult.f & 0x01) !== 0;
        const newStatus = isBad && geminiResult.c > 0.7 ? "flagged" : "approved";
        updateCommentStatus(newComment.id, newStatus, geminiResult.f, geminiResult.c);
      })
      .catch(() => {
        updateCommentStatus(newComment.id, "approved", 0x80, 0.0);
      });
  }

  // ── Return immediately — Optimistic UI ────────────────────────────────
  return {
    success: true,
    require_captcha: false,
    message: "Bình luận đã được gửi!",
    comment: newComment,
  };
});
