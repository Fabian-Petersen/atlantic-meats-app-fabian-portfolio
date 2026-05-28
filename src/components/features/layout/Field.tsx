/**
 * A key-value list row component designed to display labeled data fields.
 *
 * Automatically handles conditional rendering by returning `null` if the value
 * is missing, undefined, or empty. It formats the data into a responsive,
 * layout-aligned row with a fixed-width label, theme-aware borders, and capitalized text.
 *
 * @component
 * @example
 * ```tsx
 * <Field label="Status" value="active" />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The title or key name of the data field.
 * @param {string | null} [props.value] - The content to display. If falsy or omitted, the row hides entirely.
 *
 * @style Dependencies:
 * - `flex items-start gap-2` Horizontal layout aligned to the top with spacing
 * - `w-27.5 shrink-0` Fixed arbitrary width (110px) for consistent label alignment across rows
 * - `capitalize` Capitalises the first letter of the value text strings
 * - `border-b last:border-0` Renders bottom dividers between adjacent rows automatically
 */

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-2.5 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
      <span className="w-27.5 shrink-0 text-xs text-gray-400 dark:text-gray-500 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-100 capitalize">
        {value}
      </span>
    </div>
  );
}
export default Field;
