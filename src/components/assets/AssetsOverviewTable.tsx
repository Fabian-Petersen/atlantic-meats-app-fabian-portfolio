import { flexRender, type Table } from "@tanstack/react-table";

import { useNavigate } from "react-router-dom";
import type { AssetTableRow } from "@/schemas";
import EmptyTablePlaceholder from "../features/EmptyTablePlaceholder";
import TablePaginationControls from "./TablePaginationControls";
import { useAutoPageSize } from "@/customHooks/useAutoPageSize";

type Props = {
  table: Table<AssetTableRow>;
  className?: string;
};

export function AssetsOverviewTable({ table, className }: Props) {
  const navigate = useNavigate();
  // const pageIndex = table.getState().pagination.pageIndex;

  const containerRef = useAutoPageSize(table, {
    rowHeight: 44,
    headerHeight: 48,
    minRows: 5,
  });

  // console.log("table data:", table.getRowModel().rows);

  return (
    <div
      className={`flex flex-col flex-1 min-h-0 gap-4 dark:bg-[#1d2739] dark:text-gray-200 ${className}`}
    >
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto rounded-lg w-full border border-gray-200 dark:border-gray-700/50 text-xs tracking-wider"
      >
        <table className="w-full">
          <thead className="bg-gray-200 dark:bg-bgdark dark:text-fontlight">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="relative px-4 py-3 text-left font-semibold text-gray-700"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {/* //todo: Complete the column resizing */}
                    {/* <div
                      arial-label="column resizer"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`hover:cursor-pointer bg-green-500 z-100 top-100 right-0 w-full border border-black h-full ${
                        header.column.getIsResizing()
                          ? "opacity-100 hover:bg-blue-500"
                          : ""
                      }`}
                    ></div> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="text-xs dark:bg-bgdark dark:text-gray-200">
            {table.getPaginationRowModel().rows.length === 0 ? (
              <EmptyTablePlaceholder
                colSpan={table.getAllColumns().length}
                message="No Assets Available yet"
              />
            ) : (
              table.getPaginationRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    // console.log("Navigating to ID:", row.original.id);
                    navigate(`/asset/${row.original.id}`);
                  }}
                  className="cursor-pointer hover:bg-primary/20 dark:bg-[#1d2739] dark:text-gray-200"
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
      <TablePaginationControls table={table} className="justify-end" />
    </div>
  );
}
