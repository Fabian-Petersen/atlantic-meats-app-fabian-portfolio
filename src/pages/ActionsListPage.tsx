// $ This component renders the page for the actions list in a table format.
// $ The list display the items created by a user and all items for the admin

import { useDownloadPdf, useGetAll } from "@/utils/api";
import { useMemo } from "react";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
// import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";

// import { getActionColumns } from "../components/actions/columns";
// import { getAssetTableMenuItems } from "@/lib/TableMenuItemsActions";
import useGlobalContext from "@/context/useGlobalContext";

import type { ActionAPIResponse } from "@/schemas";
import { ErrorPage } from "@/components/features/Error";
import type { ActionTableRow } from "@/schemas/actionSchemas";
import { GenericTable } from "@/components/dashboard/GenericTable";
import FormHeading from "@/../customComponents/FormHeading";
import { getJobActionColumns } from "@/components/tableColumns/ActionColumns";

const ActionsListPage = () => {
  const ACTIONS_REQUESTS_KEY = ["actionRequests"];

  const { data, isPending, isError, refetch } = useGetAll<ActionAPIResponse[]>(
    "maintenance-actions-list",
    ACTIONS_REQUESTS_KEY,
  );

  const { mutateAsync: downloadItem } = useDownloadPdf({
    resourcePath: "maintenance-jobcard",
  });

  const { setSelectedRowId, setOpenChatSidebar } = useGlobalContext();

  // $ Map through the data returned to match the TableRow Data Schema
  const rows: ActionTableRow[] = useMemo(
    () =>
      (data ?? []).map((action) => ({
        id: action.id,
        actionCreated: action.actionCreated,
        actioned_by: action.actioned_by,
        location: action.location,
        start_time: action.start_time,
        end_time: action.end_time,
        total_km: action.total_km,
        work_order_number: action.work_order_number,
        work_completed: action.work_completed,
        jobcardNumber: action.jobcardNumber,
        requested_by: action.requested_by,
        request_id: action.request_id,
        status: action.status,
      })),
    [data],
  );

  const columns = getJobActionColumns(
    setSelectedRowId,
    downloadItem,
    setOpenChatSidebar,
  );

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
      <div className="bg-white dark:bg-[#1d2739] flex flex-col gap-4 w-full rounded-xl shadow-lg p-4 h-auto">
        <FormHeading
          className="mx-auto dark:text-gray-100"
          heading="Completed Jobs List"
        />
        <GenericTable data={rows} columns={columns} rowPath={"action"} />
        {/* <MobileActionOverviewTable
          className="flex lg:hidden"
          data={table.getRowModel().rows}
        /> */}
      </div>
    </div>
  );
};

export default ActionsListPage;
