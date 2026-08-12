/**
 * Application Head Scripts Configuration
 * Centralized definition for inline theme IIFE and external scripts (Cloudflare Turnstile).
 */

// Theme initialization IIFE script (prevents FOUC on initial page render)
export const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('median_theme');
    var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`.trim();

/**
 * Generates head script objects for Nuxt app config.
 */
export function getHeadScripts(turnstileUrl?: string) {
  const turnstileSrc = turnstileUrl || "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

  return [
    {
      innerHTML: themeInitScript,
      type: "text/javascript",
    },
    {
      src: turnstileSrc,
      async: true,
      defer: true,
    },
  ];
}
