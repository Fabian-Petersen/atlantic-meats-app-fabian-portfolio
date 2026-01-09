import { useState } from "react";
import { ColumnFilterItem } from "./ColumnFilterItem";
import type { AssetFormValues } from "@/schemas";
import { type Table } from "@tanstack/react-table";

type Props = {
  table: Table<AssetFormValues>;
};
function FilterContainer({ table }: Props) {
  const [dateValue, setDateValue] = useState("");

  const uniqueValues = (key: keyof AssetFormValues) => {
    const rows = table.getCoreRowModel().rows;

    return Array.from(
      new Set(
        rows
          .map((row) => row.original[key])
          .filter((v): v is string => typeof v === "string")
      )
    ).map((v) => ({
      label: v,
      value: v,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 lg:gap-8 py-1 md:border md:border-gray-200 md:rounded-lg">
      <ColumnFilterItem
        placeholder="All Locations"
        value={(table.getColumn("location")?.getFilterValue() as string) ?? ""}
        onChange={(v) => table.getColumn("location")?.setFilterValue(v)}
        options={uniqueValues("location")}
      />

      <ColumnFilterItem
        placeholder="All Equipment"
        value={
          (table.getColumn("description")?.getFilterValue() as string) ?? ""
        }
        onChange={(v) => table.getColumn("description")?.setFilterValue(v)}
        options={uniqueValues("description")}
      />
      {/* // ! todo Hide the placeholder "yyyy/mm/dd" with "date"*/}
      <div className="relative">
        <input
          aria-label="date filter"
          type="date"
          value={dateValue}
          className="px-3 py-2 text-sm w-fit hover:cursor-pointer text-transparent"
          onChange={(e) => {
            setDateValue(e.target.value);
            table.getColumn("createdAt")?.setFilterValue(e.target.value);
          }}
        />

        {!dateValue && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            Date
          </span>
        )}
      </div>
    </div>
  );
}

export default FilterContainer;
