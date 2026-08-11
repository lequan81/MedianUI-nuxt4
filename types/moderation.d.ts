export type BlacklistCategory = "PROFANITY" | "NSFW" | "GAMBLING" | "SPAM_LINK";

export interface BlacklistMatch {
  matched: boolean;
  category?: BlacklistCategory;
  keyword?: string;
  score: number;
}

export type ModerationTier = "approved" | "pending" | "flagged";

export interface ModerationResult {
  tier: ModerationTier;
  score: number;
  flags: number;
  reason?: string;
}

export interface GeminiFlags {
  f: number;
  c: number;
}

export interface GeminiModelState {
  name: string;
  cooldownUntil: number;
  requestCount: number;
  errorCount: number;
}

export interface TurnstileResult {
  success: boolean;
  errorCodes?: string[];
}
