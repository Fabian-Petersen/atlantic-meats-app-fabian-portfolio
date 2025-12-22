import moment from "moment";

/**
 * Formats a given date value to 'DD/MM/YYYY'.
 *
 * @param value - The date input (can be a Date object, string, or number timestamp).
 * @returns A formatted date string or an empty string if the input is invalid.
 */
export function formatDate(value: Date | string | number): string {
  const date = moment(value);
  return date.isValid() ? date.format("YYYY-MM-DD") : "";
}
