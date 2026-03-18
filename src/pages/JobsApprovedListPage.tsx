// $ This component renders the page for the maintenance requests to be approved in a table format.
// $ The list is from a Get request to the getJobsList.py lambda function.

// import FormHeading from "../../customComponents/FormHeading";
// import { MaintenanceRequestsTable } from "@/components/maintenanceRequestTable/MaintenanceRequestsTable";
// import { useDownloadPdf, useGetAll } from "@/utils/api";
import { useGetAll } from "@/utils/api";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import useGlobalContext from "@/context/useGlobalContext";
import { getJobApprovedColumns } from "@/components/tableColumns/ApprovedColumns";
import { useState } from "react";
import { ErrorPage } from "@/components/features/Error";
import type { JobApprovedAPIResponse } from "@/schemas/jobSchemas";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { MobileJobsApprovedTable } from "@/components/mobile/MobileJobsApprovedTable";
import FormHeading from "@/../customComponents/FormHeading";
import { isTargetDateOverdue } from "@/lib/isTargetDateOverdue";

const JobsApprovedListPage = () => {
  const { data, isError, refetch, isPending } = useGetAll<
    JobApprovedAPIResponse[]
  >("jobs-list-approved", ["maintenanceRequests"]);

  console.log("data:", data);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "jobCreated", desc: false },
  ]);

  // const { mutateAsync: downloadItem } = useDownloadPdf({
  //   resourcePath: "maintenance-jobcard",
  // });

  const {
    setShowUpdateMaintenanceDialog,
    setShowActionDialog,
    setSelectedRowId,
    openDeleteDialog,
    setOpenChatSidebar,
  } = useGlobalContext();

  // $ Pass the props to the function generating the columns to be used in the table
  const columns = getJobApprovedColumns(
    setShowUpdateMaintenanceDialog,
    setShowActionDialog,
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
    <div className="flex w-full p-4 h-auto">
      <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto">
        <FormHeading
          className="mx-auto dark:text-gray-100"
          heading="Approved Open Jobs"
        />
        <GenericTable
          data={data}
          columns={columns}
          rowPath="/jobs-list-approved"
          className="hidden md:flex flex-col gap-2"
          rowClassName={(row) => {
            return isTargetDateOverdue(row.targetDate)
              ? "text-red-500"
              : "text-gray-700";
          }}
        />
        <MobileJobsApprovedTable
          className="flex md:hidden"
          data={table.getRowModel().rows}
        />
      </div>
    </div>
  );
};

export default JobsApprovedListPage;
