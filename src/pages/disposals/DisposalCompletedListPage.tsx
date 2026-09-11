// Completed disposal requests and their recorded completion details.

import FormHeading from "../../../customComponents/FormHeading";
import { useDownloadPdf, useGetAll } from "@/utils/api";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import MobileDisposalsCompletedList from "@/components/mobile/disposals/MobileDisposalsCompletedList";

import { useNavigate } from "react-router-dom";

// $ Import Tanstack Table
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";

import useGlobalContext from "@/context/useGlobalContext";
import { useMemo, useState } from "react";
import type { DisposalWorkflowResponse } from "@/schemas/disposalsSchemas";
import type { DocumentPresignedUrlResponse } from "@/schemas";
// import { Error } from "@/components/features/Error";
import { TableGeneric } from "@/components/features/tables/TableGeneric";
import { SearchInput } from "@/components/features/SearchInput";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { getDisposalCompletedColumns } from "@/components/tableColumns/DisposalCompletedColumns";
import type { DisposalCompletedTableRow } from "@/components/tableColumns/DisposalCompletedColumns";
import TablePaginationControls from "@/components/features/tables/TablePaginationControls";

const DisposalCompletedListPage = () => {
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                    DATA                                    */
  /* -------------------------------------------------------------------------- */
  const { data, isPending, isError } = useGetAll<DisposalWorkflowResponse[]>({
    resourcePath: "api/disposals/requests",
    queryKey: ["disposals", "completed-list"],
    params: {
      status: "disposed",
    },
  });

  // console.log("Completed Disposals Data:", data);

  const rows = useMemo<DisposalCompletedTableRow[]>(
    () =>
      (data ?? []).flatMap((disposal) =>
        disposal.status === "disposed" && disposal.disposed
          ? [{ ...disposal, ...disposal.disposed }]
          : [],
      ),
    [data],
  );

  /* -------------------------------------------------------------------------- */
  /*                                   SORTING                                  */
  /* -------------------------------------------------------------------------- */
  const [sorting, setSorting] = useState<SortingState>([
    { id: "disposedDate", desc: true },
  ]);

  /* -------------------------------------------------------------------------- */
  /*                                   FILTERING                                */
  /* -------------------------------------------------------------------------- */

  const [globalFilter, setGlobalFilter] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // 👈 this controls "10 items per page"
  });

  const { setSelectedRowId } = useGlobalContext();

  /* -------------------------------------------------------------------------- */
  /*                                   COLUMNS                                  */
  /* -------------------------------------------------------------------------- */

  const { mutateAsync: downloadItem } =
    useDownloadPdf<DocumentPresignedUrlResponse>({
      resourcePath: "api/disposals",
      path: "disposal-document",
      getDownloadUrl: (data) => data.document_url,
    });

  const columns = useMemo(
    () => getDisposalCompletedColumns(setSelectedRowId, navigate, downloadItem),
    [setSelectedRowId, navigate, downloadItem],
  );

  /* -------------------------------------------------------------------------- */
  /*                                    TABLE                                   */
  /* -------------------------------------------------------------------------- */

  // $ This data is passed into the mobile component
  const table = useReactTable({
    data: rows,
    columns,
    columnResizeMode: "onChange",
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* -------------------------------------------------------------------------- */
  /*                                  LOADING STATE                             */
  /* -------------------------------------------------------------------------- */

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <p>There was an error loading the completed disposals</p>;
  if (!data) {
    return <p>There was an error loading the completed disposals</p>;
  }

  return (
    <div className="flex flex-col w-full md:p-4 h-auto gap-2">
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <TableGeneric
          data={rows}
          columns={columns}
          rowPath="disposals"
          initialSorting={[{ id: "disposedDate", desc: true }]}
          searchPlaceholderText="Search Disposals"
          emptyTablePlaceholderText="No completed disposals available yet"
          addButton={true}
          addFilter={true}
          addButtonPath="/disposals/create-new-disposal"
          pageSize={10}
          addPagination={true}
          addPageSelector={true}
          tableHeading="Disposals - Completed"
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          enableMobile={true}
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Disposals"
        />{" "}
        {rows.length === 0 ? (
          <EmptyMobilePlaceholder message="No completed disposals available yet" />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className={cn(sharedStyles.headingForm, "px-0")}
              heading="Disposals - Completed"
              redirect={true}
              redirectTo="/dashboard"
            />
            <MobileDisposalsCompletedList
              className="flex lg:hidden"
              data={table.getRowModel().rows}
            />
            <TablePaginationControls table={table} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DisposalCompletedListPage;
