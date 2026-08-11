/**
 * Hybrid Comment Moderation Engine (Score-Based 3-Tier)
 *
 * Layer 1: Fast blacklist dictionary lookup (O(1) per keyword)
 * Layer 2: Regex pattern matching for structural spam
 * Layer 3: Gemini LLM async gate (handled externally for "uncertain" tier)
 *
 * Returns a score that maps to 3 tiers:
 *   score < 0.3  → "approved"   (clean, auto-approve)
 *   score 0.3–0.75 → "pending"  (uncertain, send to Gemini async)
 *   score > 0.75 → "flagged"    (clear violation, block immediately)
 */

import { scanBlacklist } from "./blacklist-dict";
import type { BlacklistCategory, ModerationResult, ModerationTier } from "~/types/moderation";

// ── Moderation Flags (bit field) ─────────────────────────────────────────
export const MOD_FLAGS = {
  BAD: 0x01,
  SPAM_LINK: 0x02,
  GAMBLING: 0x04,
  NSFW: 0x08,
  PROFANITY: 0x10,
  BOT_PATTERN: 0x20,
  AI_CHECKED: 0x80,
} as const;

// Category → flag bit mapping
const CATEGORY_FLAG: Record<BlacklistCategory, number> = {
  SPAM_LINK: MOD_FLAGS.SPAM_LINK,
  GAMBLING: MOD_FLAGS.GAMBLING,
  NSFW: MOD_FLAGS.NSFW,
  PROFANITY: MOD_FLAGS.PROFANITY,
};

// ── Structural spam regex patterns ───────────────────────────────────────
const SPAM_URL_REGEX =
  /(https?:\/\/|www\.)[^\s]+|(t\.me\/|zalo\.me\/|bit\.ly\/|tinyurl\.com\/|wa\.me\/)/i;
const REPEATED_CHAR_REGEX = /(.)\1{9,}/;

/**
 * Run fast local moderation on comment text.
 * Total execution time: < 1ms for typical comments.
 */
export function moderateComment(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { tier: "flagged", score: 1.0, flags: MOD_FLAGS.BAD, reason: "Empty comment" };
  }

  const cleanText = text.trim();

  // ── Layer 1: Blacklist dictionary O(1) lookup ──────────────────────────
  const blacklistHit = scanBlacklist(cleanText);
  if (blacklistHit.matched && blacklistHit.category) {
    const categoryFlag = CATEGORY_FLAG[blacklistHit.category] || 0;
    return {
      tier: blacklistHit.score >= 0.75 ? "flagged" : "pending",
      score: blacklistHit.score,
      flags: MOD_FLAGS.BAD | categoryFlag,
      reason: `Blacklist match: "${blacklistHit.keyword}" (${blacklistHit.category})`,
    };
  }

  // ── Layer 2: Structural spam patterns ──────────────────────────────────

  // URL / external link in comment
  if (SPAM_URL_REGEX.test(cleanText)) {
    return {
      tier: "pending", // URLs are suspicious but may be legitimate
      score: 0.55,
      flags: MOD_FLAGS.SPAM_LINK,
      reason: "Contains external URL",
    };
  }

  // Repeated character spam
  if (REPEATED_CHAR_REGEX.test(cleanText)) {
    return {
      tier: "flagged",
      score: 0.80,
      flags: MOD_FLAGS.BAD | MOD_FLAGS.BOT_PATTERN,
      reason: "Repeated character pattern",
    };
  }

  // Very short comments (1-2 chars) are suspicious
  if (cleanText.length <= 2) {
    return {
      tier: "pending",
      score: 0.35,
      flags: 0,
      reason: "Very short comment",
    };
  }

  // ── Clean ──────────────────────────────────────────────────────────────
  return {
    tier: "approved",
    score: 0.0,
    flags: 0,
  };
}

/**
 * Determine tier from a numeric score.
 */
export function scoreToTier(score: number): ModerationTier {
  if (score >= 0.75) return "flagged";
  if (score >= 0.3) return "pending";
  return "approved";
}
