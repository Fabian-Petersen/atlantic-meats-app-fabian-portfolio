import type { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};

function TablePageSelector<T>({ table }: Props<T>) {
  return (
    <select
      aria-label="Select Page"
      value={table.getState().pagination.pageSize}
      onChange={(e) => table.setPageSize(Number(e.target.value))}
    >
      {[10, 20, 30].map((size) => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
    </select>
  );
}

export default TablePageSelector;
