import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  userGroup?: string;
  userLocation?: string;
};

const getAssetLabel = (assetID: string | null | undefined) =>
  assetID?.trim() || "No Barcode";

/**
 * Adapts the level-3 API response (a single month's job list)
 * into the CostByYear shape expected by CostChart.
 */
function toJobsChartData(
  jobsByMonth: StoreJobsByMonth | undefined,
): CostByYear {
  if (!jobsByMonth?.month || !Array.isArray(jobsByMonth.jobs)) {
    return {};
  }

  return {
    [jobsByMonth.month]: jobsByMonth.jobs.map((job) => ({
      name: getAssetLabel(job.assetID),
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

    if (!Array.isArray(jobsByMonth?.jobs)) {
      return map;
    }

    jobsByMonth.jobs.forEach((job) => {
      map.set(getAssetLabel(job.assetID), job.action_id);
    });

    return map;
  }, [jobsByMonth]);
}

function MaintenanceCost({
  data: costByYear,
  isPending,
  isAdmin,
  userGroup,
  userLocation,
}: Props) {
  const navigate = useNavigate();
  const isTechnician = userGroup?.toLowerCase() === "maintenance";
  const hasSiteDrilldown = isAdmin || isTechnician;

  const [selectedYear, setSelectedYear] = useState<string>("");

  /**
   * Tracks the site selected from the first-level site-cost chart for admins
   * and technicians.
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
   * The backend returns location totals first for admins and technicians:
   *
   * Admin/Maintenance:
   *   total cost per site (with maintenance scoped by the authenticated sub)
   *
   * User/Manager:
   *   monthly cost for their location
   *
   * The parent passes the appropriate response as `data`.
   */
  const initialChartData = costByYear;

  /* -------------------------------------------------------------------------- */
  /*                               API Data Calls                               */
  /* -------------------------------------------------------------------------- */

  /**
   * After an admin or technician clicks a site, fetch its monthly cost
   * breakdown for the selected year.
   */
  const { data: costPerStoreByYear, isPending: isCostPerStorePending } =
    useStoreCostByYear(
      hasSiteDrilldown ? (selectedStore?.year ?? null) : null,
      hasSiteDrilldown ? (selectedStore?.location ?? null) : null,
    );

  /**
   * Level 3:
   *
   * Admin/Maintenance:
   *   selectedStore + selectedMonth
   *   (the backend additionally scopes maintenance users by authenticated sub)
   *
   * User/Manager:
   *   userLocation + selectedMonth
   */
  const { data: jobsByMonth, isPending: isJobsByMonthPending } =
    useStoreCostByMonth(
      hasSiteDrilldown
        ? (selectedStore?.year ?? null)
        : selectedYear || null,
      hasSiteDrilldown
        ? (selectedStore?.location ?? null)
        : (userLocation ?? null),
      selectedMonth,
    );

  /* -------------------------------------------------------------------------- */
  /*                              Drilldown Level                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Admin/Maintenance:
   *
   * sites → months → jobs
   *
   * User/Manager:
   *
   * months → jobs
   */
  const drilldownLevel: DrilldownLevel = hasSiteDrilldown
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
        ? hasSiteDrilldown
          ? (costPerStoreByYear?.data ?? {})
          : initialChartData
        : jobsChartData;

  const isLoading =
    drilldownLevel === "sites"
      ? isPending
      : drilldownLevel === "months"
        ? hasSiteDrilldown
          ? isCostPerStorePending
          : isPending
        : isJobsByMonthPending;

  /* -------------------------------------------------------------------------- */
  /*                              Year Handling                                 */
  /* -------------------------------------------------------------------------- */

  const years = Object.keys(chartData).sort();
  const latestYear = years[years.length - 1] ?? "";

  /**
   * Admins and technicians select the year at the site level.
   *
   * For users/managers, the year is already represented by the
   * costByStore response.
   */
  const resolvedYear =
    drilldownLevel === "sites" ? selectedYear || latestYear : latestYear;

  const headingYear =
    drilldownLevel === "jobs"
      ? hasSiteDrilldown
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
       * For maintenance users the selected site is sent while the backend
       * retains its authenticated-sub scope.
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
      <div className="flex flex-col gap-4 h-full">
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-center justify-between">
          {isLoading ? (
            <ChartHeading
              title="Maintenance Cost YTD"
              className={cn(sharedStyles.chartHeading)}
            />
          ) : (
            <ChartHeading
              title={
                drilldownLevel === "jobs"
                  ? `${hasSiteDrilldown ? selectedStore?.location : userLocation} — ${selectedMonth} ${headingYear}`
                  : drilldownLevel === "months"
                    ? `${hasSiteDrilldown ? selectedStore?.location : userLocation} — Cost Breakdown ${resolvedYear}`
                    : "Maintenance Cost YTD"
              }
              returnAction={
                drilldownLevel === "jobs" ||
                (drilldownLevel === "months" && hasSiteDrilldown)
              }
              onClick={() => {
                if (drilldownLevel === "jobs") {
                  setSelectedMonth(null);
                  return;
                }

                if (drilldownLevel === "months" && hasSiteDrilldown) {
                  setSelectedStore(null);
                }
              }}
              className={cn(sharedStyles.chartHeading, "capitalize")}
            />
          )}

          {/* Year selector is displayed for admin/technician site totals. */}
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

        <div className="flex-1 min-h-0">
          {isLoading ? (
            <JobRequestsChartSkeleton />
          ) : (
            <CostChart
              data={chartData}
              selectedYear={resolvedYear}
              onSelect={handleChartSelect}
              useCodeLabels={drilldownLevel === "sites"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintenanceCost;
