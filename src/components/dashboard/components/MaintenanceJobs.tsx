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

          <div className="flex items-center gap-2">
            {/* -------------------------------------------------------------- */}
            {/* Status selector                                                */}
            {/* -------------------------------------------------------------- */}

            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
              aria-label="job status selector"
              className={cn(sharedStyles.chartSelectBtn)}
            >
              <option value="pending">Pending</option>

              <option value="in progress">In Progress</option>

              <option value="complete">Completed</option>

              <option value="cancelled">Cancelled</option>
            </select>

            {/* -------------------------------------------------------------- */}
            {/* Year selector                                                  */}
            {/* -------------------------------------------------------------- */}

            {drilldownLevel === "sites" && (
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
            )}
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

// import { useState } from "react";
// import { motion } from "framer-motion";

// /* -------------------------------------------------------------------------- */
// /*                                 Components                                 */
// /* -------------------------------------------------------------------------- */

// import JobsChart from "../charts/JobsChart";
// import ChartHeading from "../ChartHeading";
// import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";

// /* -------------------------------------------------------------------------- */
// /*                                Hooks & Utils                               */
// /* -------------------------------------------------------------------------- */

// import { useStoreJobMetrics } from "@/hooks/useStoreJobMetrics";
// import { cn } from "@/lib/utils";
// import { sharedStyles } from "@/styles/shared";

// /* -------------------------------------------------------------------------- */
// /*                                    Types                                   */
// /* -------------------------------------------------------------------------- */

// import type { StoreJobMetrics } from "@/schemas/dashboardSchema";

// type DrilldownLevel = "sites" | "months";

// type JobStatus = "pending" | "in progress" | "complete" | "cancelled";

// type Props = {
//   data: StoreJobMetrics;
//   isPending: boolean;
//   isAdmin: boolean;
//   userLocation?: string;
// };

// /* ========================================================================== */
// /*                             MaintenanceJobs                                */
// /* ========================================================================== */

// function MaintenanceJobs({ data, isPending, isAdmin, userLocation }: Props) {
//   /* ------------------------------------------------------------------------ */
//   /*                               State                                      */
//   /* ------------------------------------------------------------------------ */

//   const [selectedYear, setSelectedYear] = useState<string>("");

//   /**
//    * Admin only:
//    *
//    * Stores the site selected from the first-level chart.
//    */
//   const [selectedStore, setSelectedStore] = useState<{
//     year: string;
//     location: string;
//   } | null>(null);

//   /**
//    * Job status displayed by the chart.
//    */
//   const [selectedStatus, setSelectedStatus] = useState<JobStatus>("pending");

//   /* ------------------------------------------------------------------------ */
//   /*                              Initial Chart Data                          */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * Initial API response:
//    *
//    * {
//    *   pending: {
//    *     "2026": [
//    *       { name: "bellville", value: 1 }
//    *     ]
//    *   },
//    *   ...
//    * }
//    *
//    * This is used for the first-level admin chart and also provides
//    * the available year for managers/users.
//    */
//   const initialChartData = data?.[selectedStatus] ?? {};

//   const initialYears = Object.keys(initialChartData).sort();

//   const latestInitialYear = initialYears[initialYears.length - 1] ?? "";

//   /* ------------------------------------------------------------------------ */
//   /*                              Location                                    */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * Admin:
//    *   Location comes from the selected site.
//    *
//    * User/Manager:
//    *   Location comes from the authenticated user's location.
//    */
//   const location = isAdmin
//     ? (selectedStore?.location ?? null)
//     : (userLocation ?? null);

//   /* ------------------------------------------------------------------------ */
//   /*                                Year                                      */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * Admin:
//    *   Year comes from the selected site.
//    *
//    * User/Manager:
//    *   There is no year selector, so use the latest year available
//    *   in the initial storeJobs response.
//    *
//    * Example:
//    *
//    *   data.pending["2026"]
//    *
//    * resolves to:
//    *
//    *   year = "2026"
//    */
//   const year = isAdmin
//     ? (selectedStore?.year ?? null)
//     : selectedYear || latestInitialYear || null;

