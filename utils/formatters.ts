/**
 * Standard utility functions for UI formatting (Date, Numbers, Text)
 */

/**
 * Format date string into localized date format (e.g. "10 Th11, 2024" or "Nov 10, 2024")
 */
export function formatDate(dateString?: string | Date, locale: string = "vi-VN"): string {
  if (!dateString) return "";
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Format date string with time (e.g. "14:30, 10 Th11, 2024")
 */
export function formatDateTime(dateInput?: string | Date, locale: string = "vi-VN"): string {
  if (!dateInput) return "";
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const timeStr = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const dateStr = formatDate(date, locale);
  return `${timeStr}, ${dateStr}`;
}

/**
 * Format numbers with compact notation via native Intl (e.g. 1500 -> 1.5k, 1200000 -> 1.2M)
 */
export function formatNumber(num: number, locale: string = "vi-VN"): string {
  if (typeof num !== "number" || isNaN(num)) return "0";
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

// Alias for backward compatibility
export const formatCompactNumber = formatNumber;

/**
 * Truncate long text strings with ellipsis (Reserved for non-DOM metadata like meta tags)
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Format relative time (e.g. "Vừa xong", "5m", "2h", "3d" or "5m ago", "2h ago")
 */
export function formatTimeAgo(dateInput?: string | Date | null, fallback = "Vừa xong"): string {
  if (!dateInput) return fallback;
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return fallback;

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return fallback;

  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return fallback;
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}

// Alias for backward compatibility
export const formatRelativeTime = formatTimeAgo;
