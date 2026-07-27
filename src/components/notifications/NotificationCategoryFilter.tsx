// NotificationCategoryFilter.tsx
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  type NotificationCategory,
} from "@/utils/notificationCategory";

/**
 * Props for the NotificationCategoryFilter component.
 */
type NotificationCategoryFilterProps = {
  /**
   * The currently selected notification category.
   *
   * Use `"all"` to display notifications from every category.
   */
  activeCategory: NotificationCategory | "all";

  /**
   * Callback invoked when the user selects a different category.
   *
   * @param category - The newly selected category or `"all"`.
   */
  onCategoryChange: (category: NotificationCategory | "all") => void;

  /**
   * The list of notification categories that currently contain
   * one or more notifications.
   *
   * Only these categories will be rendered as filter chips.
   */
  availableCategories: NotificationCategory[];
};

/**
 * Displays a horizontally scrollable set of filter chips for
 * notification categories.
 *
 * The component renders an **All** filter followed by a chip for
 * each available notification category. Selecting a chip invokes
 * the provided callback so the parent component can update the
 * displayed notifications.
 *
 * If no categories are available, the component renders nothing.
 *
 * @param props - The component props.
 * @returns A category filter bar, or `null` when there are no
 * available categories.
 *
 * @example
 * ```tsx
 * <NotificationCategoryFilter
 *   activeCategory={activeCategory}
 *   onCategoryChange={setActiveCategory}
 *   availableCategories={["TRANSFER", "REMINDER"]}
 * />
 * ```
 */
export default function NotificationCategoryFilter({
  activeCategory,
  onCategoryChange,
  availableCategories,
}: NotificationCategoryFilterProps) {
  // Don't render the filter bar when there are no categories to display.
  if (availableCategories.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-2 pb-2 overflow-x-auto no-scrollbar">
      <button
        type="button"
        onClick={() => onCategoryChange("all")}
        className={cn(
          "shrink-0 rounded-sm px-3 py-1 text-xs transition-colors hover:cursor-pointer",
          activeCategory === "all"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400",
        )}
      >
        All
      </button>

      {availableCategories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={cn(
              "shrink-0 rounded-sm px-3 py-1 text-xs transition-colors hover:cursor-pointer",
              isActive
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400",
            )}
          >
            {CATEGORY_LABELS[category]}
          </button>
        );
      })}
    </div>
  );
}
