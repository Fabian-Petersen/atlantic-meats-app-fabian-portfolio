import { getUserGroups } from "@/auth/getUserGroups";
import CardContainer from "@/components/dashboard/CardContainer";
import { useAssetJobsHistory } from "@/hooks/useAssetJobsHistory";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useEffect, useMemo, useState } from "react";
import FormHeading from "../../customComponents/FormHeading";
import { TableGeneric } from "@/components/features/TableGeneric";
import { getAssetHistoryColumns } from "@/components/tableColumns/AssetHistoryColumns";
import { useNavigate } from "react-router-dom";

// $ Import Tanstack Table
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import type { AssetHistoryItem } from "@/schemas/assetSchemas";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { SearchInput } from "@/components/features/SearchInput";
import EmptyMobilePlaceholder from "@/components/features/EmptyMobilePlaceholder";
import useGlobalContext from "@/context/useGlobalContext";
// import CostYTDChart from "@/components/dashboard/charts/CostYTDChart";
import { JobRequestsChartSkeleton } from "@/components/dashboard/charts/JobRequestsChartSkeleton";
import ChartHeading from "@/components/dashboard/ChartHeading";
import { Barcode, CalendarCheck, MapPin, Tag } from "lucide-react";
import { PieChartSkeleton } from "@/components/dashboard/charts/PieChartSkeleton";
import CostChart from "@/components/dashboard/charts/CostChart";
import PieChartGeneric from "@/components/dashboard/charts/PieChartGeneric";

const AssetHistoryPage = () => {
  useEffect(() => {
    const loadGroups = async () => {
      await getUserGroups();
    };
    loadGroups();
  }, []);

  const { cards, isPending, isError, data } = useAssetJobsHistory();
  console.log("data:", data);

  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "jobCreated", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // 👈 this controls "10 items per page"
  });

  const [globalFilter, setGlobalFilter] = useState("");

  const { setSelectedRowId } = useGlobalContext();

  // $ Map through the data returned to match the TableRow Data Schema
  const rows: AssetHistoryItem[] = useMemo(
    () =>
      (data?.history ?? []).map((job) => ({
        id: job.id,
        // request_id: job.request_id,
        jobCreated: job.jobCreated,
        description: job.description,
        equipment: job.equipment,
        actioned_by: job.actioned_by,
        total_cost_contractor: job.total_cost_contractor,
        total_cost_sundries: job.total_cost_sundries,
        location: job.location,
        parts: job.parts,
        contractor: job.contractor,
        assetID: job.assetID,
        total_cost_parts: job.total_cost_parts,
        completed_at: job.completed_at,
        jobcardNumber: job.jobcardNumber,
        sundries: job.sundries,
      })),
    [data?.history],
  );

  const columns = getAssetHistoryColumns(setSelectedRowId, navigate);
  // $ This data is passed into the mobile component
  const table = useReactTable({
    data: rows ?? [],
    columns: columns,
    columnResizeMode: "onChange",
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  if (isPending) return <PageLoadingSpinner />;
  if (isError) return <p>There was an error loading the assets</p>;

  if (!data) {
    return <p>There was an error loading the asset history</p>;
  }

  return (
    <main className="w-full h-full md:p-4 p-2">
      <div className={cn(sharedStyles.dashboard)}>
        {/* Heading */}
        <div className="flex flex-col gap-2 w-full col-span-full">
          <FormHeading
            heading={`${data.history[0].equipment}`}
            className={cn(sharedStyles.headingTable)}
          />
          <div className="flex gap-6 text-sm dark:text-gray-400 text-(--clr-textLight) capitalize">
            <div className="flex gap-2 items-center">
              <MapPin className="size-4" />
              <span>{data.history[0].location}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Tag className="size-4" />
              <span>equipment</span>
            </div>
            <div className="flex gap-2 items-center">
              <Barcode className="size-4" />
              <span>{data.history[0].assetID}</span>
            </div>
            <div className="flex gap-2 items-center">
              <CalendarCheck className="size-4" />
              <span>Latest Repair: {data.last_completed_job}</span>
            </div>
          </div>
        </div>
        {/* Cards */}
        <section className={cn(sharedStyles.dashboardCardsParent)}>
          <CardContainer cards={cards} isPending={isPending} />
        </section>

        {/* Cost YTD Chart */}
        <div
          className={cn(
            sharedStyles.chartParent,
            "xl:col-span-3 min-h-0 flex flex-col gap-4",
            "text-gray-600 dark:text-gray-100 relative",
          )}
        >
          {isPending ? (
            <JobRequestsChartSkeleton />
          ) : (
            <>
              <ChartHeading
                title="Maintenance Cost"
                className={cn(
                  sharedStyles.chartHeading,
                  "absolute left-[1.5%]",
                )}
              />
              <div className="flex-1 min-h-0 py-4">
                <CostChart data={data.total_cost_by_month} />
              </div>
            </>
          )}
        </div>

        {/* Pie Chart */}
        <div
          className={cn(
            sharedStyles.chartParent,
            "xl:col-span-1",
            "dark:text-(--clr-textDark) text-(--clr-textLight)",
          )}
        >
          {isPending ? (
            <PieChartSkeleton />
          ) : (
            <>
              <ChartHeading
                title="Reliability"
                className={cn(sharedStyles.chartHeading)}
              />
              <PieChartGeneric
                reliability={data.reliability}
                innerRadius={80}
                outerRadius={110}
              />
            </>
          )}
        </div>
        <section className={cn(sharedStyles.chartTable)}>
          <ChartHeading
            title="Job History"
            className={cn(sharedStyles.chartHeading)}
          />
          <TableGeneric
            data={data.history}
            columns={columns}
            rowPath="/jobs"
            pageSize={10}
            addPagination={true}
            addPageSelector={true}
            tableHeading=""
          />

          {/* // $ Mobile View */}
          <div className="grid lg:hidden gap-2 w-full p-2">
            <SearchInput
              value={globalFilter}
              onChange={setGlobalFilter}
              placeholder="Search Assets"
            />{" "}
            {data.history.length === 0 ? (
              <EmptyMobilePlaceholder message="No Assets available yet" />
            ) : table.getRowModel().rows.length === 0 ? (
              <EmptyMobilePlaceholder
                message={`No results for "${globalFilter}"`}
              />
            ) : (
              <div className="grid gap-2">
                <FormHeading
                  className="mx-auto dark:text-gray-100"
                  heading="Assets Register"
                />
                {/* <MobileAssetsOverviewTable
              className="flex lg:hidden"
              data={table.getRowModel().rows}
            /> */}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AssetHistoryPage;
