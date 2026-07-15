import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  /** Short, specific title — e.g. "Not yet in transit" */
  heading: string;
  /** Optional supporting copy explaining why, or what happens next */
  message?: string;
  /** Optional lucide icon shown above the heading */
  icon?: LucideIcon;
  /** Optional primary action, e.g. { label: "Mark in transit", onClick } */
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

/**
 * EmptyDataState
 *
 * Lightweight placeholder for a tab/panel whose underlying stage data
 * doesn't exist yet (e.g. a transfer that's approved but not yet
 * dispatched).'
 */
function EmptyDataState({
  heading,
  message,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={cn(
          "max-w-1/2 flex flex-col items-center justify-center text-center gap-2 py-10 px-4 bg-gray-100  rounded-md shadow-md",
          "dark:bg-[#141c2f] text-gray-500 dark:text-gray-400",
          className,
        )}
      >
        {Icon && (
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-1">
            <Icon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        <p className="text-md font-medium text-gray-600 dark:text-gray-300">
          {heading}
        </p>

        {message && (
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">
            {message}
          </p>
        )}

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-2 text-xs px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 transition-colors hover:cursor-pointer"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyDataState;
