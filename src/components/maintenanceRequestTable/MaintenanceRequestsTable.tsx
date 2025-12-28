// src/components/MaintenanceRequestsTable.tsx
import { useState } from "react";
import {
  // type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import type { CreateJobFormValues } from "@/schemas";
import { ColumnSelectFilter } from "./ColumnSelectFilter";
import { columns } from "./columns";

type Props = {
  data: CreateJobFormValues[];
};

export function MaintenanceRequestsTable({ data }: Props) {
  const [dateValue, setDateValue] = useState("");
  const navigate = useNavigate();

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
    <div className="flex flex-col gap-2">
      {/* Filters */}
      <div className="flex w-full gap-4 lg:gap-8 py-1 border border-gray-200 rounded-lg">
        <ColumnSelectFilter
          placeholder="All Stores"
          value={table.getColumn("store")?.getFilterValue()}
          onChange={(v) => table.getColumn("store")?.setFilterValue(v)}
          options={uniqueValues("store")}
        />

        <ColumnSelectFilter
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

      {/* Table */}
      <div className="lg:overflow-hidden overflow-x-scroll rounded-lg w-full border border-gray-200 text-md">
        <table className="w-full">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-gray-700"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="text-xs">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  console.log("Navigating to ID:", row.original.id);
                  navigate(`/maintenance-request/${row.original.id}`);
                }}
                className="cursor-pointer hover:bg-primary/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
