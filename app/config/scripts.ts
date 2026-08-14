/**
 * Application Head Scripts Configuration
 * Centralized definition for inline theme initialization.
 */

// Zero-FOUC theme initialization script (runs synchronously in head before layout render)
export const themeInitScript = `
(function() {
  try {
    var match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
    var cookieTheme = match ? decodeURIComponent(match[1]) : null;
    var isDark = cookieTheme === 'dark' || (!cookieTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
export function getHeadScripts() {
  return [
    {
      innerHTML: themeInitScript,
      type: "text/javascript",
    },
  ];
}
