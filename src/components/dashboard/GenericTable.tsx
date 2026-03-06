// $ Custom Table component that can render an Asset or Jobs Table

import { flexRender } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import EmptyTablePlaceholder from "../features/EmptyTablePlaceholder";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useGlobalContext from "@/context/useGlobalContext";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import FormHeading from "@/../customComponents/FormHeading";
import FilterContainer from "../features/FilterContainer";

type Props<T extends { id: string }> = {
  data: T[];
  columns: ColumnDef<T>[];
  tableHeading?: string;
  className?: string;
  path?: string;
  initialSorting?: SortingState;
};

export function GenericTable<T extends { id: string }>({
  data,
  tableHeading,
  columns,
  className,
  path,
  initialSorting = [],
}: Props<T>) {
  const navigate = useNavigate();
  const { setSelectedRowId } = useGlobalContext();

  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  // const [sorting, setSorting] = useState<SortingState>([
  //   { id: "actionCreated", desc: true }, // primary sort
  // ]);

  const location = useLocation();

  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full md:p-4 min-h-0">
      {/* <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 border-dashed min-h-0"> */}
      {tableHeading && (
        <FormHeading className="mx-auto" heading={tableHeading} />
      )}
      {location.pathname === "/dashboard" ? undefined : (
        <div className="flex gap-4 items-end w-full">
          <FilterContainer table={table} className="" />
        </div>
      )}

      <div className={`${className}dark:bg-[#1d2739] dark:text-gray-200`}>
        <div className="lg:overflow-hidden overflow-x-scroll rounded-lg w-full border border-gray-200 dark:border-gray-700/50 text-xs">
          <table className="w-full">
            <thead className="bg-[#fcb53b90]  dark:bg-bgdark dark:text-fontlight">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left tracking-wider text-gray-700"
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
                      navigate(`/${path}/${row.original.id}`);
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
    </div>
    // </div>
  );
}
