/**
 * A styled wrapper component for displaying descriptive text, callouts, or notes.
 *
 * Provides a muted container background with optimized typography line height
 * to ensure long-form paragraph content remains legible. Fully adaptive
 * for light and dark modes with subtle contrast borders.
 *
 * @component
 * @example
 * ```tsx
 * <DescriptionBox>
 *   This project contains sensitive configuration files. Do not share credentials.
 * </DescriptionBox>
 * ```
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The descriptive text, paragraphs, or inner layout elements.
 *
 * @style Dependencies:
 * - `bg-gray-50` / `dark:bg-gray-800/60` Soft background fill for distinct visual nesting
 * - `border` / `rounded-md` Clean structure with standard 6px corner rounding
 * - `px-3 py-2.5` Tailored cell padding for balanced whitespace
 * - `leading-relaxed` Line height set to 1.625 for enhanced text readability
 * - `text-gray-800` / `dark:text-gray-200` High-contrast body text optimization
 */

function DescriptionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
      {children}
    </div>
  );
}

export default DescriptionBox;
