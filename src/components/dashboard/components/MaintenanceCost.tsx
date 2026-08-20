import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
import CostChart from "../charts/CostChart";
import ChartHeading from "../ChartHeading";
import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";

/* -------------------------------------------------------------------------- */
/*                                Hooks & Utils                               */
/* -------------------------------------------------------------------------- */
import { useStoreCostByMonth } from "@/hooks/useStoreCostByMonth";
import { useStoreCostByYear } from "@/hooks/useStoreCostByYear";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
import type {
  StoreCostByYear,
  StoreJobsByMonth,
  CostByYear,
} from "@/schemas/dashboardSchema";
import { HeadingSkeleton } from "../charts/HeadingSkeleton";

type DrilldownLevel = "sites" | "months" | "jobs";

type Props = {
  data: StoreCostByYear;
  isPending: boolean;
  isAdmin: boolean;
  userLocation?: string;
};

/**
 * Adapts the level-3 API response (a single month's job list)
 * into the CostByYear shape expected by CostChart.
 */
function toJobsChartData(
  jobsByMonth: StoreJobsByMonth | undefined,
): CostByYear {
  if (!jobsByMonth) return {};

  return {
    [jobsByMonth.month]: jobsByMonth.jobs.map((job) => ({
      name: job.assetID,
      value: job.costs.total,
    })),
  };
}

/**
 * Creates a lookup between the asset ID displayed by CostChart
 * and the action ID required for navigation.
 */
function useJobRequestIdLookup(jobsByMonth: StoreJobsByMonth | undefined) {
  return useMemo(() => {
    const map = new Map<string, string>();

    jobsByMonth?.jobs.forEach((job) => {
      map.set(job.assetID, job.action_id);
    });

    return map;
  }, [jobsByMonth]);
}

