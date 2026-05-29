// $ This component renders the page for the completed jobs in a table format.
// $ The list display the items created by a user and all items for the admin

import { useDownloadPdf, useGetAll } from "@/utils/api";
import { useState } from "react";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
// import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";

// import { getActionColumns } from "../components/actions/columns";
// import { getAssetTableMenuItems } from "@/lib/TableMenuItemsActions";
import useGlobalContext from "@/context/useGlobalContext";

import type { ActionAPIResponse } from "@/schemas";
import { Error } from "@/components/features/Error";
// import type { ActionTableRow } from "@/schemas/actionSchemas";
import { TableGeneric } from "@/components/features/TableGeneric";
import FormHeading from "@/../customComponents/FormHeading";
import { getJobCompletedColumns } from "@/components/tableColumns/CompletedColumns";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { SearchInput } from "@/components/features/SearchInput";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { MobileJobsCompletedParent } from "@/components/mobile/MobileJobsCompletedParent";

const JobsCompletedListPage = () => {
  const { data, isError, isPending } = useGetAll<ActionAPIResponse[]>({
    resourcePath: "api/jobs/completed",
    queryKey: ["jobs", "all", "status: complete"],
    // params: {
    //   group: "technician",
    // },
  });
  const { setSelectedRowId, selectedRowId, setOpenChatSidebar } =
    useGlobalContext();

  const { mutateAsync: downloadItem } = useDownloadPdf({
    resourcePath: `api/jobs/${selectedRowId}/jobcard`,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "actionCreated", desc: true },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // 👈 this controls "10 items per page"
  });

  const columns = getJobCompletedColumns(
    setSelectedRowId,
    downloadItem,
    setOpenChatSidebar,
  );

  // $ This data is passed into the mobile component
  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <Error />;

  if (!data) {
    return <Error />;
  }

  return (
    <div className="flex w-full md:p-4 min-h-0">
      {/* // $ Desktop View */}
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <TableGeneric
          data={data}
          columns={columns}
          rowPath="jobs"
          action="complete"
          tableHeading="Jobs - Completed"
          pageSize={10}
          addPageSelector={true}
          addPagination={true}
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          enableMobile={true}
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Jobs"
        />
        {data.length === 0 ? (
          <EmptyMobilePlaceholder message="No completed jobs yet" />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className={cn(sharedStyles.headingForm, "px-0")}
              heading="Jobs - Completed"
              redirect={true}
              redirectTo="/dashboard"
            />
            <MobileJobsCompletedParent
              className="flex md:hidden"
              data={table.getRowModel().rows}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsCompletedListPage;
