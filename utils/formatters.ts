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

/**
 * Format relative time (e.g. "Vừa xong", "5m", "2h", "3d")
 */
export function formatRelativeTime(created_at?: string): string {
  if (!created_at) return "Vừa xong";
  const date = new Date(created_at);
  if (isNaN(date.getTime())) return "Vừa xong";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
