import type { ContactConfig } from "~/types/contact";

export const contactConfig = {
  rateLimit: {
    maxBurstRequests: 3,
    burstWindowSeconds: 30,
    maxWindowRequests: 5,
    maxWindowSeconds: 600,
  },
} as const satisfies ContactConfig;