//   /* ------------------------------------------------------------------------ */
//   /*                              API Data                                    */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * Level 2:
//    *
//    * Admin:
//    *   selectedStore + selectedStatus + year
//    *
//    * User/Manager:
//    *   userLocation + selectedStatus + year
//    *
//    * The hook remains disabled until location and year are available.
//    */
//   const { data: jobsByStore, isPending: isJobsByStorePending } =
//     useStoreJobMetrics(year, location, selectedStatus);

//   /* ------------------------------------------------------------------------ */
//   /*                              Drilldown Level                             */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * Admin:
//    *
//    *   sites → months
//    *
//    * User/Manager:
//    *
//    *   months
//    *
//    * A user/manager already has a location assigned, therefore
//    * there is no site-selection level for them.
//    */
//   const drilldownLevel: DrilldownLevel = isAdmin
//     ? selectedStore
//       ? "months"
//       : "sites"
//     : "months";

//   /* ------------------------------------------------------------------------ */
//   /*                              Chart Data                                  */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * Admin at sites level:
//    *
//    *   Uses the initial storeJobs response.
//    *
//    * Manager/User at months level:
//    *
//    *   Uses the level-2 API response from useStoreJobMetrics.
//    *
//    * Example level-2 response:
//    *
//    * {
//    *   location: "bellville",
//    *   status: "pending",
//    *   year: "2026",
//    *   data: {
//    *     "2026": [
//    *       { name: "Jan", value: 0 },
//    *       { name: "Feb", value: 0 },
//    *       { name: "May", value: 1 }
//    *     ]
//    *   }
//    * }
//    */
//   const chartData =
//     drilldownLevel === "sites" ? initialChartData : (jobsByStore?.data ?? {});

//   /* ------------------------------------------------------------------------ */
//   /*                              Loading                                     */
//   /* ------------------------------------------------------------------------ */

//   const isLoading =
//     drilldownLevel === "sites" ? isPending : isJobsByStorePending;

//   /* ------------------------------------------------------------------------ */
//   /*                              Year Handling                               */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * The year displayed by the chart.
//    */
//   const years = Object.keys(chartData).sort();

//   const latestYear = years[years.length - 1] ?? "";

//   /**
//    * Admin at sites level:
//    *   Uses selected year or latest available year.
//    *
//    * User/Manager:
//    *   Uses the year resolved above.
//    *
//    * Admin after selecting a site:
//    *   Uses the selected site's year.
//    */
//   const resolvedYear =
//     drilldownLevel === "sites"
//       ? selectedYear || latestYear
//       : year || latestYear;

//   /* ------------------------------------------------------------------------ */
//   /*                              Chart Interaction                           */
//   /* ------------------------------------------------------------------------ */

//   /**
//    * JobsChart returns:
//    *
//    * sites:
//    *   label = location
//    *
//    * months:
//    *   label = month
//    */
//   const handleChartSelect = (chartYear: string, label: string) => {
//     /**
//      * Only admins can select a site.
//      *
//      * Managers/users are already scoped to their location.
//      */
//     if (drilldownLevel === "sites") {
//       setSelectedStore({
//         year: chartYear,
//         location: label,
//       });

//       return;
//     }
//   };

//   /* ------------------------------------------------------------------------ */
//   /*                              Status Change                               */
//   /* ------------------------------------------------------------------------ */

//   const handleStatusChange = (status: JobStatus) => {
//     setSelectedStatus(status);

//     /**
//      * When changing status from the site level, clear the selected
//      * site so that the new status starts from the top level.
//      */
//     if (isAdmin) {
//       setSelectedStore(null);
//     }

//     /**
//      * Clear a manually selected year so the new status can resolve
//      * its own latest available year.
//      */
//     setSelectedYear("");
//   };

