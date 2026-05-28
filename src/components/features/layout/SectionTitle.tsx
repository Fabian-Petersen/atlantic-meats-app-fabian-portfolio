/**
 * A reusable typography component for rendering section headers or category labels.
 *
 * Typically used in sidebars, menus, or form groups to organize content visually.
 * It applies a highly scannable, small, uppercase, and tracked layout style.
 * Fully supports light and dark mode text colors via Tailwind CSS.
 *
 * @component
 * @example
 * ```tsx
 * <SectionTitle>User Settings</SectionTitle>
 * ```
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The text string or elements to render inside the title.
 *
 * @style Dependencies:
 * - `text-[10px]` Custom tiny font size
 * - `uppercase` All caps transformation
 * - `tracking-widest` High letter spacing
 * - `font-medium` Medium font weight
 * - `text-gray-400` / `dark:text-gray-500` Theme-aware text contrast
 * - `mb-3` Margin bottom spacing
 */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-gray-500 mb-3">
      {children}
    </p>
  );
}

export default SectionTitle;
