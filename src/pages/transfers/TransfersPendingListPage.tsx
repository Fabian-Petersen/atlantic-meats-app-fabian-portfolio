// $ This component renders the page for the maintenance requests to be approved in a table format.
// $ The list is from a Get request to the getJobsList.py lambda function.

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
import { Error } from "@/components/features/Error";
import type { TransferResponseValues } from "@/schemas";
import { TableGeneric } from "@/components/features/TableGeneric";
// import { getJobPendingColumns } from "@/components/tableColumns/PendingColumns";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import { SearchInput } from "@/components/features/SearchInput";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";
import { getTransferPendingColumns } from "@/components/tableColumns/TransferPendingColumns";

const TransferPendingListPage = () => {
  const { data, isError, isPending } = useGetAll<TransferResponseValues[]>({
    resourcePath: "api/transfers/requests",
    queryKey: ["transfers", "pending"],
    params: {
      status: "pending",
    },
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "transferCreated", desc: false },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");

  const {
    setShowUpdateMaintenanceDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
  } = useGlobalContext();

  // $ Pass the props to the function generating the columns to be used in the table
  const columns = getTransferPendingColumns(
    setShowUpdateMaintenanceDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
  );

  // $ This data is passed into the mobile component
  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <Error />;

  return (
    <div className="flex w-full md:p-4 min-h-0">
      {/* // $ Desktop View */}
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <TableGeneric
          data={data}
          columns={columns}
          rowPath="transfers"
          action="pending-approval"
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
