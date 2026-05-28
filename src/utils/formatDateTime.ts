/**
 * Formats an ISO date string into a localized South African (en-ZA) date and time format.
 *
 * Safely handles null, undefined, or empty inputs by returning `null`. When a valid
 * ISO string is provided, it outputs a clean, human-readable string structured with short month
 * names, 2-digit times, and no comma separators (typical of the `en-ZA` locale format).
 *
 * @function
 * @example
 * ```typescript
 * formatDateTime("2026-05-28T14:30:00Z");
 * // Output: "28 Jun 2026, 14:30" or "28 Jun 2026 14:30" (depending on browser engine specifics)
 *
 * formatDateTime(null);
 * // Output: null
 * ```
 *
 * @param {string | null} [iso] - The standard ISO 8601 date string to convert.
 * @returns {string | null} The formatted date-time string, or `null` if the input is missing.
 *
 * @locale Configuration Details:
 * - `day: "numeric"` Renders day as an unpadded digit (e.g., 5 or 28)
 * - `month: "short"` Uses abbreviated text month strings (e.g., "Jan", "May")
 * - `year: "numeric"` Full 4-digit calendar year configuration
 * - `hour / minute: "2-digit"` Forces constant-width 24-hour time padding (e.g., "09:05")
 */

export const formatDateTime = (iso?: string | null) => {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
