export type ContactFormStatus =
  | { readonly kind: "idle" }
  | { readonly kind: "submitting" }
  | { readonly kind: "submitted"; readonly data: SubmittedContactData }
  | { readonly kind: "error"; readonly message: string };

export interface ContactMessage {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly subject?: string;
  readonly message: string;
  readonly status: "unread" | "read" | "archived";
  readonly created_at: string;
  readonly ip?: string;
}

export interface ContactSubmission {
  readonly name: string;
  readonly email: string;
  readonly subject?: string;
  readonly message: string;
  readonly captcha_token?: string;
}

export interface RequestLog {
  timestamps: number[];
  readonly ip?: string;
}

export interface SubmittedContactData {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  readonly time: string;
}

export interface ContactConfig {
  readonly rateLimit: {
    readonly maxBurstRequests: number;
    readonly burstWindowSeconds: number;
    readonly maxWindowRequests: number;
    readonly maxWindowSeconds: number;
  };
}
