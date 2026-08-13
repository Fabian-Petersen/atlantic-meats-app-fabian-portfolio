import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

/* -------------------------------- Animation ------------------------------- */
import { motion } from "framer-motion";
import { useState } from "react";
import ChartHeading from "../ChartHeading";
import { useStoreCostByYear } from "@/hooks/useStoreCostByYear";
import { useAllStoresCostByYear } from "@/hooks/useAllStoresCostByYear";
import { JobRequestsChartSkeleton } from "../charts/JobRequestsChartSkeleton";
import CostChart from "../charts/CostChart";

function MaintenanceCost() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  // 👇 State to track which store/year was selected from the main chart
  const [selectedStore, setSelectedStore] = useState<{
    year: string;
    location: string;
  } | null>(null);

  const isDrilldown = !!selectedStore;

  // $ Hook pass the data to the CostChart Stores Cost per Month for selected year
  const { data: costByYear, isPending: isCostByYearPending } =
    useAllStoresCostByYear();

  const { data: costPerStoreByYear, isPending: isCostPerStorePending } =
    useStoreCostByYear(
      selectedStore?.year ?? null,
      selectedStore?.location ?? null,
    );

  const chartData = isDrilldown
    ? (costPerStoreByYear?.data ?? {})
    : (costByYear ?? {});

  const years = Object.keys(chartData).sort();
  const latestYear = years[years.length - 1] ?? "";

  const isLoading = isDrilldown ? isCostPerStorePending : isCostByYearPending;
  const resolvedYear = isLoading ? "" : selectedYear || latestYear;

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
              isDrilldown
                ? `${selectedStore.location} — Cost Breakdown ${selectedStore.year}`
                : "Maintenance Cost YTD"
            }
            returnAction={isDrilldown}
            onClick={() => setSelectedStore(null)}
            className={cn(sharedStyles.chartHeading, "capitalize")}
          />
          {/* Selected Year Menu Dropdown */}
          {!isDrilldown && (
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
              onSelect={
                isDrilldown
                  ? undefined
                  : (year, location) => {
                      setSelectedStore((prev) =>
                        prev?.year === year && prev?.location === location
                          ? null
                          : { year, location },
                      );
                    }
              }
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default MaintenanceCost;
