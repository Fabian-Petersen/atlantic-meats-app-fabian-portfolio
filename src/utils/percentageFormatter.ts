/**
 * Formats a numeric value into a percentage-friendly string.
 *
 * - If `isDecimal` is true, the function assumes the input is a decimal
 *   (e.g. 0.2) and converts it to a percentage by multiplying by 100.
 *   Example: 0.2 → 20
 *
 * - If `isDecimal` is false, the value is treated as already being
 *   in percentage form (e.g. 20 stays 20).
 *
 * - Uses `Intl.NumberFormat` to format the number:
 *   • minimumFractionDigits: 0 → removes unnecessary trailing decimals
 *     (e.g. 20.00 → 20)
 *   • maximumFractionDigits: 2 → limits decimals to at most 2 places
 *     (e.g. 33.3333 → 33.33)
 *
 * - Returns a string representation of the formatted number.
 *   Note: The "%" symbol is NOT included and should be added where used.
 *
 * @param value - The numeric value to format
 * @param isDecimal - Whether the value is a decimal that needs conversion
 * @returns Formatted number as a string (e.g. "20" or "33.33")
 */

export const formatPercentage = (value: number, isDecimal = false): string => {
  const formattedValue = isDecimal ? value * 100 : value;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(formattedValue);
};
