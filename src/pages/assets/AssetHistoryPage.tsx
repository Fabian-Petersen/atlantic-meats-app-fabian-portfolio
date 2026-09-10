import { useMemo, useState, type ComponentProps } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Barcode,
  CalendarCheck,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  Tag,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

import CardContainer from "@/components/dashboard/CardContainer";
import ChartHeading from "@/components/dashboard/ChartHeading";
import CostChart from "@/components/dashboard/charts/CostChart";
import { JobRequestsChartSkeleton } from "@/components/dashboard/charts/JobRequestsChartSkeleton";
import PieChartGeneric from "@/components/dashboard/charts/PieChartGeneric";
import { PieChartSkeleton } from "@/components/dashboard/charts/PieChartSkeleton";
import { EmptyStateContent } from "@/components/features/EmptyStateContent";
import { TableGeneric } from "@/components/features/tables/TableGeneric";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAssetHistoryColumns } from "@/components/tableColumns/AssetHistoryColumns";
import useGlobalContext from "@/context/useGlobalContext";
import { useAssetJobsHistory } from "@/hooks/useAssetJobsHistory";
import { cn } from "@/lib/utils";
import type { AssetHistoryItem } from "@/schemas/assetSchemas";
import { sharedStyles } from "@/styles/shared";
import { formatDateTime } from "@/utils/formatDateTime";
import BackButton from "@/components/features/BackButton";

type Cards = ComponentProps<typeof CardContainer>["cards"];

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

function totalJobCost(job: AssetHistoryItem) {
  return (
    (job.total_cost_contractor ?? 0) +
    (job.total_cost_parts ?? 0) +
    (job.total_cost_sundries ?? 0)
  );
}

function AssetMeta({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-gray-200/80 bg-white/75 px-3 py-2.5 dark:border-gray-700/70 dark:bg-gray-900/35">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-400/15 text-amber-600 dark:text-amber-400">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p
          className={cn(
            "truncate text-xs font-medium text-gray-700 dark:text-gray-200",
            mono && "font-mono normal-case",
          )}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ChartEmptyState({
  icon: Icon,
  message,
}: {
  icon: LucideIcon;
  message: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-gray-400 dark:text-gray-500">
      <span className="flex size-11 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="max-w-56 text-xs leading-5">{message}</p>
    </div>
  );
}

function AssetHistorySkeleton({ cards }: { cards: Cards }) {
  return (
    <main className="flex min-h-full w-full flex-col gap-4 p-2 md:p-4">
      <div
        className={cn(sharedStyles.dashboard)}
        aria-label="Loading asset history"
      >
        <section className="col-span-full space-y-4 rounded-xl border border-gray-200/70 bg-white p-4 dark:border-gray-700/60 dark:bg-(--bg-secondary_dark) md:p-6">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-9 w-64 max-w-full rounded" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-14 rounded-lg" />
            ))}
          </div>
        </section>
        <section className={cn(sharedStyles.dashboardCardsParent)}>
          <CardContainer cards={cards} isPending />
        </section>
        <div className={cn(sharedStyles.chartParent, "xl:col-span-3")}>
          <JobRequestsChartSkeleton />
        </div>
        <div className={cn(sharedStyles.chartParent, "xl:col-span-1")}>
          <PieChartSkeleton />
        </div>
        <Skeleton className="col-span-full h-72 rounded-lg" />
      </div>
    </main>
  );
}

