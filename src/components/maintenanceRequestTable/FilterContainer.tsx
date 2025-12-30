import { useState } from "react";
import { ColumnFilterItem } from "./ColumnFilterItem";
import type { CreateJobFormValues } from "@/schemas";
import { columns } from "./columns";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Props = {
  data: CreateJobFormValues[];
};
function FilterContainer({ data }: Props) {
  const [dateValue, setDateValue] = useState("");

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      sorting: [
        {
          id: "createdAt",
          desc: true,
        },
      ],
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const uniqueValues = (key: keyof CreateJobFormValues) =>
    [...new Set(data.map((d) => d[key]))].map((v) => ({
      label: String(v),
      value: String(v),
    }));

  return (
    <div className="flex w-full gap-4 lg:gap-8 py-1 border border-gray-200 rounded-lg">
      <ColumnFilterItem
        placeholder="All Stores"
        value={table.getColumn("store")?.getFilterValue()}
        onChange={(v) => table.getColumn("store")?.setFilterValue(v)}
        options={uniqueValues("store")}
      />

      <ColumnFilterItem
        placeholder="All Priorities"
        value={table.getColumn("priority")?.getFilterValue()}
        onChange={(v) => table.getColumn("priority")?.setFilterValue(v)}
        options={uniqueValues("priority")}
      />
      {/* // ! todo Hide the placeholder "yyyy/mm/dd" with "date"*/}
      <div className="relative">
        <input
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
