import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sharedStyles } from "@/styles/shared";
/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
import CostChart from "../charts/CostChart";
import ChartHeading from "../ChartHeading";
import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";

/* -------------------------------------------------------------------------- */
/*                                Hooks & Utils                                */
/* -------------------------------------------------------------------------- */
import { useStoreCostByMonth } from "@/hooks/useStoreCostByMonth";
import { useStoreCostByYear } from "@/hooks/useStoreCostByYear";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
import type {
  StoreCostByYear,
  StoreJobsByMonth,
  CostByYear,
} from "@/schemas/dashboardSchema";
/* -------------------------------------------------------------------------- */
/*                                  Animation                                 */
/* -------------------------------------------------------------------------- */
import { motion } from "framer-motion";

type Props = {
  data: StoreCostByYear;
  isPending: boolean;
};

/**
 * Adapts the level-3 API response (a single month's job list) into the
 * CostByYear shape CostChart expects.
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

// RT-0024: 5653498b-bb7c-412d-b456-2f229ee7be78
// RT-0024: c21e3ce5-cb35-4931-ab78-fbdabb318364

/**
 * CostChart only reports back the clicked bar's `name` (assetID). To route
 * to a specific job's completion page we need its request_id, so we build
 * a lookup from the same jobs array the chart was rendered from.
 *
 * NOTE: assumes assetID is unique within a given month's job list. If the
 * same asset can have multiple jobs in one month, switch to composing a
 * unique bar name (e.g. `${assetID} (${index})`) and parse it back out here.
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

function MaintenanceCost({ data: costByYear, isPending }: Props) {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState<string>("");
  // 👇 State to track which store/year was selected from the main chart
  const [selectedStore, setSelectedStore] = useState<{
    year: string;
    location: string;
  } | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                               API Data Calls                               */
  /* -------------------------------------------------------------------------- */

  const { data: costPerStoreByYear, isPending: isCostPerStorePending } =
    useStoreCostByYear(
      selectedStore?.year ?? null,
      selectedStore?.location ?? null,
    );

  const { data: jobsByMonth, isPending: isJobsByMonthPending } =
    useStoreCostByMonth(
      selectedStore?.year ?? null,
      selectedStore?.location ?? null,
      selectedMonth,
    );

  /* -------------------------------------------------------------------------- */
  /*                               Drilldown Level                              */
  /* -------------------------------------------------------------------------- */

  const isStoreSelected = !!selectedStore;
  const isMonthSelected = !!selectedMonth;

  const drilldownLevel = isMonthSelected
    ? "jobs"
    : isStoreSelected
      ? "store"
      : "overview";

  const jobsChartData = useMemo(
    () => toJobsChartData(jobsByMonth),
    [jobsByMonth],
  );

  const jobRequestIdLookup = useJobRequestIdLookup(jobsByMonth);

  const chartData =
    drilldownLevel === "overview"
      ? (costByYear ?? {})
      : drilldownLevel === "store"
        ? (costPerStoreByYear?.data ?? {})
        : jobsChartData;

  const isLoading =
    drilldownLevel === "overview"
      ? isPending
      : drilldownLevel === "store"
        ? isCostPerStorePending
        : isJobsByMonthPending;

  const years = Object.keys(chartData).sort();
  const latestYear = years[years.length - 1] ?? "";

  // Only the overview level respects the user's manual year selection.
  // Drilled-down data (store or jobs) is already scoped to a single key
  // (a year, or a month), so that key should always win.
  const resolvedYear =
    drilldownLevel === "overview" ? selectedYear || latestYear : latestYear;

  /* -------------------------------------------------------------------------- */
  /*                              Chart Interaction                             */
  /* -------------------------------------------------------------------------- */

  // CostChart always calls onSelect with (year, barLabel). What that pair
  // means depends on the level we're currently viewing:
  //   overview -> barLabel is a location -> drill into that store
  //   store    -> barLabel is a month    -> drill into that month's jobs
  //   jobs     -> barLabel is an assetID -> navigate to that job's page
  const handleChartSelect = (year: string, label: string) => {
    if (drilldownLevel === "overview") {
      setSelectedStore({ year, location: label });
      setSelectedMonth(null);
      return;
    }

    if (drilldownLevel === "store") {
      setSelectedMonth(label);
      return;
    }

    if (drilldownLevel === "jobs") {
      const actionId = jobRequestIdLookup.get(label);
      if (!actionId) return;
      navigate(`/jobs/${actionId}/complete`);
    }
  };

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
        transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
        className="flex flex-col gap-4 h-full"
      >
        {/* Header (participates in layout animation) */}
        <div className="flex items-center justify-between">
          <ChartHeading
            title={
              drilldownLevel === "jobs"
                ? `${selectedStore?.location} — ${selectedMonth} ${selectedStore?.year}`
                : drilldownLevel === "store"
                  ? `${selectedStore?.location} — Cost Breakdown ${selectedStore?.year}`
                  : "Maintenance Cost YTD"
            }
            returnAction={drilldownLevel !== "overview"}
            onClick={() => {
              if (drilldownLevel === "jobs") {
                setSelectedMonth(null);
                return;
              }

              if (drilldownLevel === "store") {
                setSelectedStore(null);
              }
            }}
            className={cn(sharedStyles.chartHeading, "capitalize")}
          />
          {/* Selected Year Menu Dropdown — overview level only */}
          {drilldownLevel === "overview" && (
            <select
              value={resolvedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="year selector"
              className="base-select text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year} className="">
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Chart container (layout animated) */}
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

// import { useMemo, useState } from "react";
// import { sharedStyles } from "@/styles/shared";
// /* -------------------------------------------------------------------------- */
// /*                                 Components                                 */
// /* -------------------------------------------------------------------------- */
// import CostChart, { type CostByYear } from "../charts/CostChart";
// import ChartHeading from "../ChartHeading";
// import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";

// /* -------------------------------------------------------------------------- */
// /*                                Hooks & Utils                               */
// /* -------------------------------------------------------------------------- */
// import { useStoreCostByMonth } from "@/hooks/useStoreCostByMonth";
// import { useStoreCostByYear } from "@/hooks/useStoreCostByYear";
// import { cn } from "@/lib/utils";

// /* -------------------------------------------------------------------------- */
// /*                                    Types                                   */
// /* -------------------------------------------------------------------------- */
// import type {
//   StoreCostByYear,
//   StoreJobsByMonth,
// } from "@/schemas/dashboardSchema";
// /* -------------------------------------------------------------------------- */
// /*                                  Animation                                 */
// /* -------------------------------------------------------------------------- */
// import { motion } from "framer-motion";

// type Props = {
//   data: StoreCostByYear;
//   isPending: boolean;
// };

// /**
//  * Adapts the level-3 API response (a single month's job list) into the
//  * CostByYear shape CostChart expects. Kept local to this component for now —
//  * move to CostChart.tsx or a shared chartAdapters.ts if another view ends up
//  * needing StoreJobsByMonth in chart form too.
//  */
// function toJobsChartData(
//   jobsByMonth: StoreJobsByMonth | undefined,
// ): CostByYear {
//   if (!jobsByMonth) return {};

//   return {
//     [jobsByMonth.month]: jobsByMonth.jobs.map((job) => ({
//       name: job.assetID,
//       value: job.costs.total,
//     })),
//   };
// }

// function MaintenanceCost({ data: costByYear, isPending }: Props) {
//   const [selectedYear, setSelectedYear] = useState<string>("");
//   // 👇 State to track which store/year was selected from the main chart
//   const [selectedStore, setSelectedStore] = useState<{
//     year: string;
//     location: string;
//   } | null>(null);

//   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

//   /* -------------------------------------------------------------------------- */
//   /*                               API Data Calls                               */
//   /* -------------------------------------------------------------------------- */

//   const { data: costPerStoreByYear, isPending: isCostPerStorePending } =
//     useStoreCostByYear(
//       selectedStore?.year ?? null,
//       selectedStore?.location ?? null,
//     );

//   const { data: jobsByMonth, isPending: isJobsByMonthPending } =
//     useStoreCostByMonth(
//       selectedStore?.year ?? null,
//       selectedStore?.location ?? null,
//       selectedMonth,
//     );

//   /* -------------------------------------------------------------------------- */
//   /*                               Drilldown Level                              */
//   /* -------------------------------------------------------------------------- */

//   const isStoreSelected = !!selectedStore;
//   const isMonthSelected = !!selectedMonth;

//   const drilldownLevel = isMonthSelected
//     ? "jobs"
//     : isStoreSelected
//       ? "store"
//       : "overview";

//   const jobsChartData = useMemo(
//     () => toJobsChartData(jobsByMonth),
//     [jobsByMonth],
//   );

//   const chartData =
//     drilldownLevel === "overview"
//       ? (costByYear ?? {})
//       : drilldownLevel === "store"
//         ? (costPerStoreByYear?.data ?? {})
//         : jobsChartData;

//   const isLoading =
//     drilldownLevel === "overview"
//       ? isPending
//       : drilldownLevel === "store"
//         ? isCostPerStorePending
//         : isJobsByMonthPending;

//   const years = Object.keys(chartData).sort();
//   const latestYear = years[years.length - 1] ?? "";

//   // Only the overview level respects the user's manual year selection.
//   // Drilled-down data (store or jobs) is already scoped to a single key
//   // (a year, or a month), so that key should always win.
//   const resolvedYear =
//     drilldownLevel === "overview" ? selectedYear || latestYear : latestYear;

//   /* -------------------------------------------------------------------------- */
//   /*                              Chart Interaction                             */
//   /* -------------------------------------------------------------------------- */

//   // CostChart always calls onSelect with (year, barLabel). What that pair
//   // means depends on the level we're currently viewing:
//   //   overview -> barLabel is a location  -> drill into that store
//   //   store    -> barLabel is a month     -> drill into that month's jobs
//   //   jobs     -> no further drilldown, CostChart gets no onSelect at all
//   const handleChartSelect = (year: string, label: string) => {
//     if (drilldownLevel === "overview") {
//       setSelectedStore({ year, location: label });
//       setSelectedMonth(null);
//       return;
//     }

//     if (drilldownLevel === "store") {
//       setSelectedMonth(label);
//     }
//   };

//   return (
//     <div
//       className={cn(
//         sharedStyles.chartParent,
//         "xl:col-span-3 min-h-0 flex flex-col gap-4",
//         "text-gray-600 dark:text-gray-100",
//       )}
//     >
//       <motion.div
//         layout
//         transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
//         className="flex flex-col gap-4 h-full"
//       >
//         {/* Header (participates in layout animation) */}
//         <div className="flex items-center justify-between">
//           <ChartHeading
//             title={
//               drilldownLevel === "jobs"
//                 ? `${selectedStore?.location} — ${selectedMonth} ${selectedStore?.year}`
//                 : drilldownLevel === "store"
//                   ? `${selectedStore?.location} — Cost Breakdown ${selectedStore?.year}`
//                   : "Maintenance Cost YTD"
//             }
//             returnAction={drilldownLevel !== "overview"}
//             onClick={() => {
//               if (drilldownLevel === "jobs") {
//                 setSelectedMonth(null);
//                 return;
//               }

//               if (drilldownLevel === "store") {
//                 setSelectedStore(null);
//               }
//             }}
//             className={cn(sharedStyles.chartHeading, "capitalize")}
//           />
//           {/* Selected Year Menu Dropdown — overview level only */}
//           {drilldownLevel === "overview" && (
//             <select
//               value={resolvedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               aria-label="year selector"
//               className="base-select text-sm"
//             >
//               {years.map((year) => (
//                 <option key={year} value={year} className="">
//                   {year}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         {/* Chart container (layout animated) */}
//         <motion.div layout className="flex-1 min-h-0">
//           {isLoading ? (
//             <JobRequestsChartSkeleton />
//           ) : (
//             <CostChart
//               data={chartData}
//               selectedYear={resolvedYear}
//               onSelect={
//                 drilldownLevel === "jobs" ? undefined : handleChartSelect
//               }
//             />
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

// export default MaintenanceCost;
