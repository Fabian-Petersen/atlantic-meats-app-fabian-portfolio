import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

/**
 * A reusable UI component for displaying a single row of information inside a card.
 *
 * - Renders an optional icon on the left, followed by a label and a value.
 * - The `label` represents the field name (e.g. "Status", "Assigned To").
 * - The `value` represents the corresponding data to display.
 *
 * - If `children` is provided, it overrides the default value rendering,
 *   allowing for custom content (e.g. badges, formatted text, or components).
 *
 * - If no `value` is provided and no `children` are passed, a fallback ("—")
 *   is displayed to indicate missing data.
 *
 * - Accepts an optional `className` to extend or override default styling on the parent element.
 *
 * - Designed for consistent layout and spacing across card-based UIs,
 *   with responsive text styling and support for light/dark themes.
 *
 * @param icon - Optional React component to render as an icon
 * @param label - The label describing the data field
 * @param value - The value to display (used if no children are provided)
 * @param children - Optional custom content to override the value display
 * @param className - Optional additional CSS classes for styling
 * @param textStyles - Optional additional CSS styling for the displayed text
 * @param iconStyles - Optional additional CSS classes for styling the icon
 */

export function CardRow({
  icon: Icon,
  label,
  value,
  children,
  className,
  labelStyles,
  valueStyles,
  iconStyles,
}: {
  icon?: React.ElementType;
  label?: string;
  value?: string;
  children?: React.ReactNode;
  className?: string;
  labelStyles?: string;
  valueStyles?: string;
  iconStyles?: string;
}) {
  return (
    <div className={cn(sharedStyles.cardRow, className)}>
      {Icon && (
        <div className="shrink-0">
          <Icon
            className={cn(
              "w-4 h-4 text-gray-400 dark:text-gray-500",
              iconStyles,
            )}
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex justify-between items-center">
        {label && (
          <p
            className={cn(
              "dark:text-(--clr-textDark) text-(--clr-textLight) mb-0.5 text-xs capitalize",
              labelStyles,
            )}
          >
            {label}
          </p>
        )}
        {children ?? (
          <p
            className={cn(
              "text-(--clr-textLight) dark:text-gray-400 capitalize leading-relaxed text-xs",
              valueStyles,
            )}
          >
            {value || "-"}
          </p>
        )}
      </div>
    </div>
  );
}
