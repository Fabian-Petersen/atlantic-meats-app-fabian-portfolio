// src/components/MaintenanceRequestsTable.tsx
import {
  // type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import type { AssetFormValues } from "@/schemas";
import { ColumnSelectFilter } from "./ColumnSelectFilter";
import { columns } from "./columns";

type Props = {
  data: AssetFormValues[];
};

export function AssetsOverviewTable({ data }: Props) {
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

  const uniqueValues = (key: keyof AssetFormValues) =>
    [...new Set(data.map((d) => d[key]))].map((v) => ({
      label: String(v),
      value: String(v),
    }));

  return (
    <div className="flex flex-col gap-2">
      {/* Filters */}
      <div className="flex flex-wrap lg:gap-8 py-1 border border-gray-200 rounded-lg">
        <ColumnSelectFilter
          placeholder="All Locations"
          value={table.getColumn("location")?.getFilterValue()}
          onChange={(v) => table.getColumn("location")?.setFilterValue(v)}
          options={uniqueValues("location")}
        />

        <ColumnSelectFilter
          placeholder="All Equipment"
          value={table.getColumn("description")?.getFilterValue()}
          onChange={(v) => table.getColumn("description")?.setFilterValue(v)}
          options={uniqueValues("description")}
        />
        <input
          type="date"
          className="px-3 py-2 text-sm hover:cursor-pointer"
          onChange={(e) =>
            table.getColumn("createdAt")?.setFilterValue(e.target.value)
          }
        />
      </div>

      {/* Table */}
      <div className="lg:overflow-hidden overflow-x-scroll rounded-lg w-full border border-gray-200">
        <table className="w-full text-xs">
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
                  navigate(`/asset/${row.original.id}`);
                }}
                className="cursor-pointer hover:bg-(--clr-primary)/20"
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
