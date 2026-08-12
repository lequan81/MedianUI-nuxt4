export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
  ip?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject?: string;
  message: string;
  captcha_token?: string;
}

export interface RequestLog {
  timestamps: number[];
  ip?: string;
}

export interface ContactConfig {
  rateLimit: {
    maxBurstRequests: number;
    burstWindowSeconds: number;
    maxWindowRequests: number;
    maxWindowSeconds: number;
  };
  messages: {
    success: string;
    burstLimitExceeded: (seconds: number) => string;
    windowLimitExceeded: (seconds: number) => string;
    validationError: string;
    serverError: string;
  };
}
