import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

import type { AllYearlyCostPoint } from "@/schemas/dashboardSchema";

export type CostByYear = Record<string, AllYearlyCostPoint[]>;

type Props = {
  data: CostByYear;
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

function CostChart({ data, onSelect }: Props) {
  const years = Object.keys(data).sort();

  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);

  const chartData = useMemo(() => {
    return data[selectedYear] || [];
  }, [selectedYear, data]);

  const handleBarClick = (data: AllYearlyCostPoint) => {
    const year = selectedYear;
    const location = data.name;
    onSelect?.(year, location);
  };

  return (
    <div className="w-full h-full p-4 relative">
      {/* Floating year selector */}
      <div className="absolute top-0 right-4 z-10">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          aria-label="year selector"
          className="px-1 py-2 rounded-md dark:border-(--clr-borderDark) border-gray-500/20 hover:cursor-pointer"
        >
          {years.map((year) => (
            <option
              key={year}
              value={year}
              className="hover:cursor-pointer bg-white"
            >
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Chart fills full height */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barSize={25}
          margin={{ top: 4, right: 12, bottom: 0, left: 12 }}
        >
          <XAxis
            dataKey="name"
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
