import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 enabled:cursor-pointer enabled:hover:border-amber-300 enabled:hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:enabled:hover:border-amber-600 dark:enabled:hover:bg-primary/20 dark:focus-visible:ring-offset-slate-900";

type Props<T> = {
  table: Table<T>;
  className?: string;
};

const TablePaginationControls = <T,>({ table, className }: Props<T>) => {
  return (
    <div
      className={cn("mt-4 flex w-full flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-3 dark:border-slate-700/60", className)}
    >
      <div className="order-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={navigationButtonClass}
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Previous
        </button>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={navigationButtonClass}
        >
          Next
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <span className="order-1 inline-flex items-center gap-2 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
        Page <span className="inline-flex min-w-8 items-center justify-center rounded-lg border border-amber-200 bg-primary/15 px-2 py-1.5 font-semibold tabular-nums text-amber-900 dark:border-amber-700/60 dark:bg-primary/20 dark:text-amber-200">{table.getState().pagination.pageIndex + 1}</span> of{" "}
        <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{table.getPageCount()}</span>
      </span>
    </div>
  );
};

export default TablePaginationControls;
