// import { useState } from "react";
import { ColumnFilterItem } from "./ColumnFilterItem";
// import type { AssetFormValues, CreateJobFormValues } from "@/schemas";
import { type Table } from "@tanstack/react-table";
// import AddNewItemButton from "./AddNewItemButton";

type Props<T extends Record<string, unknown>> = {
  table: Table<T>;
  className: string;
};

function FilterContainer<T extends Record<string, unknown>>({
  table,
  className,
  // onClick,
}: Props<T>) {
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.enableColumnFilter);

  const uniqueValues = (columnId: string) => {
    const rows = table.getCoreRowModel().rows;

    const values = rows
      .map((row) => row.original[columnId as keyof T])
      .filter((v) => typeof v === "string") as string[];

    return Array.from(new Set(values)).map((v) => ({
      label: v,
      value: v,
    }));
  };

  if (!filterableColumns.length) return null;

  return (
    <div className={`${className} flex gap-2 shadow-sm py-1 p-2 rounded-md`}>
      {filterableColumns.map((column) => (
        <div key={column.id} className="py-2 flex-1 capitalize">
          <label className="text-xs text-gray-500">
            {column.columnDef.header as string}
          </label>
          <ColumnFilterItem
            placeholder="All"
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
