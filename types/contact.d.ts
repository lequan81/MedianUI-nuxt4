export interface ContactConfig {
  rateLimit: {
    maxBurstRequests: number;
    burstWindowSeconds: number;
    maxWindowRequests: number;
    maxWindowSeconds: number;
  };
  messages: {
    success: string;
    burstLimitExceeded: (retryAfter: number) => string;
    windowLimitExceeded: (retryAfter: number) => string;
    validationError: string;
    serverError: string;
  };
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  captcha_token: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactFormInput, string>>;
export type ContactTouchedFields = Partial<Record<keyof ContactFormInput, boolean>>;

export interface RateLimitRequestLog {
  timestamps: number[];
}
