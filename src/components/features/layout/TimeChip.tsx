/**
 * A compact, data-dense chip component for rendering paired time metrics or metadata.
 *
 * Typically used in grids or rows to display contextual timestamps, dates, or intervals
 * (e.g., "Created At", "Updated At"). Features an auto-expanding layout box with nested
 * micro-typography optimized for scannability.
 *
 * @component
 * @example
 * ```tsx
 * <TimeChip label="Last Modified" value="2 hours ago" />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The context title for the timestamp (rendered as micro-text).
 * @param {string} props.value - The dynamic time string or date value to be highlighted.
 *
 * @style Dependencies:
 * - `flex-1` Fills available horizontal layout space evenly within a flex parent container
 * - `bg-gray-50` / `dark:bg-gray-800/60` Muted background grouping frame
 * - `rounded-lg` Modern 8px standard card corner rounding
 * - `text-[10px]` Custom microscopic label tracking text size
 * - `mb-0.5` Micro-spacing of 2px between label header and time string
 */

function TimeChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800/60 rounded-lg px-3 py-2.5">
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">
        {label}
      </p>
      <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
        {value}
      </p>
    </div>
  );
}

export default TimeChip;