function MobileHistoryCard({
  job,
  onOpen,
}: {
  job: AssetHistoryItem;
  onOpen: () => void;
}) {
  const completedDate = formatDateTime(job.completed_at ?? job.jobCreated);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-amber-400/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-gray-700/70 dark:bg-(--bg-secondary_dark)"
      aria-label={`View job ${job.jobcardNumber ?? job.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
            {job.jobcardNumber ?? "Maintenance job"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            {job.description ?? "No job description recorded"}
          </p>
        </div>
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-gray-400" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs dark:border-gray-700/60">
        <span className="flex min-w-0 items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Clock3 className="size-3.5 shrink-0" />
          <span className="truncate">
            {completedDate ?? "Date unavailable"}
          </span>
        </span>
        <span className="flex min-w-0 items-center justify-end gap-1.5 text-gray-500 dark:text-gray-400">
          <UserRound className="size-3.5 shrink-0" />
          <span className="truncate">{job.actioned_by ?? "Unassigned"}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5 capitalize text-gray-500 dark:text-gray-400">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{job.location}</span>
        </span>
        <span className="text-right font-semibold text-gray-700 dark:text-gray-200">
          {currencyFormatter.format(totalJobCost(job))}
        </span>
      </div>
    </button>
  );
}

const AssetHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedRowId } = useGlobalContext();
  const { cards, isPending, hasHistory, isError, data, retry } =
    useAssetJobsHistory(id);
  const [mobileFilter, setMobileFilter] = useState("");

  const columns = getAssetHistoryColumns(navigate, setSelectedRowId);

  const latestCostYear = useMemo(() => {
    const years = Object.keys(data?.total_cost_by_month ?? {}).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );

    return years[years.length - 1];
  }, [data?.total_cost_by_month]);

  const filteredHistory = useMemo(() => {
    const query = mobileFilter.trim().toLowerCase();
    if (!query) return data?.history ?? [];

    return (data?.history ?? []).filter((job) =>
      [
        job.jobcardNumber,
        job.description,
        job.location,
        job.equipment,
        job.actioned_by,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [data?.history, mobileFilter]);

  if (!id) {
    return (
      <main className="flex min-h-full items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-3 size-9 text-red-500" />
          <h1 className="text-lg font-semibold">Asset not specified</h1>
          <p className="mt-1 text-sm text-gray-500">
            Return to the asset register and select an asset to view.
          </p>
          <Button className="mt-4" onClick={() => navigate("/assets/list")}>
            <ArrowLeft /> Back to assets
          </Button>
        </div>
      </main>
    );
  }

  console.log("history-data:", data?.history ?? []);
  if (isPending) return <AssetHistorySkeleton cards={cards} />;

  if (isError || !data) {
    return (
      <main className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-900/60 dark:bg-(--bg-secondary_dark)">
          <AlertCircle className="mx-auto mb-3 size-9 text-red-500" />
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Could not load asset history
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Check your connection and try again. The asset record has not been
            changed.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button
              className="border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              onClick={() => navigate("/assets/list")}
            >
              <ArrowLeft /> Assets
            </Button>
            <Button onClick={retry}>
              <RefreshCw /> Try again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // const latestHistory = data.history[0];
  const hasCostData = Object.values(data.total_cost_by_month).some(
    (items) => items.length > 0,
  );
  const hasReliabilityData = data.reliability.some(
    (metric) => metric.value !== null,
  );

  const openJob = (jobId: string) => {
    setSelectedRowId(jobId);
    navigate(`/jobs/${jobId}/complete`);
  };

  return (
    <main className="flex min-h-full w-full flex-col gap-4 p-2 md:p-4">
      <div className={cn(sharedStyles.dashboard)}>
        <section className="col-span-full overflow-hidden rounded-xl border border-gray-200/70 bg-linear-to-br from-white via-white to-amber-50/70 shadow-sm dark:border-gray-700/60 dark:from-(--bg-secondary_dark) dark:via-(--bg-secondary_dark) dark:to-amber-950/15">
          <div className="p-4 md:p-6">
            <BackButton
              to="/assets/list"
              label="Asset Register"
              iconStyles="size-4"
              parentStyles="pb-4"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
                  Maintenance overview
                </p>
                <h1 className="mt-1 text-2xl font-semibold capitalize text-gray-900 dark:text-gray-50 md:text-4xl">
                  {data?.equipment ?? "Asset history"}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Performance, reliability, costs, and completed maintenance.
                </p>
              </div>
              <span className="w-fit rounded-full bg-amber-400/15 px-3 py-1.5 text-md font-semibold text-amber-700 dark:text-amber-300 capitalize">
                {data.history.length}{" "}
                {data.history.length === 1 ? "job" : "jobs"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4 capitalize">
              <AssetMeta
                icon={MapPin}
                label="Location"
                value={data?.location ?? "Location unavailable"}
              />
              <AssetMeta
                icon={Tag}
                label="Equipment"
                value={data?.equipment ?? "Equipment details unavailable"}
              />
              <AssetMeta
                icon={Barcode}
                label="Asset ID"
                value={
                  data?.assetID?.trim().toLowerCase() === "nan"
                    ? "No Barcode"
                    : data?.assetID?.trim() || "No Barcode"
                }
                mono={Boolean(
                  data?.assetID?.trim() &&
                  data.assetID.trim().toLowerCase() !== "nan",
                )}
              />
              <AssetMeta
                icon={CalendarCheck}
                label="Latest repair"
                value={
                  formatDateTime(data.last_completed_job) ?? "None recorded"
                }
              />
            </div>
          </div>
        </section>

        <section
          className={cn(sharedStyles.dashboardCardsParent)}
          aria-label="Maintenance metrics"
        >
          <CardContainer cards={cards} />
        </section>

        <section
          className={cn(
            sharedStyles.chartParent,
            "relative flex min-h-72 flex-col gap-3 xl:col-span-3",
            "text-gray-600 dark:text-gray-100",
          )}
        >
          <div className="flex items-center justify-between">
            <ChartHeading
              title="Maintenance Cost"
              className={cn(sharedStyles.chartHeading)}
            />
            {latestCostYear && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[0.65rem] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {latestCostYear}
              </span>
            )}
          </div>
          {hasCostData ? (
            <div className="min-h-0 flex-1">
              <CostChart
                data={data.total_cost_by_month}
                selectedYear={latestCostYear}
              />
            </div>
          ) : (
            <ChartEmptyState
              icon={BarChart3}
              message="Maintenance costs will appear after a job with recorded costs is completed."
            />
          )}
        </section>

        <section
          className={cn(
            sharedStyles.chartParent,
            "flex min-h-72 flex-col gap-3 xl:col-span-1",
            "text-(--clr-textLight) dark:text-(--clr-textDark)",
          )}
        >
          <ChartHeading
            title="Reliability"
            className={cn(sharedStyles.chartHeading)}
          />
          {hasReliabilityData ? (
            <div className="min-h-0 flex-1">
              <PieChartGeneric
                reliability={data.reliability}
                innerRadius={70}
                outerRadius={98}
              />
            </div>
          ) : (
            <ChartEmptyState
              icon={Wrench}
              message="Reliability metrics are not available for this asset yet."
            />
          )}
        </section>

        <section className={cn(sharedStyles.chartTable, "gap-3")}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <ChartHeading
                title="Job History"
                className={cn(sharedStyles.chartHeading)}
              />
              <p className="mt-1 text-xs text-gray-400">
                Completed maintenance linked to this asset
              </p>
            </div>
            {hasHistory && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {data.history.length} total
              </span>
            )}
          </div>

          {!hasHistory ? (
            <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
              <EmptyStateContent message="No maintenance history recorded" />
            </div>
          ) : (
            <>
              <TableGeneric
                data={data.history}
                columns={columns}
                rowPath="jobs"
                action="complete"
                pageSize={10}
                addPagination
                addPageSelector
                tableHeading=""
                searchPlaceholderText="Search job history"
              />

              <div className="space-y-3 md:hidden">
                <div className="relative h-11">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={mobileFilter}
                    onChange={(event) => setMobileFilter(event.target.value)}
                    placeholder="Search job history"
                    className="h-full w-full rounded-lg border border-gray-200 bg-white pl-9 pr-10 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 dark:border-gray-700 dark:bg-gray-900"
                  />
                  {mobileFilter && (
                    <button
                      type="button"
                      onClick={() => setMobileFilter("")}
                      aria-label="Clear history search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {filteredHistory.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                    <EmptyStateContent
                      message={`No results for “${mobileFilter}”`}
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {filteredHistory.map((job) => (
                      <MobileHistoryCard
                        key={job.id}
                        job={job}
                        onOpen={() => openJob(job.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default AssetHistoryPage;
