// $ This component renders the page for the maintenance requests to be approved in a table format.
// $ The list is from a Get request to the getJobsList.py lambda function.

import FormHeading from "../../customComponents/FormHeading";
import { useGetAll } from "@/utils/api";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { MobileMaintenanceRequestsTable } from "@/components/mobile/MobileMaintenanceRequestsTable";
import useGlobalContext from "@/context/useGlobalContext";
import { useState } from "react";
import { ErrorPage } from "@/components/features/Error";
import type { JobAPIResponse } from "@/schemas";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { getJobPendingColumns } from "@/components/tableColumns/PendingColumns";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";

const JobsPendingListPage = () => {
  const { data, isError, refetch, isPending } = useGetAll<JobAPIResponse[]>(
    "jobs-list-pending",
    ["maintenanceRequests"],
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: "jobCreated", desc: true },
  ]);

  const {
    setShowUpdateMaintenanceDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
  } = useGlobalContext();

  // $ Pass the props to the function generating the columns to be used in the table
  const columns = getJobPendingColumns(
    setShowUpdateMaintenanceDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
  );

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError)
    return (
      <ErrorPage
        title="Failed to load maintenance requests"
        message="Please check your connection and try again."
        onRetry={refetch}
      />
    );

  return (
    <div className="flex w-full lg:p-4 h-auto">
      {/* // $ Desktop View */}
      <div className="bg-white dark:bg-[#1d2739] lg:flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <FormHeading
          className="mx-auto dark:text-gray-100"
          heading="Pending Review and Approve"
        />
        <GenericTable
          data={data}
          columns={columns}
          rowPath="/jobs-list-pending"
          addButton={true}
          addButtonPath="/maintenance-request"
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden w-full">
        {table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder message="No Maintenance requests yet" />
        ) : (
          <MobileMaintenanceRequestsTable
            className="flex md:hidden"
            data={table.getRowModel().rows}
          />
        )}
      </div>
    </div>
  );
};

export default JobsPendingListPage;
