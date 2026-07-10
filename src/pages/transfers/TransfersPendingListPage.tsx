/**
 * This component renders the table for the asset transfer requests that was created including the
 * approved transfers.
 *
 * ROUTE: /transfers/requests
 *
 * PATH: /api/transfers/requests?status[]="pending" & status[]="approved"
 * The list is from a Get request to the getTransfersList.py lambda function.
 *
 * */

import FormHeading from "../../../customComponents/FormHeading";
import { useGetAll } from "@/utils/api";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
// import { MobileJobsPendingContainer } from "@/components/mobile/MobileJobsPendingContainer";
import useGlobalContext from "@/context/useGlobalContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error } from "@/components/features/Error";
import { type TransferWorkflowResponse } from "@/schemas";
import { TableGeneric } from "@/components/features/TableGeneric";
// import { getJobPendingColumns } from "@/components/tableColumns/PendingColumns";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import { SearchInput } from "@/components/features/SearchInput";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { getTransferRequestsColumns } from "@/components/tableColumns/TransferRequestsColumns";
import { flattenTransfersData } from "@/utils/flattenTranferData";

const TransferPendingListPage = () => {
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                    DATA                                    */
  /* -------------------------------------------------------------------------- */
  const { data, isError, isPending } = useGetAll<TransferWorkflowResponse[]>({
    resourcePath: "api/transfers/requests",
    queryKey: ["transfers", ["pending", "approved"]],
    params: {
      status: ["pending", "approved"],
    },
  });

  /**
   * Convert the rows have the data in the root object and not nested using the util
   * function flattenTransfersData
   */

  const rows = flattenTransfersData(data, ["request", "approved"]);

  /* -------------------------------------------------------------------------- */
  /*                                   SORTING                                  */
  /* -------------------------------------------------------------------------- */

  const [sorting, setSorting] = useState<SortingState>([
    { id: "transferCreated", desc: false },
  ]);

  /* -------------------------------------------------------------------------- */
  /*                                   FILTERING                                */
  /* -------------------------------------------------------------------------- */

  const [globalFilter, setGlobalFilter] = useState("");

  const {
    setShowUpdateMaintenanceDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
  } = useGlobalContext();

  /* -------------------------------------------------------------------------- */
  /*                                   COLUMNS                                  */
  /* -------------------------------------------------------------------------- */

  const columns = getTransferRequestsColumns(
    setShowUpdateMaintenanceDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
    navigate,
  );

  /* -------------------------------------------------------------------------- */
  /*                                    TABLE                                   */
  /* -------------------------------------------------------------------------- */

  // $ This data is passed into the mobile component
  const table = useReactTable({
    data: rows,
    columns: columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  /* -------------------------------------------------------------------------- */
  /*                                  LOADING STATE                             */
  /* -------------------------------------------------------------------------- */

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <Error />;

  return (
    <div className="flex w-full md:p-4 min-h-0">
      {/* // $ Desktop View */}
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <TableGeneric
          data={rows}
          columns={columns}
          rowPath="transfers"
          action={(row) => {
            switch (row.status) {
              case "pending":
                return "pending-approval";
              // case "approved":
              //   return "";
              default:
                return "";
            }
          }}
          tableHeading="Transfers - Pending Requests"
          addPageSelector={true}
          addPagination={true}
          addButton={true}
          addButtonPath="/transfers/create-transfer-request"
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          enableMobile={true}
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Requests"
        />
        {data.length === 0 ? (
          <>
            <FormHeading
              className={cn(sharedStyles.headingForm)}
              heading="Transfers - Pending Requests"
              redirect={true}
              redirectTo="/dashboard"
            />
            <EmptyMobilePlaceholder message="No transfer requests yet" />
          </>
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className={cn(sharedStyles.headingForm, "px-0")}
              heading="Transfers - Pending Requests"
              redirect={true}
              redirectTo="/dashboard"
            />
            {/* <MobileJobsPendingContainer
              className="flex md:hidden"
              data={table.getRowModel().rows}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferPendingListPage;
