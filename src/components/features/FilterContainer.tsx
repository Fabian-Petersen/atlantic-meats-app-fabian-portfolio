import { cn } from "@/lib/utils";
import { ColumnFilterItem } from "./ColumnFilterItem";
import { type Table } from "@tanstack/react-table";

type Props<T extends Record<string, unknown>> = {
  table: Table<T>;
  className?: string;
};

function FilterContainer<T extends Record<string, unknown>>({
  table,
  className = "",
}: Props<T>) {
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.enableColumnFilter);

  const uniqueValues = (columnId: string) => {
    const rows = table.getCoreRowModel().rows;

    const values = rows
      .map((row) => row.original[columnId as keyof T])
      .filter((v) => typeof v === "string") as string[];

    return Array.from(new Set(values))
      .sort((a, b) => a.localeCompare(b)) // Sort the options in alphabetical order
      .map((v) => ({
        label: v,
        value: v,
      }));
  };

  if (!filterableColumns.length) return null;

  return (
    <div className={cn(className, "h-full")}>
      {filterableColumns.map((column) => (
        <div key={column.id} className="capitalize h-full">
          <ColumnFilterItem
            placeholder={column.columnDef.header as string}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(v) => column.setFilterValue(v)}
            options={uniqueValues(column.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default FilterContainer;
