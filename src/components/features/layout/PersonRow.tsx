import Avatar from "@/components/header/Avatar";

/**
 * A profile row component used to display a person's avatar alongside identity details.
 *
 * Arranges an avatar, a primary display name, and a secondary contextual subtitle (like role,
 * email, or department) into a clean layout row. Automatically capitalizes name elements
 * and implements a compact, line-height optimized typography stack.
 *
 * @component
 * @example
 * ```tsx
 * <PersonRow name="john doe" sub="Project Manager" />
 * ```
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The full name of the user, used for both text display and generating avatar initials.
 * @param {string} props.sub - Secondary subtitle information shown underneath the primary name.
 *
 * @style Dependencies:
 * - `flex items-center gap-3` Horizontal structural layout with 12px item spacing
 * - `dark:text-(--clr-textDark)` Uses a modern CSS custom property variable for dark mode text tokens
 * - `capitalize` Utility applied twice to force standard visual title-casing across names
 * - `flex flex-col leading-snug` Stacked data structure with a tight 1.375 line height ratio
 */
function PersonRow({ name, sub }: { name: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 dark:text-(--clr-textDark) capitalize">
      <Avatar name={name} isFullName={true} />
      <div className="flex flex-col leading-snug">
        <span className="text-sm font-medium capitalize">{name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{sub}</span>
      </div>
    </div>
  );
}

export default PersonRow;
