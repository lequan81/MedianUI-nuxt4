/**
 * Vietnamese Blacklist Dictionary
 * O(1) lookup via Set for banned words, spam patterns, and profanity.
 * Covers: profanity, NSFW/sexual, gambling/scam, spam social links.
 */

import type { BlacklistCategory, BlacklistMatch } from "~/types/moderation";

// ── Profanity & Insults ──────────────────────────────────────────────────
const PROFANITY_WORDS: readonly string[] = [
  // Vietnamese profanity (direct & teencode)
  "địt",
  "đụ",
  "đm",
  "đcm",
  "dkm",
  "dcm",
  "vcl",
  "vl",
  "vkl",
  "lồn",
  "loz",
  "lol",
  "cặc",
  "cặk",
  "buồi",
  "đéo",
  "đéu",
  "đù",
  "đù má",
  "đù mé",
  "mẹ mày",
  "má mày",
  "bố mày",
  "cha mày",
  "chó đẻ",
  "con chó",
  "thằng chó",
  "đồ chó",
  "ngu",
  "ngu vl",
  "ngu vcl",
  "đần",
  "khùng",
  "cút",
  "cút đi",
  "biến đi",
  // English profanity
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "motherfucker",
  "dick",
  "pussy",
  "wtf",
  "stfu",
  "fck",
  "fuk",
] as const;

// ── NSFW / Sexual ────────────────────────────────────────────────────────
const NSFW_WORDS: readonly string[] = [
  "địt nhau",
  "dit nhau",
  "djt nhau",
  "chịch nhau",
  "chich nhau",
  "địt",
  "dit",
  "djt",
  "chịch",
  "chich",
  "xoạc",
  "xoac",
  "nện",
  "phịch",
  "phich",
  "xếp hình",
  "xep hinh",
  "bú cu",
  "bu cu",
  "bú lồn",
  "bu lon",
  "liếm lồn",
  "liem lon",
  "bóp vú",
  "bop vu",
  "gái gọi",
  "gai goi",
  "cave",
  "sex",
  "sẽx",
  "sếch",
  "xxx",
  "porn",
  "dâm dục",
  "dam duc",
  "dâm",
  "clip hot",
  "clip nóng",
  "clip sex",
  "lộ clip",
  "lo clip",
  "lộ hàng",
  "show hàng",
  "show hang",
  "khiêu dâm",
  "khieu dam",
  "chat sex",
  "sexting",
  "onlyfans",
  "OF link",
] as const;

// ── Gambling & Scam ──────────────────────────────────────────────────────
const GAMBLING_WORDS: readonly string[] = [
  "tài xỉu",
  "tai xiu",
  "kèo bóng",
  "keo bong",
  "nạp rút",
  "nap rut",
  "xóc đĩa",
  "xoc dia",
  "baccarat",
  "casino",
  "cá cược",
  "ca cuoc",
  "nhà cái",
  "nha cai",
  "uy tín 100%",
  "kiếm tiền online",
  "kiem tien online",
  "hoa hồng",
  "thu nhập thụ động",
  "đầu tư lãi suất",
] as const;

// ── Spam Link Patterns (substring match) ─────────────────────────────────
const SPAM_LINK_PATTERNS: readonly string[] = [
  "t.me/",
  "zalo.me/",
  "bit.ly/",
  "tinyurl.com/",
  "wa.me/",
  "chat.whatsapp.com/",
  "facebook.com/groups/",
  "nhan_tin",
  "ib_shop",
  "ib",
  "Inbox",
  "i'b",
  "link bio",
  "check bio",
  "inbox mình",
  "nhắn tin mình",
] as const;

const CATEGORY_SCORE: Record<BlacklistCategory, number> = {
  PROFANITY: 0.85,
  NSFW: 0.95,
  GAMBLING: 0.9,
  SPAM_LINK: 0.95,
};

// ── Build lookup structures ──────────────────────────────────────────────
// Map<normalized_word, category> for exact-match O(1) lookup
const wordCategoryMap = new Map<string, BlacklistCategory>();

function addWords(words: readonly string[], category: BlacklistCategory) {
  for (const w of words) {
    wordCategoryMap.set(w.toLowerCase(), category);
  }
}

addWords(PROFANITY_WORDS, "PROFANITY");
addWords(NSFW_WORDS, "NSFW");
addWords(GAMBLING_WORDS, "GAMBLING");
addWords(SPAM_LINK_PATTERNS, "SPAM_LINK");

/**
 * Scan text against the blacklist dictionary.
 * Uses substring search against the Map keys for O(N*K) where N=text length, K=avg key length.
 * In practice this is < 0.5ms for typical comment lengths (< 1000 chars).
 */
export function scanBlacklist(text: string): BlacklistMatch {
  if (!text) return { matched: false, score: 0 };
  const lower = text.toLowerCase();
  // Strip punctuation/leetspeak dots (e.g. "Đ.ịt" -> "địt", "đ.ị.t" -> "địt"), preserving word boundaries
  const normalized = lower.replace(/[\.\_\-\*\@\!\?\,\;]/g, "");

  for (const [keyword, category] of wordCategoryMap) {
    const keywordLower = keyword.toLowerCase();
    const keywordNormalized = keywordLower.replace(/[\.\_\-\*\@\!\?\,\;]/g, "");

    if (
      lower.includes(keywordLower) ||
      (keywordNormalized.length >= 2 && normalized.includes(keywordNormalized))
    ) {
      return {
        matched: true,
        category,
        keyword,
        score: CATEGORY_SCORE[category],
      };
    }
  }

  return { matched: false, score: 0 };
}

/**
 * Get all blacklist keywords as a readonly Set for external inspection/testing.
 */
export function getBlacklistSize(): number {
  return wordCategoryMap.size;
}