//   /* ------------------------------------------------------------------------ */
//   /*                                Rendering                                 */
//   /* ------------------------------------------------------------------------ */

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
//         transition={{
//           layout: {
//             duration: 0.3,
//             ease: "easeInOut",
//           },
//         }}
//         className="flex flex-col gap-4 h-full"
//       >
//         {/* ------------------------------------------------------------------ */}
//         {/* Header                                                             */}
//         {/* ------------------------------------------------------------------ */}

//         <div className="flex items-center justify-between">
//           <ChartHeading
//             title={
//               drilldownLevel === "months"
//                 ? `${location} — ${selectedStatus} Jobs ${resolvedYear}`
//                 : "Maintenance Jobs"
//             }
//             returnAction={drilldownLevel === "months" && isAdmin}
//             onClick={() => {
//               if (drilldownLevel === "months" && isAdmin) {
//                 setSelectedStore(null);
//               }
//             }}
//             className={cn(sharedStyles.chartHeading, "capitalize")}
//           />

//           <div className="flex items-center gap-2">
//             {/* -------------------------------------------------------------- */}
//             {/* Status selector                                                */}
//             {/* -------------------------------------------------------------- */}

//             <select
//               value={selectedStatus}
//               onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
//               aria-label="job status selector"
//               className={cn(sharedStyles.chartSelectBtn)}
//             >
//               <option value="pending">Pending</option>

//               <option value="in progress">In Progress</option>

//               <option value="complete">Completed</option>

//               <option value="cancelled">Cancelled</option>
//             </select>

//             {/* -------------------------------------------------------------- */}
//             {/* Year selector                                                  */}
//             {/* -------------------------------------------------------------- */}

//             {drilldownLevel === "sites" && (
//               <select
//                 value={resolvedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 aria-label="year selector"
//                 className={cn(sharedStyles.chartSelectBtn)}
//               >
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>

//         {/* ------------------------------------------------------------------ */}
//         {/* Chart                                                              */}
//         {/* ------------------------------------------------------------------ */}

//         <motion.div layout className="flex-1 min-h-0">
//           {isLoading ? (
//             <JobRequestsChartSkeleton />
//           ) : (
//             <JobsChart
//               data={chartData}
//               selectedYear={resolvedYear}
//               onSelect={handleChartSelect}
//             />
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

// export default MaintenanceJobs;

// // import { useState } from "react";
// // import { motion } from "framer-motion";

// // /* -------------------------------------------------------------------------- */
// // /*                                 Components                                 */
// // /* -------------------------------------------------------------------------- */

// // import JobsChart from "../charts/JobsChart";
// // import ChartHeading from "../ChartHeading";
// // import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";

// // /* -------------------------------------------------------------------------- */
// // /*                                Hooks & Utils                               */
// // /* -------------------------------------------------------------------------- */

// // import { useStoreJobMetrics } from "@/hooks/useStoreJobMetrics";
// // import { cn } from "@/lib/utils";
// // import { sharedStyles } from "@/styles/shared";

// // /* -------------------------------------------------------------------------- */
// // /*                                    Types                                   */
// // /* -------------------------------------------------------------------------- */

// // import type { StoreJobMetrics } from "@/schemas/dashboardSchema";

// // type DrilldownLevel = "sites" | "months";

// // type JobStatus = "pending" | "in progress" | "complete" | "cancelled";

// // type Props = {
// //   data: StoreJobMetrics;
// //   isPending: boolean;
// //   isAdmin: boolean;
// //   userLocation?: string;
// // };

// // /* ========================================================================== */
// // /*                             MaintenanceJobs                                */
// // /* ========================================================================== */

// // function MaintenanceJobs({ data, isPending, isAdmin, userLocation }: Props) {
// //   /* ------------------------------------------------------------------------ */
// //   /*                               State                                      */
// //   /* ------------------------------------------------------------------------ */

// //   const [selectedYear, setSelectedYear] = useState<string>("");

