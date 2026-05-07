import { sharedStyles } from "@/styles/shared";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

type Props = {
  redirect?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelText: string;
  submitText: string;
  isPending?: boolean;
  className?: string;
};

/**
 * Reusable form action button group for handling submit and cancel actions.
 *
 * Renders two buttons:
 * - A cancel button that triggers an optional `handleCancel` callback.
 * - A submit button that triggers an optional `action` callback and supports a loading state.
 *
 * Features:
 * - Disables the submit button while `isPending` is true.
 * - Displays a spinner in place of the submit text during pending state.
 * - Applies shared styling for consistent layout and appearance across forms.
 *
 * Intended for use in forms where a standard cancel/submit interaction pattern is required.
 *
 * Props:
 * @param cancelText - Label for the cancel button.
 * @param submitText - Label for the submit button.
 * @param handleCancel - Optional callback executed when cancel button is clicked.
 * @param onSubmit  - Optional Callback executed on submit button click.
 * @param isPending - Optional flag to indicate loading state for submission.
 * @param redirect - (Unused) Optional redirect path for future extension.
 * @param className - Optional CSS class for custom styling.
 */

function FormActionButtons({
  cancelText,
  onSubmit,
  submitText,
  onCancel,
  isPending,
  className,
}: Props) {
  return (
    <div className={cn(sharedStyles.btnParent, className)}>
      <Button
        type="button"
        onClick={onCancel}
        variant="cancel"
        size="lg"
        className={cn(sharedStyles.btnCancel, sharedStyles.btn, "capitalize")}
      >
        {cancelText}
      </Button>
      <Button
        disabled={isPending}
        type="submit"
        variant="submit"
        size="lg"
        className={cn(sharedStyles.btnSubmit, sharedStyles.btn, "capitalize")}
        onClick={onSubmit}
      >
        {isPending ? <Spinner className="size-8" /> : submitText}
      </Button>
    </div>
  );
}

export default FormActionButtons;
