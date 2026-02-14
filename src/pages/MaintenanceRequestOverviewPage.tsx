// $ This component renders the page for the maintenance requests in a table format.
// $ The list is from a Get request to the getMaintenanceRequest.py lambda function.

import FormHeading from "../../customComponents/FormHeading";
import { MaintenanceRequestsTable } from "@/components/maintenanceRequestTable/MaintenanceRequestsTable";
import { useDownloadPdf, useGetAll } from "@/utils/api";
import { useNavigate } from "react-router-dom";

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
import { getMaintenanceColumns } from "@/components/maintenanceRequestTable/columns";
import { useState } from "react";
import { ErrorPage } from "@/components/features/Error";
import type { MaintenanceTableRow } from "@/schemas";
import FilterContainer from "@/components/features/FilterContainer";
import AddNewItemButton from "@/components/features/AddNewItemButton";

const MaintenanceRequestOverviewPage = () => {
  const MAINTENANCE_REQUESTS_KEY = ["allMaintenanceRequests"];
  const { data, isPending, isError, refetch } = useGetAll<MaintenanceTableRow>(
    "maintenance-request",
    MAINTENANCE_REQUESTS_KEY,
  );
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const { mutateAsync: downloadItem } = useDownloadPdf({
    resourcePath: "maintenance-jobcard",
  });

  const {
    setShowUpdateMaintenanceDialog,
    setShowActionDialog,
    setSelectedRowId,
    openDeleteDialog,
  } = useGlobalContext();

  // $ Pass the props to the function generating the columns to be used in the table
  const columns = getMaintenanceColumns(
    setShowUpdateMaintenanceDialog,
    setShowActionDialog,
    setSelectedRowId,
    downloadItem,
    openDeleteDialog,
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

  const handleSubmit = () => {
    navigate("/maintenance-request");
  };

  return (
    <div className="flex w-full p-4 h-auto">
      <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto">
        <FormHeading
          className="mx-auto dark:text-gray-100"
          heading="Maintenance Request List"
        />
        <div className="flex gap-4 items-end w-full">
          <FilterContainer table={table} className="" />
          <div className="py-2 hidden md:inline-block ml-auto">
            <label className="text-sm md:text-md text-transparent">
              Create Job
            </label>
            <AddNewItemButton
              title="Add Job"
              className=""
              onClick={handleSubmit}
            />
          </div>
        </div>
        <MaintenanceRequestsTable
          table={table}
          className="hidden md:flex flex-col gap-2"
        />
        <MobileMaintenanceRequestsTable
          className="flex md:hidden"
          data={table.getRowModel().rows}
        />
      </div>
    </div>
  );
};

export default MaintenanceRequestOverviewPage;
