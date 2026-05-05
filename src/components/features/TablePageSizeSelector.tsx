import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import type { Table } from "@tanstack/react-table";

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
        className={cn(
          sharedStyles.formInputDefault,
          sharedStyles.formSelect,
          "hover:cursor-pointer",
        )}
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size} className="p-2 hover:cursor-pointer">
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TablePageSizeSelector;