function MaintenanceCost({
  data: costByYear,
  isPending,
  isAdmin,
  userLocation,
}: Props) {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState<string>("");

  /**
   * Admin only:
   * Tracks the site selected from the first-level site-cost chart.
   */
  const [selectedStore, setSelectedStore] = useState<{
    year: string;
    location: string;
  } | null>(null);

  /**
   * Tracks the month selected from the monthly cost chart.
   */
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                               Initial Data                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * The backend now returns different first-level data:
   *
   * Admin:
   *   data.costAll     → total cost per site
   *
   * User/Manager:
   *   data.costByStore → monthly cost for their location
   *
   * The parent passes the appropriate response as `data`.
   */
  const initialChartData = costByYear;

  /* -------------------------------------------------------------------------- */
  /*                               API Data Calls                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Admin only:
   *
   * After clicking a site, fetch the monthly cost breakdown
   * for that site/year.
   */
  const { data: costPerStoreByYear, isPending: isCostPerStorePending } =
    useStoreCostByYear(
      isAdmin ? (selectedStore?.year ?? null) : null,
      isAdmin ? (selectedStore?.location ?? null) : null,
    );

  /**
   * Level 3:
   *
   * Admin:
   *   selectedStore + selectedMonth
   *
   * User/Manager:
   *   userLocation + selectedMonth
   */
  const { data: jobsByMonth, isPending: isJobsByMonthPending } =
    useStoreCostByMonth(
      isAdmin ? (selectedStore?.year ?? null) : selectedYear || null,
      isAdmin ? (selectedStore?.location ?? null) : (userLocation ?? null),
      selectedMonth,
    );

  /* -------------------------------------------------------------------------- */
  /*                              Drilldown Level                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Admin:
   *
   * sites → months → jobs
   *
   * User/Manager:
   *
   * months → jobs
   */
  const drilldownLevel: DrilldownLevel = isAdmin
    ? selectedMonth
      ? "jobs"
      : selectedStore
        ? "months"
        : "sites"
    : selectedMonth
      ? "jobs"
      : "months";

  /* -------------------------------------------------------------------------- */
  /*                              Chart Data                                    */
  /* -------------------------------------------------------------------------- */

  const jobsChartData = useMemo(
    () => toJobsChartData(jobsByMonth),
    [jobsByMonth],
  );

  /**
   * Select the correct data for the current drilldown level.
   */
  const chartData =
    drilldownLevel === "sites"
      ? initialChartData
      : drilldownLevel === "months"
        ? isAdmin
          ? (costPerStoreByYear?.data ?? {})
          : initialChartData
        : jobsChartData;

  const isLoading =
    drilldownLevel === "sites"
      ? isPending
      : drilldownLevel === "months"
        ? isAdmin
          ? isCostPerStorePending
          : isPending
        : isJobsByMonthPending;

  /* -------------------------------------------------------------------------- */
  /*                              Year Handling                                 */
  /* -------------------------------------------------------------------------- */

  const years = Object.keys(chartData).sort();
  const latestYear = years[years.length - 1] ?? "";

  /**
   * Admin selects the year at the site level.
   *
   * For users/managers, the year is already represented by the
   * costByStore response.
   */
  const resolvedYear =
    drilldownLevel === "sites" ? selectedYear || latestYear : latestYear;

  const headingYear =
    drilldownLevel === "jobs"
      ? isAdmin
        ? (selectedStore?.year ?? "")
        : selectedYear
      : resolvedYear;

  /* -------------------------------------------------------------------------- */
  /*                              Job Lookup                                    */
  /* -------------------------------------------------------------------------- */

  const jobRequestIdLookup = useJobRequestIdLookup(jobsByMonth);

  /* -------------------------------------------------------------------------- */
  /*                             Chart Interaction                              */
  /* -------------------------------------------------------------------------- */

  /**
   * CostChart returns:
   *
   * Admin:
   *   sites  → location
   *   months → month
   *   jobs   → assetID
   *
   * User/Manager:
   *   months → month
   *   jobs   → assetID
   */
  const handleChartSelect = (year: string, label: string) => {
    if (drilldownLevel === "sites") {
      setSelectedStore({
        year,
        location: label,
      });

      setSelectedMonth(null);
      return;
    }

    if (drilldownLevel === "months") {
      /**
       * Both admin and non-admin users select a month here.
       *
       * For admins the store is already stored in selectedStore.
       * For users/managers the location comes from userLocation.
       */
      setSelectedMonth(label);
      setSelectedYear(year);
      return;
    }

    if (drilldownLevel === "jobs") {
      const actionId = jobRequestIdLookup.get(label);

      if (!actionId) return;

      navigate(`/jobs/${actionId}/complete`);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Rendering                                   */
  /* -------------------------------------------------------------------------- */

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
                drilldownLevel === "jobs"
                  ? `${isAdmin ? selectedStore?.location : userLocation} — ${selectedMonth} ${headingYear}`
                  : drilldownLevel === "months"
                    ? `${isAdmin ? selectedStore?.location : userLocation} — Cost Breakdown ${resolvedYear}`
                    : "Maintenance Cost YTD"
              }
              returnAction={
                drilldownLevel === "jobs" ||
                (drilldownLevel === "months" && isAdmin)
              }
              onClick={() => {
                if (drilldownLevel === "jobs") {
                  setSelectedMonth(null);
                  return;
                }

                if (drilldownLevel === "months" && isAdmin) {
                  setSelectedStore(null);
                }
              }}
              className={cn(sharedStyles.chartHeading, "capitalize")}
            />
          )}

          {/* Year selector is only displayed for the admin site level. */}
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

        {/* ------------------------------------------------------------------ */}
        {/* Chart                                                              */}
        {/* ------------------------------------------------------------------ */}

        <motion.div layout className="flex-1 min-h-0">
          {isLoading ? (
            <JobRequestsChartSkeleton />
          ) : (
            <CostChart
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

export default MaintenanceCost;
