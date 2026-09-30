import { useMemo } from "react";
import useScreenSize from "@/customHooks/useScreenSize";
import DashboardBarChart from "./DashboardBarChart";

import type { ChartPoint, JobsByYear } from "@/schemas/dashboardSchema";

type Props = {
  data: JobsByYear;
  selectedYear?: string;

  // Level 1: site selected
  onSelect?: (year: string, name: string) => void;
};

/**
 * JobsChart
 *
 * Reusable Recharts bar chart component for displaying maintenance
 * job counts grouped by location/store/branch.
 *
 * The component:
 * - Extracts the data for the selected year
 * - Displays each site as a bar
 * - Uses the job count as the bar value
 * - Emits the selected year and site when a bar is clicked
 *
 * Expected data structure:
 *
 * type JobMetricPoint = {
 *   name: string;
 *   value: number;
 * };
 *
 * type JobsByYear = Record<string, JobMetricPoint[]>;
 *
 * Example:
 *
 * const data = {
 *   "2025": [
 *     { name: "maitland", value: 20 },
 *     { name: "bellville", value: 27 },
 *   ],
 *   "2026": [
 *     { name: "maitland", value: 10 },
 *     { name: "bellville", value: 6 },
 *   ],
 * };
 *
 * Example usage:
 *
 * <JobsChart
 *   data={data}
 *   selectedYear="2026"
 *   onSelect={handleChartSelect}
 * />
 *
 * Backend response:
 *
 * {
 *   "2026": [
 *     { "name": "maitland", "value": 4 },
 *     { "name": "bellville", "value": 6 }
 *   ]
 * }
 *
 * @param data
 * Object where:
 * - key = year
 * - value = array of job metric points for that year
 *
 * @param selectedYear
 * Year currently displayed by the chart.
 *
 * @param onSelect
 * Callback fired when a site bar is clicked.
 */
function JobsChart({ data, onSelect, selectedYear }: Props) {
  const isMobile = useScreenSize(400);
  // const { isDarkTheme } = useGlobalContext();
  const chartData = useMemo(() => {
    if (!selectedYear) return [];

    return data[selectedYear] || [];
  }, [selectedYear, data]);

  const handleBarClick = (data: ChartPoint) => {
    if (!selectedYear) return;

    const label = isMobile ? (data?.code ?? "") : data?.name;

    onSelect?.(selectedYear, label);
  };

  return (
    <DashboardBarChart
      data={chartData}
      isMobile={isMobile}
      onSelect={handleBarClick}
    />
  );
}

export default JobsChart;
