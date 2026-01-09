import { flexRender, type Table } from "@tanstack/react-table";

import { useNavigate } from "react-router-dom";
import type { AssetFormValues } from "@/schemas";

type Props = {
  table: Table<AssetFormValues>;
  className?: string;
};

export function AssetsOverviewTable({ table, className }: Props) {
  const navigate = useNavigate();

  // const uniqueValues = (key: keyof AssetFormValues) =>
  //   [...new Set(data.map((d) => d[key]))].map((v) => ({
  //     label: String(v),
  //     value: String(v),
  //   }));

  return (
    <div
      className={`flex flex-col gap-2 dark:bg-[#1d2739] dark:text-gray-200 ${className}`}
    >
      {/* Filters */}
      {/* <FilterContainer data={data} /> */}
      {/* Table */}
      <div className="lg:overflow-hidden overflow-x-scroll rounded-lg w-full border border-gray-200 dark:border-gray-700/50 text-md">
        <table className="w-full">
          <thead className="bg-gray-200 dark:bg-bgdark dark:text-fontlight">
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

          <tbody className="text-xs dark:bg-bgdark dark:text-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  console.log("Navigating to ID:", row.original.id);
                  navigate(`/asset/${row.original.id}`);
                }}
                className="cursor-pointer hover:bg-primary/20 dark:bg-[#1d2739] dark:text-gray-200"
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
