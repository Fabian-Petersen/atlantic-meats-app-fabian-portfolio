import { cn } from "@/lib/utils";

/**
 * A financial metric card for displaying formatted cost or currency values.
 *
 * Includes built-in string validation to check if a value is empty or missing.
 * If a valid number string is provided, it formats it using localized commas and prepends
 * the currency symbol (R). If the value is empty, it scales back contrast and shows an em-dash.
 *
 * @component
 * @example
 * ```tsx
 * <CostCard label="Estimated Total" value="250000" />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The title descriptor for the financial figure.
 * @param {string | null} [props.value] - The cost numeric string. If blank or missing, triggers fallback styling.
 *
 * @style Dependencies:
 * - `bg-gray-50` / `dark:bg-gray-800/60` Subdued background card styling
 * - `text-[10px]` Microscopic layout typography for headers
 * - `text-lg font-medium` Large, high-visibility pricing layout weight
 * - `text-gray-300` / `dark:text-gray-600` Dimmed styling logic applied exclusively to empty dashboard metrics
 */
function CostCard({ label, value }: { label: string; value?: string | null }) {
  const isEmpty = !value || value.trim() === "";
  return (
    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg px-4 py-3">
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">
        {label}
      </p>
      <p
        className={cn(
          "text-lg font-medium",
          isEmpty
            ? "text-gray-300 dark:text-gray-600"
            : "text-gray-900 dark:text-gray-100",
        )}
      >
        {isEmpty ? "—" : `R ${Number(value).toLocaleString()}`}
      </p>
    </div>
  );
}

export default CostCard;
