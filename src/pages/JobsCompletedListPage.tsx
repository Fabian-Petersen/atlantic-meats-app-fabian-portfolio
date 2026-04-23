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
import { ErrorPage } from "@/components/features/Error";
// import type { ActionTableRow } from "@/schemas/actionSchemas";
import { GenericTable } from "@/components/dashboard/GenericTable";
import FormHeading from "@/../customComponents/FormHeading";
import { getJobActionColumns } from "@/components/tableColumns/ActionColumns";
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
} from "@tanstack/react-table";
import { MobileJobsCompletedParent } from "@/components/mobile/MobileJobsCompletedParent";

const JobsCompletedListPage = () => {
  const { data, isError, refetch, isPending } = useGetAll<ActionAPIResponse[]>({
    resourcePath: "jobs/completed",
    queryKey: ["jobs", "complete"],
    // params: {
    //   group: "technician",
    // },
  });
  const { setSelectedRowId, setOpenChatSidebar } = useGlobalContext();

  const { mutateAsync: downloadItem } = useDownloadPdf({
    resourcePath: "jobs",
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "actionCreated", desc: true },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");

  // $ Map through the data returned to match the TableRow Data Schema
  // const rows: ActionAPIResponse[] = useMemo(
  //   () =>
  //     (data ?? []).map((action) => ({
  //       id: action.id,
  //       actionCreated: action.actionCreated,
  //       actioned_by: action.actioned_by,
  //       location: action.location,
  //       start_time: action.start_time,
  //       end_time: action.end_time,
  //       total_km: action.total_km,
  //       work_order_number: action.work_order_number,
  //       work_completed: action.work_completed,
  //       jobcardNumber: action.jobcardNumber,
  //       requested_by: action.requested_by,
  //       request_id: action.request_id,
  //       status: action.status,
  //     })),
  //   [data],
  // );

  const columns = getJobActionColumns(
    setSelectedRowId,
    downloadItem,
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
  if (isError)
    return (
      <ErrorPage
        title="Failed to load assets"
        message="Please check your connection and try again."
        onRetry={refetch}
      />
    );

  if (!data) {
    return (
      <ErrorPage
        title="There are not assets to display!!"
        message="Create an action to view the details."
      />
    );
  }

  return (
    <div className="flex w-full md:p-4 min-h-0">
      <div className="bg-white dark:bg-(--bg-primary_dark) lg:flex flex-col gap-1 w-full rounded-xl shadow-lg p-4 h-auto hidden">
        <FormHeading
          className={cn(sharedStyles.headingTable)}
          heading="Completed Jobs List"
        />
        <GenericTable
          data={data}
          columns={columns}
          rowPath={"jobs"}
          action="completed"
        />
      </div>
      {/* // $ Mobile View */}
      <div className="grid lg:hidden gap-2 w-full p-2">
        <SearchInput
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search Jobs"
        />
        {data.length === 0 ? (
          <EmptyMobilePlaceholder message="No compleyed jobs yet" />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyMobilePlaceholder
            message={`No results for "${globalFilter}"`}
          />
        ) : (
          <div className="grid gap-2">
            <FormHeading
              className={cn(sharedStyles.headingForm)}
              heading="Jobs Completed"
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
