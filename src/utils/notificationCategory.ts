import type { NotificationType } from "@/schemas";

/**
 * High-level categories used to group notification types in the UI.
 *
 * Categories are intended for filtering, grouping, and displaying
 * notifications under a common heading.
 */
export type NotificationCategory =
  | "TRANSFER"
  | "JOB"
  | "REMINDER"
  | "LEAVE"
  | "ANNOUNCEMENT"
  | "ATTENDANCE"
  | "OTHER";

/**
 * Maps each notification type to its corresponding UI category.
 *
 * Any notification type that is not explicitly mapped will be
 * categorized as `"OTHER"` by {@link getNotificationCategory}.
 */
const TYPE_TO_CATEGORY: Record<NotificationType, NotificationCategory> = {
  TRANSFER_APPROVED: "TRANSFER",
  TRANSFER_REJECTED: "TRANSFER",
  TRANSFER_REQUEST_SUBMITTED: "TRANSFER",
  TRANSFER_IN_TRANSIT: "TRANSFER",
  TRANSFER_RECEIVED: "TRANSFER",
  TRANSFER_CANCELLED: "TRANSFER",

  JOB_ASSIGNED: "JOB",
  JOB_COMPLETED: "JOB",
  JOB_OVERDUE: "JOB",

  CLOCK_OUT_REMINDER: "REMINDER",
  APPROVAL_REMINDER: "REMINDER",

  LEAVE_APPROVED: "LEAVE",
  LEAVE_REJECTED: "LEAVE",
  LEAVE_REQUEST_SUBMITTED: "LEAVE",

  ANNOUNCEMENT: "ANNOUNCEMENT",
};

/**
 * Returns the high-level category for a notification type.
 *
 * If the notification type is not present in the internal mapping,
 * the function returns `"OTHER"` as a safe fallback.
 *
 * @param type - The notification type returned by the backend.
 * @returns The corresponding notification category.
 *
 * @example
 * ```ts
 * const category = getNotificationCategory("TRANSFER_APPROVED");
 * // "TRANSFER"
 * ```
 *
 * @example
 * ```ts
 * const category = getNotificationCategory(notification.type);
 *
 * if (category === "JOB") {
 *   // Display the notification in the Jobs section
 * }
 * ```
 */
export function getNotificationCategory(
  type: NotificationType,
): NotificationCategory {
  return TYPE_TO_CATEGORY[type] ?? "OTHER";
}

/**
 * Human-readable labels for each notification category.
 *
 * These labels are intended for use in UI components such as
 * section headings, filter chips, and dropdown menus.
 *
 * @example
 * ```ts
 * const label = CATEGORY_LABELS["TRANSFER"];
 * // "Transfers"
 * ```
 */
export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  TRANSFER: "Transfers",
  JOB: "Jobs",
  REMINDER: "Reminders",
  LEAVE: "Leave",
  ANNOUNCEMENT: "Announcements",
  ATTENDANCE: "Attendance",
  OTHER: "Other",
};
