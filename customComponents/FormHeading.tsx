import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type FormHeadingProps = {
  /** The text content to display inside the heading element. */
  heading: string;
  /** Optional standard CSS class names to override or merge with default styles. */
  className?: string;
  /** If true, renders the heading text inside an `<h3>` HTML element. */
  h3?: boolean;
  /** If true, renders the heading text inside an `<h2>` HTML element. Takes precedence over `h3`. */
  h2?: boolean;
  /** If true, displays a back arrow navigation button on mobile screens (`md` breakpoint and below). */
  redirect?: boolean;
  /** The relative path or URL destination string for the back button navigation. */
  redirectTo?: string;
};

/**
 * FormHeading Component
 *
 * A flexible, responsive heading component designed specifically for forms and data tables.
 * It dynamically adjusts its HTML tag size and provides optional mobile-only back-navigation.
 *
 * ### Features
 * - **Dynamic Typography**: Safely renders `<h1>`, `<h2>`, or `<h3>` tags based on boolean props.
 * - **Mobile Navigation**: Conditional back-arrow button hidden automatically on desktop layouts (`md:` breakpoint).
 * - **Style Merging**: Leverages a `cn` utility to seamlessly combine core shared styles with instance-specific overrides.
 * - **Accessible Controls**: Navigation button includes explicit `type="button"` and `aria-label` definitions.
 *
 * ### Example Use Case
 * ```tsx
 * import FormHeading from "@/components/FormHeading";
 *
 * // Basic usage as an H1
 * <FormHeading heading="Create New Account" />
 *
 * // Usage as a sub-heading H2 with a mobile back-button
 * <FormHeading
 *   heading="Profile Settings"
 *   h2
 *   redirect
 *   redirectTo="/dashboard"
 *   className="mt-6"
 * />
 * ```
 */
const FormHeading = ({
  heading,
  className,
  h3,
  h2,
  redirect,
  redirectTo,
}: FormHeadingProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        sharedStyles.heading,
        sharedStyles.headingForm,
        sharedStyles.headingTable,
        className,
      )}
    >
      <div className="flex gap-2 items-center">
        {redirect && (
          <button
            className="block md:hidden"
            aria-label="return button"
            type="button"
            onClick={() => navigate(redirectTo ?? "")}
          >
            <ChevronLeft className="size-6" />
          </button>
        )}
        {h2 ? <h2>{heading}</h2> : h3 ? <h3>{heading}</h3> : <h1>{heading}</h1>}
      </div>
    </div>
  );
};

export default FormHeading;
