// $ This component renders the page for the actions list in a table format.
// $ The list display the items created by a user and all items for the admin

import { useGetAll } from "@/utils/api";
import { useMemo } from "react";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
// import { MobileAssetsOverviewTable } from "@/components/mobile/MolbileAssetsOverviewTable";

import { getActionColumns } from "../components/actions/columns";
// import { getAssetTableMenuItems } from "@/lib/TableMenuItemsActions";
import useGlobalContext from "@/context/useGlobalContext";

import type { ActionAPIResponse } from "@/schemas";
import { ErrorPage } from "@/components/features/Error";
import type { ActionTableRow } from "@/schemas/actionSchemas";
import { GenericTable } from "@/components/dashboard/GenericTable";

const ActionsListPage = () => {
  const ACTIONS_REQUESTS_KEY = ["actionRequests"];
  const { data, isPending, isError, refetch } = useGetAll<ActionAPIResponse[]>(
    "maintenance-actions-list",
    ACTIONS_REQUESTS_KEY,
  );

  const { setShowUpdateAssetDialog, setSelectedRowId, openDeleteDialog } =
    useGlobalContext();

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
        status: action.status,
      })),
    [data],
  );

  const columns = getActionColumns(
    setShowUpdateAssetDialog,
    setSelectedRowId,
    openDeleteDialog,
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
      <GenericTable
        data={rows}
        columns={columns}
        path={"action"}
        tableHeading="Jobs Overview"
      />
      {/* <MobileActionOverviewTable
          className="flex lg:hidden"
          data={table.getRowModel().rows}
        /> */}
    </div>
  );
};

export default ActionsListPage;
