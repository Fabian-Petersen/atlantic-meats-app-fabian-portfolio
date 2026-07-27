/**
 * Formats an ISO 8601 timestamp into a human-friendly relative date string.
 *
 * Display rules:
 * - Less than 1 minute: "Now"
 * - Less than 1 hour: "X min(s) ago"
 * - Less than 24 hours: "X hour(s) ago"
 * - 1 day: "Yesterday"
 * - 2–6 days: "X days ago"
 * - 7+ days: Formatted date (e.g. "21 Jul 2026")
 *
 * This function is intended for rendering notification timestamps in the UI.
 * The backend should continue returning the original ISO timestamp while the
 * frontend determines how it should be displayed.
 *
 * @param isoDate - Notification creation date in ISO 8601 format.
 * @returns A human-readable relative date string.
 *
 * @example
 * ```ts
 * formatNotificationDate("2026-07-27T09:55:30+02:00");
 * // "Now"
 *
 * formatNotificationDate("2026-07-27T09:20:30+02:00");
 * // "35 mins ago"
 *
 * formatNotificationDate("2026-07-26T15:30:00+02:00");
 * // "Yesterday"
 *
 * formatNotificationDate("2026-07-24T10:00:00+02:00");
 * // "3 days ago"
 *
 * formatNotificationDate("2026-07-15T08:00:00+02:00");
 * // "15 Jul 2026"
 * ```
 */

export function formatNotificationDate(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);

  const diffMs = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "now";

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(diffMs / day);

  if (days === 1) return "yesterday";

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
