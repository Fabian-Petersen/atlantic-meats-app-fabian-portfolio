import { useState } from "react";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

import JobsChart from "../charts/JobsChart";
import ChartHeading from "../ChartHeading";
import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";

/* -------------------------------------------------------------------------- */
/*                                Hooks & Utils                               */
/* -------------------------------------------------------------------------- */

import { useStoreJobMetrics } from "@/hooks/useStoreJobMetrics";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

import type { StoreJobMetrics } from "@/schemas/dashboardSchema";
import { HeadingSkeleton } from "../charts/HeadingSkeleton";

type DrilldownLevel = "sites" | "months";

type JobStatus = "pending" | "in progress" | "complete" | "cancelled";

type Props = {
  data: StoreJobMetrics;
  isPending: boolean;
  isAdmin: boolean;
  userLocation?: string;
};

/* ========================================================================== */
/*                             MaintenanceJobs                                */
/* ========================================================================== */

function MaintenanceJobs({ data, isPending, isAdmin, userLocation }: Props) {
  /* ------------------------------------------------------------------------ */
  /*                               State                                      */
  /* ------------------------------------------------------------------------ */

  const [selectedYear, setSelectedYear] = useState<string>("");

  const [selectedStore, setSelectedStore] = useState<{
    year: string;
    location: string;
  } | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<JobStatus>("pending");

  /* ------------------------------------------------------------------------ */
  /*                              Initial Chart Data                          */
  /* ------------------------------------------------------------------------ */

  const initialChartData = data?.[selectedStatus] ?? {};

  const initialYears = Object.keys(initialChartData).sort();

  const latestInitialYear = initialYears[initialYears.length - 1] ?? "";

  /* ------------------------------------------------------------------------ */
  /*                              Location                                    */
  /* ------------------------------------------------------------------------ */

  const location = isAdmin
    ? (selectedStore?.location ?? null)
    : (userLocation ?? null);

  /* ------------------------------------------------------------------------ */
  /*                                Year                                      */
  /* ------------------------------------------------------------------------ */

  const year = isAdmin
    ? (selectedStore?.year ?? null)
    : selectedYear || latestInitialYear || null;

  /* ------------------------------------------------------------------------ */
  /*                              API Data                                    */
  /* ------------------------------------------------------------------------ */

  const { data: jobsByStore, isPending: isJobsByStorePending } =
    useStoreJobMetrics(year, location, selectedStatus);

  /* ------------------------------------------------------------------------ */
  /*                              Drilldown Level                             */
  /* ------------------------------------------------------------------------ */

  const drilldownLevel: DrilldownLevel = isAdmin
    ? selectedStore
      ? "months"
      : "sites"
    : "months";

  /* ------------------------------------------------------------------------ */
  /*                              Chart Data                                  */
  /* ------------------------------------------------------------------------ */

  const chartData =
    drilldownLevel === "sites" ? initialChartData : (jobsByStore?.data ?? {});

  /* ------------------------------------------------------------------------ */
  /*                              Loading                                     */
  /* ------------------------------------------------------------------------ */

  const isLoading =
    drilldownLevel === "sites" ? isPending : isJobsByStorePending;

  /* ------------------------------------------------------------------------ */
  /*                              Empty State                                 */
  /* ------------------------------------------------------------------------ */

  /**
   * A response such as:
   *
   * {
   *   "complete": {}
   * }
   *
   * means the request succeeded but there are no jobs.
   *
   * It must NOT be treated as a loading state.
   */
  const hasChartData = Object.keys(chartData).some(
    (yearKey) =>
      Array.isArray(chartData[yearKey]) &&
      chartData[yearKey].some((item) => Number(item.value) > 0),
  );

  /* ------------------------------------------------------------------------ */
  /*                              Year Handling                               */
  /* ------------------------------------------------------------------------ */

  const years = Object.keys(chartData).sort();

  const latestYear = years[years.length - 1] ?? "";

  const resolvedYear =
    drilldownLevel === "sites"
      ? selectedYear || latestYear
      : year || latestYear;

  /* ------------------------------------------------------------------------ */
  /*                              Chart Interaction                           */
  /* ------------------------------------------------------------------------ */

  const handleChartSelect = (chartYear: string, label: string) => {
    if (drilldownLevel === "sites") {
      setSelectedStore({
        year: chartYear,
        location: label,
      });

      return;
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              Status Change                               */
  /* ------------------------------------------------------------------------ */

  const handleStatusChange = (status: JobStatus) => {
    setSelectedStatus(status);

    if (isAdmin) {
      setSelectedStore(null);
    }

    setSelectedYear("");
  };

  /* ------------------------------------------------------------------------ */
  /*                              Empty Message                               */
  /* ------------------------------------------------------------------------ */

  const statusLabel =
    selectedStatus === "in progress"
      ? "In Progress"
      : selectedStatus === "complete"
        ? "Completed"
        : selectedStatus === "cancelled"
          ? "Cancelled"
          : "Pending";

  /* ------------------------------------------------------------------------ */
  /*                                Rendering                                 */
  /* ------------------------------------------------------------------------ */

  return (
    <div
      className={cn(
        sharedStyles.chartParent,
        "xl:col-span-3 min-h-0 flex flex-col gap-4",
        "text-gray-600 dark:text-gray-100",
      )}
    >
      <motion.div
        layout
        transition={{
          layout: {
            duration: 0.3,
            ease: "easeInOut",
          },
        }}
        className="flex flex-col gap-4 h-full"
      >
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-center justify-between">
          {isLoading ? (
            <HeadingSkeleton className="w-48" />
          ) : (
            <ChartHeading
              title={
                drilldownLevel === "months"
                  ? `${location} — ${selectedStatus} Jobs ${resolvedYear}`
                  : "Maintenance Jobs YTD"
              }
              returnAction={drilldownLevel === "months" && isAdmin}
              onClick={() => {
                if (drilldownLevel === "months" && isAdmin) {
                  setSelectedStore(null);
                }
              }}
              className={cn(sharedStyles.chartHeading, "capitalize")}
            />
          )}

          <div className="flex items-center gap-2">
            {/* -------------------------------------------------------------- */}
            {/* Status selector                                                */}
            {/* -------------------------------------------------------------- */}
            {isLoading ? (
              <HeadingSkeleton className="w-16" />
            ) : (
              <select
                value={selectedStatus}
                onChange={(e) =>
                  handleStatusChange(e.target.value as JobStatus)
                }
                aria-label="job status selector"
                className={cn(sharedStyles.chartSelectBtn)}
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="complete">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
            {/* -------------------------------------------------------------- */}
            {/* Year selector                                                  */}
            {/* -------------------------------------------------------------- */}

            {drilldownLevel === "sites" &&
              (isLoading ? (
                <HeadingSkeleton className="w-12" />
              ) : (
                <select
                  value={resolvedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="year selector"
                  className={cn(sharedStyles.chartSelectBtn)}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Chart                                                              */}
        {/* ------------------------------------------------------------------ */}

        <motion.div layout className="flex-1 min-h-0">
          {isLoading ? (
            <JobRequestsChartSkeleton />
          ) : !hasChartData ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No {statusLabel} Jobs yet
                </p>
              </div>
            </div>
          ) : (
            <JobsChart
              data={chartData}
              selectedYear={resolvedYear}
              onSelect={handleChartSelect}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default MaintenanceJobs;
