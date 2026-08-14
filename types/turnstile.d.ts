export interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: (errorCode?: string) => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  appearance?: "always" | "execute" | "interaction-only";
  size?: "normal" | "compact" | "flexible";
  action?: string;
  cData?: string;
}

export interface TurnstileInstance {
  render: (container: string | HTMLElement | Element | unknown, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
    onloadTurnstileCallback?: () => void;
  }
}

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    turnstileSiteKey: string;
    turnstileScriptUrl: string;
    siteUrl: string;
  }
  interface RuntimeConfig {
    turnstileSecretKey: string;
    turnstileVerifyUrl: string;
    dbFileName: string;
    adminSecret: string;
    adminPassword?: string;
    adminHmacSecret?: string;
  }
}

declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    turnstileSiteKey: string;
    turnstileScriptUrl: string;
    siteUrl: string;
  }
  interface RuntimeConfig {
    turnstileSecretKey: string;
    turnstileVerifyUrl: string;
    dbFileName: string;
    adminSecret: string;
    adminPassword?: string;
    adminHmacSecret?: string;
  }
}
