// $ Custom Table component that can render an Asset or Jobs Table
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useGlobalContext from "@/context/useGlobalContext";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnResizeMode,
  type PaginationState,
} from "@tanstack/react-table";

import FormHeading from "@/../customComponents/FormHeading";
import AddNewItemButton from "../features/AddNewItemButton";
import { SearchInput } from "../features/SearchInput";
import EmptyTablePlaceholder from "../features/EmptyTablePlaceholder";
import TablePaginationControls from "../features/TablePaginationControls";
import TablePageSizeSelector from "../features/TablePageSizeSelector";

type Props<T extends { id: string }> = {
  data: T[];
  columns: ColumnDef<T>[];
  tableHeading?: string;
  className?: string;
  rowPath?: string;
  initialSorting?: SortingState;
  addButton?: boolean;
  addButtonPath?: string;
  rowClassName?: (row: T) => string;
  searchPlaceholderText?: string;
  openDialog?: (v: boolean) => void;
  emptyTablePlaceholderText?: string;
  pageSize?: number;
  addPagination?: boolean;
  addPageSelector?: boolean;
};

export function GenericTable<T extends { id: string }>({
  data,
  tableHeading,
  columns,
  className,
  rowPath,
  initialSorting = [],
  addButton,
  addButtonPath,
  searchPlaceholderText,
  emptyTablePlaceholderText,
  openDialog,
  rowClassName,
  pageSize,
  addPagination,
  addPageSelector,
}: Props<T>) {
  const navigate = useNavigate();
  const { setSelectedRowId, globalFilter, setGlobalFilter } =
    useGlobalContext();

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize ?? 10, // 👈 this controls "10 items per page"
  });

  const location = useLocation();

  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    getPaginationRowModel: getPaginationRowModel(),

    // ----- Resizing ------
    columnResizeMode,
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
  });

  const handleSubmit = () => {
    if (addButtonPath) return navigate(addButtonPath);
    openDialog?.(true);
  };

  return (
    <div className="w-full lg:p-4 min-h-0 hidden lg:block">
      {tableHeading && (
        <FormHeading className="mx-auto" heading={tableHeading} />
      )}
      {location.pathname === "/dashboard" ? undefined : (
        <div className="flex gap-4 items-end w-full">
          <SearchInput
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder={searchPlaceholderText}
          />
          {addPageSelector ? (
            <TablePageSizeSelector table={table} />
          ) : undefined}
          {addButton && (
            <div className="hidden md:inline-block ml-auto">
              <AddNewItemButton
                title="Job"
                className=""
                onClick={handleSubmit}
              />
            </div>
          )}
        </div>
      )}

      <div className={`${className} dark:text-gray-200 py-4`}>
        {/*
         * overflow-x-auto lets the table scroll horizontally when columns
         * are resized wider than the container.
         */}
        <div className="overflow-x-auto rounded-lg w-full border border-gray-200 dark:border-gray-700/50 text-xs">
          {/*
           * table-fixed + explicit column widths (via colgroup) is required
           * so TanStack's pixel-based sizing is respected by the browser.
           */}
          <table className="w-full min-w-full">
            <thead className="bg-[#fcb53b90]  dark:bg-primary">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="relative px-4 py-3 text-left tracking-wider dark:text-white text-cxs select-none"
                      style={{
                        width: `${header.getSize()}px`,
                        minWidth: `${header.column.columnDef.minSize ?? 60}px`,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* ── Resize handle ───────────────────────────────── */}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onClick={(e) => e.stopPropagation()}
                          className={[
                            // Wide enough to grab easily — centred on the border
                            "absolute top-0 right-0 h-full w-4 flex items-center justify-center",
                            "cursor-col-resize touch-none select-none z-10 group",
                          ].join(" ")}
                        >
                          {/* Visual indicator — a thin bar that widens on hover/drag */}
                          <span
                            className={[
                              "block h-2/3 w-[3px] rounded-full transition-all duration-150",
                              header.column.getIsResizing()
                                ? "bg-amber-500 dark:bg-amber-400 w-1 h-full opacity-100"
                                : "bg-gray-300 dark:bg-gray-600 opacity-0 group-hover:opacity-100",
                            ].join(" ")}
                          />
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="dark:text-(--clr-textDark)">
              {data.length === 0 ? (
                <EmptyTablePlaceholder
                  message={emptyTablePlaceholderText}
                  colSpan={table.getAllColumns().length}
                />
              ) : table.getRowModel().rows.length === 0 ? (
                <EmptyTablePlaceholder
                  colSpan={table.getAllColumns().length}
                  message={`No results for "${globalFilter}"`}
                />
              ) : (
                table.getRowModel().rows.map((row) => {
                  const customRowClass = rowClassName
                    ? rowClassName(row.original)
                    : "";
                  return (
                    <tr
                      key={row.id}
                      onClick={() => {
                        setSelectedRowId(row.original.id);
                        navigate(`${rowPath}/${row.original.id}`);
                      }}
                      className={`text-cxs cursor-pointer hover:bg-primary/20 dark:bg-(--bg-primary_dark) ${customRowClass}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {addPagination ? <TablePaginationControls table={table} /> : undefined}
      </div>
    </div>
  );
}
