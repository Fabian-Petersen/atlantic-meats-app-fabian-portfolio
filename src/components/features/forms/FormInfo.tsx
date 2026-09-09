import { Info } from "lucide-react";
import type { ReactNode } from "react";

type Props = { message: ReactNode };

/**
 * Displays a compact informational message alongside a form.
 *
 * The message accepts text or JSX, so parts of it can be formatted when
 * needed. For example:
 *
 * <FormInfo
 *   message={<>Select a <strong>Location</strong> first.</>}
 * />
 */
function FormInfo({ message }: Props) {
  return (
    <div
      role="status"
      className="mx-0 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{message ?? "No information available."}</p>
    </div>
  );
}

export default FormInfo;
