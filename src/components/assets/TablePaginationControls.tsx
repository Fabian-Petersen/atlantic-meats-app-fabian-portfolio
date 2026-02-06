import type { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
  className?: string;
};

function TablePaginationControls<T>({ table, className }: Props<T>) {
  const { pageIndex } = table.getState().pagination;
  const isLastPage = !table.getCanNextPage();

  return (
    <div className={`flex items-center gap-2 text-xs p-2 ${className ?? ""}`}>
      {table.getCanPreviousPage() && (
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`${pageIndex === 0 ? "text-gray-500" : "hover:cursor-pointer"}`}
        >
          Previous
        </button>
      )}

      <span>
        Page {pageIndex + 1} of {table.getPageCount()}
      </span>

      <button
        type="button"
        onClick={() => {
          table.nextPage();
        }}
        disabled={isLastPage}
        className={`${isLastPage ? "text-gray-500" : "hover:cursor-pointer"}`}
      >
        Next
      </button>
    </div>
  );
}

export default TablePaginationControls;
