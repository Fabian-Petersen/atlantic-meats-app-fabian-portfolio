import type { Table } from "@tanstack/react-table";
import clsx from "clsx";

type Props<T> = {
  table: Table<T>;
  className?: string;
};

function TablePageSizeSelector<T>({ table, className }: Props<T>) {
  return (
    <div className={`${className}`}>
      <select
        title="PageSelect"
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className={clsx(
          "w-full h-11 text-xs rounded-md border-gray-200 px-2 hover:cursor-pointer",
          "dark:text-(--clr-textDark) text-(--clr-textLight)",
          "border transition-all outline-none",
        )}
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TablePageSizeSelector;
