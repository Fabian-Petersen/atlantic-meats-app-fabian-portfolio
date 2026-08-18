import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

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
  const chartData = useMemo(() => {
    if (!selectedYear) return [];

    return data[selectedYear] || [];
  }, [selectedYear, data]);

  const handleBarClick = (data: ChartPoint) => {
    if (!selectedYear) return;

    const label = data.name;

    onSelect?.(selectedYear, label);
  };

  return (
    <div className="w-full h-full md:p-4 relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barSize={25}
          margin={{
            top: 4,
            right: 4,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis
            dataKey="name"
            style={{
              fontSize: "12px",
              textTransform: "capitalize",
            }}
          />

          <YAxis
            allowDecimals={false}
            style={{
              fontSize: "12px",
            }}
          />

          <Tooltip
            cursor={{
              fill: "#fcb53b40",
            }}
            labelStyle={{
              textTransform: "capitalize",
            }}
          />

          <Bar
            dataKey="value"
            fill="#fcb53b"
            activeBar={{
              fill: "#fcb53b",
              stroke: "none",
              strokeWidth: 0,
            }}
            style={{
              cursor: "pointer",
              textTransform: "capitalize",
            }}
            onClick={(data) => handleBarClick(data as ChartPoint)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default JobsChart;
