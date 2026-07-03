import { badgeStyles } from "@/styles/badgeStyles";
import { cn } from "@/lib/utils";

// $ ─── Badge Component ────────────────────────────────────────────────────────────

/**
 * Badge Component
 *
 * Renders a reusable badge used to visually represent categorized values
 * such as priority, impact, status, or condition labels.
 *
 * Styling is resolved dynamically from a provided `styleMap`, allowing
 * multiple badge families to share the same component while maintaining
 * consistent structure and spacing.
 *
 * Badge styling is composed from:
 * - Shared base badge styles (`badgeStyles.base`)
 * - Family-specific variant styles (`priority`, `impact`, `condition`, etc.)
 * - A fallback neutral style when no matching key exists
 *
 * Props:
 * - value (string):
 *   The text displayed inside the badge.
 *   Also used to resolve the corresponding style key.
 *
 * - styleMap (Record<string, string>):
 *   A collection of variant styles mapped by lowercase keys.
 *   Typically sourced from a shared badge style family such as:
 *   `badgeStyles.families.priority`
 *
 * Behavior:
 * - Normalizes the provided value using `.toLowerCase()`
 * - Resolves the matching variant style from `styleMap`
 * - Falls back to a neutral default style if no match exists
 * - Applies shared badge layout and typography styles automatically
 * - Uses CSS capitalization for consistent visual formatting
 *
 * Example usage:
 *
 * ```tsx
 * import { badgeStyles } from "@/styles/shared";
 *
 * <Badge
 *   value="Critical"
 *   styleMap={badgeStyles.families.priority}
 * />
 *
 * <Badge
 *   value="Production"
 *   styleMap={badgeStyles.families.impact}
 * />
 *
 * <Badge
 *   value="Operational"
 *   styleMap={badgeStyles.families.condition}
 * />
 *
 * <Badge
 *   value="Unknown"
 *   styleMap={badgeStyles.families.priority}
 * />
 * // Uses fallback styling
 * ```
 */

export function Badge({
  value,
  styleMap,
  className,
}: {
  value: string;
  styleMap: Record<string, string>;
  className?: string;
}) {
  const key = value?.toLowerCase();

  return (
    <span
      className={cn(
        badgeStyles.base,
        styleMap[key] ?? badgeStyles.fallback,
        className,
      )}
    >
      {value}
    </span>
  );
}
