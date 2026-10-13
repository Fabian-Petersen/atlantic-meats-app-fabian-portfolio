import { useMemo } from "react";

import useScreenSize from "@/customHooks/useScreenSize";
import type { CostByYear, ChartPoint } from "@/schemas/dashboardSchema";
import DashboardBarChart from "./DashboardBarChart";
// import useGlobalContext from "@/context/useGlobalContext";

// export type CostByYear = Record<string, ChartPoint[]>;

type Props = {
  data: CostByYear;
  selectedYear?: string;
  useCodeLabels?: boolean;

  // Level 1: store selected
  onSelect?: (year: string, name: string) => void;
};

/**
 * CostChart
 *
 * Reusable Recharts bar chart component for displaying yearly cost metrics
 * grouped by location/store/branch.
 *
 * The component:
 * - Automatically extracts available years from the `data` object
 * - Defaults to the latest year
 * - Allows switching between years using a select dropdown
 * - Displays the selected year's data in a bar chart
 * - Emits the selected year and clicked location on bar click
 *
 * Expected data structure:
 *
 * type CostPoint = {
 *   name: string;   // Label displayed on the X-axis
 *   value: number;  // Numeric value displayed as bar height
 * };
 *
 * type CostByYear = Record<string, CostPoint[]>;
 *
 * Example:
 *
 * const data = {
 *   "2025": [
 *     { name: "Maitland", value: 12500 },
 *     { name: "Bellville", value: 9800 },
 *   ],
 *   "2026": [
 *     { name: "Maitland", value: 18740 },
 *     { name: "Bellville", value: 12620 },
 *   ],
 * };
 *
 * Example usage:
 *
 * <CostChart data={data} />
 *
 * Example backend response format:
 *
 * {
 *   "2026": [
 *     { "name": "maitland", "value": 18740.0 },
 *     { "name": "bellville", "value": 12620.0 }
 *   ]
 * }
 *
 * Props:
 *
 * @param data - Object where:
 * - key = year
 * - value = array of chart points for that year
 */

const formatRand = (value: number) =>
  `R${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

function CostChart({ data, onSelect, selectedYear, useCodeLabels }: Props) {
  const isMobile = useScreenSize(400);
  // const { isDarkTheme } = useGlobalContext();

  const chartData = useMemo(() => {
    if (!selectedYear) return [];
    return data[selectedYear] || [];
  }, [selectedYear, data]);

  const handleBarClick = (data: ChartPoint) => {
    if (!selectedYear) return;

    onSelect?.(selectedYear, data.name);
  };

  return (
    <DashboardBarChart
      data={chartData}
      isMobile={isMobile}
      onSelect={handleBarClick}
      compactMobileLeft
      useCodeLabels={useCodeLabels}
      valueFormatter={formatRand}
    />
  );
}

export default CostChart;
