import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import TablePageSizeSelector from "./TablePageSizeSelector";

const navigationButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 enabled:cursor-pointer enabled:hover:border-amber-300 enabled:hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:enabled:hover:border-amber-600 dark:enabled:hover:bg-primary/20 dark:focus-visible:ring-offset-slate-900";

type Props<T> = {
  table: Table<T>;
  className?: string;
  showPageSizeSelector?: boolean;
  compact?: boolean;
};

const TablePaginationControls = <T,>({
  table,
  className,
  showPageSizeSelector = false,
  compact = false,
}: Props<T>) => {
  if (compact) {
    return (
      <div
        className={cn(
          "mt-4 grid w-full grid-cols-4 items-center gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/60",
          className,
        )}
      >
        <button
          type="button"
          aria-label="Previous page"
          title="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={cn(navigationButtonClass, "w-full px-2")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="hidden min-[360px]:inline">Prev</span>
        </button>

        <span className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-amber-200 bg-primary/15 px-2 text-xs font-semibold tabular-nums text-amber-900 dark:border-amber-700/60 dark:bg-primary/20 dark:text-amber-200">
          {table.getState().pagination.pageIndex + 1}
          <span className="mx-1 font-normal text-slate-400 dark:text-slate-500">
            /
          </span>
          {table.getPageCount()}
        </span>

        {showPageSizeSelector && (
          <TablePageSizeSelector
            table={table}
            className="h-10 w-full"
            compact
          />
        )}

        <button
          type="button"
          aria-label="Next page"
          title="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={cn(navigationButtonClass, "w-full px-2")}
        >
          <span className="hidden min-[360px]:inline">Next</span>
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

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

        {showPageSizeSelector && (
          <TablePageSizeSelector table={table} className="h-10" />
        )}

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