// //   /**
// //    * Admin only:
// //    *
// //    * Stores the site selected from the first-level chart.
// //    */
// //   const [selectedStore, setSelectedStore] = useState<{
// //     year: string;
// //     location: string;
// //   } | null>(null);

// //   /**
// //    * Job status displayed by the chart.
// //    */
// //   const [selectedStatus, setSelectedStatus] = useState<JobStatus>("pending");

// //   /* ------------------------------------------------------------------------ */
// //   /*                              API Data                                    */
// //   /* ------------------------------------------------------------------------ */

// //   /**
// //    * Level 2:
// //    *
// //    * Admin:
// //    *   selectedStore + selectedStatus + year
// //    *
// //    * User/Manager:
// //    *   userLocation + selectedStatus + year
// //    *
// //    * The hook should remain disabled until a site is available.
// //    */
// //   const location = isAdmin
// //     ? (selectedStore?.location ?? null)
// //     : (userLocation ?? null);

// //   const year = isAdmin ? (selectedStore?.year ?? null) : selectedYear || null;

// //   const { data: jobsByStore, isPending: isJobsByStorePending } =
// //     useStoreJobMetrics(year, location, selectedStatus);

// //   /* ------------------------------------------------------------------------ */
// //   /*                              Drilldown Level                             */
// //   /* ------------------------------------------------------------------------ */

// //   /**
// //    * Admin:
// //    *
// //    *   sites → months
// //    *
// //    * User/Manager:
// //    *
// //    *   months
// //    *
// //    * A user/manager already has a location assigned, therefore there is
// //    * no site-selection level for them.
// //    */
// //   const drilldownLevel: DrilldownLevel = isAdmin
// //     ? selectedStore
// //       ? "months"
// //       : "sites"
// //     : "months";

// //   /* ------------------------------------------------------------------------ */
// //   /*                              Chart Data                                  */
// //   /* ------------------------------------------------------------------------ */

// //   /**
// //    * Initial API response:
// //    *
// //    * {
// //    *   pending: {
// //    *     "2026": [
// //    *       { name: "maitland", value: 4 }
// //    *     ]
// //    *   },
// //    *   ...
// //    * }
// //    *
// //    * At the sites level we select the currently selected status.
// //    *
// //    * The backend level-2 response:
// //    *
// //    * {
// //    *   location: "maitland",
// //    *   status: "pending",
// //    *   year: "2026",
// //    *   data: {
// //    *     "2026": [
// //    *       { name: "Jan", value: 2 },
// //    *       ...
// //    *     ]
// //    *   }
// //    * }
// //    *
// //    * is already in the structure expected by CostChart.
// //    */
// //   const initialChartData = data?.[selectedStatus] ?? {};

// //   const chartData =
// //     drilldownLevel === "sites" ? initialChartData : (jobsByStore?.data ?? {});

// //   /* ------------------------------------------------------------------------ */
// //   /*                              Loading                                     */
// //   /* ------------------------------------------------------------------------ */

// //   const isLoading =
// //     drilldownLevel === "sites" ? isPending : isJobsByStorePending;

// //   /* ------------------------------------------------------------------------ */
// //   /*                              Year Handling                               */
// //   /* ------------------------------------------------------------------------ */

// //   const years = Object.keys(chartData).sort();

// //   const latestYear = years[years.length - 1] ?? "";

// //   /**
// //    * At the sites level the admin can select the year.
// //    *
// //    * Once a site has been selected, the year comes from the
// //    * selected site/request.
// //    */
// //   const resolvedYear =
// //     drilldownLevel === "sites" ? selectedYear || latestYear : latestYear;

// //   /* ------------------------------------------------------------------------ */
// //   /*                              Chart Interaction                           */
// //   /* ------------------------------------------------------------------------ */

