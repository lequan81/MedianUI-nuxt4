import { defineEventHandler, readBody, createError } from "h3";
import * as v from "valibot";
import { insertComment, updateCommentStatus } from "~/server/utils/db";
import { moderateComment } from "~/server/utils/moderation";
import { geminiModerate } from "~/server/utils/gemini-pool";
import { verifyTurnstileToken } from "~/server/utils/turnstile";
import { checkRateLimit } from "~/server/utils/rate-limit";

import { commentSchema } from "~/utils/validators/comment";

export default defineEventHandler(async (event) => {
  // Rate limiting: max 5 comments per minute per IP
  checkRateLimit(event, "comments_post", 5, 60 * 1000);

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

  // ── Determine final status & compact hex code audit log ──────────────────
  let initialStatus = modResult.tier;
  let flags = modResult.flags;
  let modSource = "local_rules";

  if (captcha_token && modResult.tier !== "flagged") {
    initialStatus = "approved";
    flags |= 0x40; // Turnstile flag
    modSource = "turnstile";
  } else if (modResult.tier === "approved") {
    initialStatus = "approved";
    modSource = "clean";
  }

  // Compact Hex Code e.g. "0x09", "0x40", "0x00"
  const modReason = `0x${flags.toString(16).padStart(2, "0")}`;

  // ── Insert with initial status & audit log ────────────────────────────
  const newComment = insertComment({
    ...result.output,
    status: initialStatus,
    mod_flags: flags,
    mod_confidence: modResult.score,
    mod_reason: modReason,
    mod_source: modSource,
  });

  // ── Layer 3: Async Gemini gate for "pending" comments ─────────────────
  if (modResult.tier === "pending") {
    geminiModerate(content)
      .then((geminiResult) => {
        if (!geminiResult) {
          updateCommentStatus(
            newComment.id,
            "pending",
            0x80,
            0.0,
            "0x80",
            "gemini_ai"
          );
          return;
        }
        const isBad = (geminiResult.f & 0x01) !== 0;
        const newStatus = isBad && geminiResult.c > 0.7 ? "flagged" : "approved";
        const finalFlags = geminiResult.f | 0x80;
        const reasonHex = `0x${finalFlags.toString(16).padStart(2, "0")}`;

        updateCommentStatus(
          newComment.id,
          newStatus,
          finalFlags,
          geminiResult.c,
          reasonHex,
          "gemini_ai"
        );
      })
      .catch(() => {
        updateCommentStatus(
          newComment.id,
          "pending",
          0x80,
          0.0,
          "0x80",
          "gemini_ai"
        );
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
