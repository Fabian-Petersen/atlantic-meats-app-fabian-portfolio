import { AlertTriangle, LayoutDashboard, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

type PageErrorStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
  onBack: () => void;
  isRetrying?: boolean;
};

export function PageErrorState({
  title,
  message,
  onRetry,
  onBack,
  isRetrying = false,
}: PageErrorStateProps) {
  return (
    <main className="flex min-h-[calc(100dvh-var(--sm-navbarHeight))] w-full items-center justify-center p-4 md:min-h-[calc(100dvh-var(--lg-navbarHeight))]">
      <section
        className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm dark:border-(--clr-borderDark) dark:bg-(--bg-primary_dark)"
        role="alert"
        aria-live="polite"
      >
        <div className="mx-auto mb-4 flex size-18 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
          <AlertTriangle className="size-12 text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {message}
        </p>

        <div
          className={cn(
            sharedStyles.btnParent,
            "mx-auto mt-6 w-full max-w-sm gap-3 md:w-full md:max-w-sm",
          )}
        >
          <button
            type="button"
            onClick={onBack}
            className={cn(
              sharedStyles.btn,
              sharedStyles.btnCancel,
              "flex items-center justify-center gap-2",
            )}
          >
            <LayoutDashboard />
            Dashboard
          </button>
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className={cn(
              sharedStyles.btn,
              sharedStyles.btnSubmit,
              "flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            <RefreshCw className={isRetrying ? "animate-spin" : undefined} />
            {isRetrying ? "Retrying..." : "Try again"}
          </button>
        </div>
      </section>
    </main>
  );
}