// //   /**
// //    * CostChart returns:
// //    *
// //    * sites:
// //    *   label = location
// //    *
// //    * months:
// //    *   label = month
// //    */
// //   const handleChartSelect = (year: string, label: string) => {
// //     if (drilldownLevel === "sites") {
// //       setSelectedStore({
// //         year,
// //         location: label,
// //       });

// //       return;
// //     }
// //   };

// //   /* ------------------------------------------------------------------------ */
// //   /*                              Status Change                                */
// //   /* ------------------------------------------------------------------------ */

// //   const handleStatusChange = (status: JobStatus) => {
// //     setSelectedStatus(status);

// //     /**
// //      * When changing status from the site level, keep the selected
// //      * site cleared so that the new status starts from the top level.
// //      */
// //     if (isAdmin) {
// //       setSelectedStore(null);
// //     }
// //   };

// //   /* ------------------------------------------------------------------------ */
// //   /*                                Rendering                                 */
// //   /* ------------------------------------------------------------------------ */

// //   return (
// //     <div
// //       className={cn(
// //         sharedStyles.chartParent,
// //         "xl:col-span-3 min-h-0 flex flex-col gap-4",
// //         "text-gray-600 dark:text-gray-100",
// //       )}
// //     >
// //       <motion.div
// //         layout
// //         transition={{
// //           layout: {
// //             duration: 0.3,
// //             ease: "easeInOut",
// //           },
// //         }}
// //         className="flex flex-col gap-4 h-full"
// //       >
// //         {/* ------------------------------------------------------------------ */}
// //         {/* Header                                                             */}
// //         {/* ------------------------------------------------------------------ */}

// //         <div className="flex items-center justify-between">
// //           <ChartHeading
// //             title={
// //               drilldownLevel === "months"
// //                 ? `${location} — ${selectedStatus} Jobs ${resolvedYear}`
// //                 : "Maintenance Jobs"
// //             }
// //             returnAction={drilldownLevel === "months" && isAdmin}
// //             onClick={() => {
// //               if (drilldownLevel === "months" && isAdmin) {
// //                 setSelectedStore(null);
// //               }
// //             }}
// //             className={cn(sharedStyles.chartHeading, "capitalize")}
// //           />

// //           <div className="flex items-center gap-2">
// //             {/* -------------------------------------------------------------- */}
// //             {/* Status selector                                                */}
// //             {/* -------------------------------------------------------------- */}

// //             <select
// //               value={selectedStatus}
// //               onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
// //               aria-label="job status selector"
// //               className={cn(sharedStyles.chartSelectBtn)}
// //             >
// //               <option value="pending">Pending</option>

// //               <option value="in progress">In Progress</option>

// //               <option value="complete">Completed</option>

// //               <option value="cancelled">Cancelled</option>
// //             </select>

// //             {/* -------------------------------------------------------------- */}
// //             {/* Year selector                                                  */}
// //             {/* -------------------------------------------------------------- */}

// //             {drilldownLevel === "sites" && (
// //               <select
// //                 value={resolvedYear}
// //                 onChange={(e) => setSelectedYear(e.target.value)}
// //                 aria-label="year selector"
// //                 className={cn(sharedStyles.chartSelectBtn)}
// //               >
// //                 {years.map((year) => (
// //                   <option key={year} value={year}>
// //                     {year}
// //                   </option>
// //                 ))}
// //               </select>
// //             )}
// //           </div>
// //         </div>

// //         {/* ------------------------------------------------------------------ */}
// //         {/* Chart                                                              */}
// //         {/* ------------------------------------------------------------------ */}

// //         <motion.div layout className="flex-1 min-h-0">
// //           {isLoading ? (
// //             <JobRequestsChartSkeleton />
// //           ) : (
// //             <JobsChart
// //               data={chartData}
// //               selectedYear={resolvedYear}
// //               onSelect={handleChartSelect}
// //             />
// //           )}
// //         </motion.div>
// //       </motion.div>
// //     </div>
// //   );
// // }

// // export default MaintenanceJobs;
