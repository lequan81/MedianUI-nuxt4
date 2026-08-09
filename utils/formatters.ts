/**
 * Utility functions for UI formatting (Date, Numbers, Text)
 */

/**
 * Format date string into Vietnamese localized date format (e.g. "10 Th11, 2024")
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Format numbers with compact K/M suffixes (e.g. 1500 -> 1.5k, 1200000 -> 1.2M)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith(".0") ? `${Math.floor(num / 1000)}k` : `${formatted}k`;
  }
  const formatted = (num / 1000000).toFixed(1);
  return formatted.endsWith(".0") ? `${Math.floor(num / 1000000)}M` : `${formatted}M`;
}

/**
 * Truncate long text strings with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
