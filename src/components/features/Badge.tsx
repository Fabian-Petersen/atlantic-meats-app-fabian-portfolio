// $ ─── Badge Component ────────────────────────────────────────────────────────────

/**
 * Badge Component
 *
 * Renders a small, styled label (badge) based on a provided value.
 * The visual appearance is determined by a `styleMap`, which maps
 * normalized (lowercased) values to corresponding CSS class strings.
 *
 * If no matching style is found for the given value, a default
 * neutral style is applied.
 *
 * Props:
 * - value (string):
 *   The text displayed inside the badge. Also used to resolve the style key.
 *
 * - styleMap (Record<string, string>):
 *   A mapping of lowercase values to Tailwind (or custom) class strings
 *   used to style the badge.
 *
 * Behavior:
 * - Converts `value` to lowercase to look up styles in `styleMap`
 * - Falls back to a default style if no match is found
 * - Automatically capitalizes the displayed value via CSS
 *
 * Example usage:
 *
 * ```tsx
 * const statusStyles = {
 *   approved: "bg-green-100 text-green-700 border-green-200",
 *   pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
 *   rejected: "bg-red-100 text-red-700 border-red-200",
 * };
 *
 * <Badge value="Approved" styleMap={statusStyles} />
 * <Badge value="Pending" styleMap={statusStyles} />
 * <Badge value="Unknown" styleMap={statusStyles} /> // uses default styling
 * ```
 */

export function Badge({
  value,
  styleMap,
}: {
  value: string;
  styleMap: Record<string, string>;
}) {
  const key = value?.toLowerCase();
  const cls =
    styleMap[key] ??
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}
    >
      {value}
    </span>
  );
}
