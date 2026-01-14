// import { useState } from "react";
import { ColumnFilterItem } from "./ColumnFilterItem";
import type { AssetFormValues } from "@/schemas";
import { type Table } from "@tanstack/react-table";
import AddNewItemButton from "../features/AddNewItemButton";

type Props = {
  table: Table<AssetFormValues>;
};
function FilterContainer({ table }: Props) {
  // const [dateValue, setDateValue] = useState("");

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
    <div className="flex gap-4 justify-between w-full md:gap-2 h-auto">
      <div className="flex gap-2 shadow-sm  py-1 p-2 rounded-md">
        <div className="py-2">
          <label className="text-sm md:text-md text-gray-500">Equipment</label>
          <ColumnFilterItem
            placeholder="All"
            value={
              (table.getColumn("equipment")?.getFilterValue() as string) ?? ""
            }
            onChange={(v) => table.getColumn("equipment")?.setFilterValue(v)}
            options={uniqueValues("equipment")}
          />
        </div>
        <div className="py-2">
          <label className="text-sm md:text-md text-gray-500">Location</label>
          <ColumnFilterItem
            placeholder="All"
            value={
              (table.getColumn("location")?.getFilterValue() as string) ?? ""
            }
            onChange={(v) => table.getColumn("location")?.setFilterValue(v)}
            options={uniqueValues("location")}
          />
        </div>
      </div>
      <div className="py-2 hidden md:inline-block">
        <label className="text-sm md:text-md text-transparent">
          Create New Asset
        </label>
        <AddNewItemButton title="Create Asset" className="w-full" />
      </div>
    </div>
  );
}

export default FilterContainer;

{
  /* <div className="w-full flex-col py-2">
        <label className="text-sm md:text-md text-gray-500">Date Created</label>
        <input
          aria-label="date filter"
          type="date"
          value={dateValue}
          className="rounded-lg px-3 py-2 text-sm w-full focus:outline-none hover:cursor-pointer dark:bg-[#1d2739] dark:text-gray-200 border border-gray-200"
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
      </div> */
}
