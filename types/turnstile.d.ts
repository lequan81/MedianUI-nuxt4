export interface TurnstileWidgetOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: (error?: any) => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
}

export interface TurnstileObject {
  render: (container: string | HTMLElement, options: TurnstileWidgetOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileObject;
  }
}

export {};
