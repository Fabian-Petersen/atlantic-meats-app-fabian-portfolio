import { cn } from "@/lib/utils";

/**
 * A foundational surface panel component used to group related UI elements.
 *
 * Acts as a standard content card with an adaptive background, subtle borders,
 * large rounded corners, and default padding. It safely accepts custom style
 * overrides from parent layouts via a utility class merger function.
 *
 * @component
 * @example
 * ```tsx
 * <SurfaceCard className="shadow-sm max-w-md">
 *   <h3>Card Content</h3>
 * </SurfaceCard>
 * ```
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The inner content layout or child nodes.
 * @param {string} [props.className] - Optional extra Tailwind utility classes to override or extend base styles.
 *
 * @style Dependencies:
 * - `cn(...)` Style utility function to merge base classes and override classes safely
 * - `bg-white` / `dark:bg-gray-800/40` The primary content layer canvas color
 * - `border` / `rounded-xl` Structural frame using a modern 12px card corner radius
 * - `p-4` Standard uniform padding layer of 16px
 */
function SurfaceCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default SurfaceCard;
