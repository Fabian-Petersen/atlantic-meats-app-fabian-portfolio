import { flexRender, type Table } from "@tanstack/react-table";
import EmptyTablePlaceholder from "../features/EmptyTablePlaceholder";

import { useNavigate } from "react-router-dom";
import type { MaintenanceTableRow } from "@/schemas";
import useGlobalContext from "@/context/useGlobalContext";

type Props = {
  table: Table<MaintenanceTableRow>;
  className?: string;
};

export function MaintenanceRequestsTable({ table, className }: Props) {
  const { setSelectedRowId } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className={`${className}dark:bg-[#1d2739] dark:text-gray-200`}>
      {/* Filters */}
      {/* <FilterContainer data={data} /> */}
      {/* Table */}
      <div className="lg:overflow-hidden overflow-x-scroll rounded-lg w-full border border-gray-200 dark:border-gray-700/50 text-xs">
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
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="text-xs dark:bg-bgdark dark:text-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <EmptyTablePlaceholder
                colSpan={table.getAllColumns().length}
                message="No Maintenance requests yet"
              />
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    setSelectedRowId(row.original.id);
                    navigate(`/maintenance-request/${row.original.id}`);
                  }}
                  className="cursor-pointer hover:bg-primary/20 dark:bg-[#1d2739]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
