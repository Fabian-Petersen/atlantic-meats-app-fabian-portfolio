import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

import type { AllYearlyCostPoint } from "@/schemas/dashboardSchema";

export type CostByYear = Record<string, AllYearlyCostPoint[]>;

type Props = {
  data: CostByYear;
  selectedYear?: string;
  onSelect?: (year: string, location: string) => void;
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

function CostChart({ data, onSelect, selectedYear }: Props) {
  const chartData = useMemo(() => {
    if (!selectedYear) return [];
    return data[selectedYear] || [];
  }, [selectedYear, data]);

  const handleBarClick = (data: AllYearlyCostPoint) => {
    if (!selectedYear) return;
    const location = data.name;
    onSelect?.(selectedYear, location);
  };

  return (
    <div className="w-full h-full md:p-4 relative">
      {/* Chart fills full height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barSize={25}
          margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="name"
            // className="dark:text-gray-200 capitalize"
            style={{ fontSize: "12px", textTransform: "capitalize" }}
          />
          <YAxis style={{ fontSize: "12px" }} />
          <Tooltip
            cursor={{ fill: "#fcb53b40" }}
            labelStyle={{ textTransform: "capitalize" }}
          />
          <Bar
            dataKey="value"
            fill="#fcb53b"
            activeBar={{
              fill: "#fcb53b",
              stroke: "none",
              strokeWidth: 0,
            }}
            style={{ cursor: "pointer", textTransform: "capitalize" }}
            onClick={(data) => handleBarClick(data as AllYearlyCostPoint)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CostChart;
