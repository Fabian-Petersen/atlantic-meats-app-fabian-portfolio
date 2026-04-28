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
import { MobileJobsPendingContainer } from "@/components/mobile/MobileJobsPendingContainer";
import useGlobalContext from "@/context/useGlobalContext";
import { useState } from "react";
import { Error } from "@/components/features/Error";
import type { JobAPIResponse } from "@/schemas";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { getJobPendingColumns } from "@/components/tableColumns/PendingColumns";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import { SearchInput } from "@/components/features/SearchInput";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const JobsPendingListPage = () => {
  const { data, isError, isPending } = useGetAll<JobAPIResponse[]>({
    resourcePath: "jobs/requests",
    queryKey: ["jobs", "pending"],
    params: {
      status: "pending",
    },
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "jobCreated", desc: true },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");

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
        <FormHeading
          className={cn(sharedStyles.headingTable)}
          heading="Pending Requests"
        />
        <GenericTable
          data={data}
          columns={columns}
          rowPath="jobs"
          addButton={true}
          addButtonPath="/jobs/create-job"
          action="pending-approval"
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Requests"
        />
        {data.length === 0 ? (
          <EmptyMobilePlaceholder message="No Maintenance requests yet" />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className="mx-auto dark:text-gray-100"
              heading="Pending Requests"
            />
            <MobileJobsPendingContainer
              className="flex md:hidden"
              data={table.getRowModel().rows}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPendingListPage;
