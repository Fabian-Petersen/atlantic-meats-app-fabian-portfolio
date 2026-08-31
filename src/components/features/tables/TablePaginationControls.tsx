import type { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
  className?: string;
};

const TablePaginationControls = <T,>({ table, className }: Props<T>) => {
  return (
    <div
      className={`w-full flex items-center justify-end gap-2 mt-4 ${className ?? ""}`}
    >
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border border-gray-300 rounded hover:cursor-pointer text-xs text-(--clr-textLight) dark:text-(--clr-textDark)"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border border-gray-300 rounded hover:cursor-pointer text-xs text-(--clr-textLight) dark:text-(--clr-textDark)"
        >
          Next
        </button>
      </div>

      <span className="text-xs text-(--clr-textLight) dark:text-(--clr-textDark)">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </span>
    </div>
  );
};

export default TablePaginationControls;
