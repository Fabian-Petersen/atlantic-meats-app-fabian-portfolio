import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

export type CostPoint = {
  name: string;
  value: number;
};

export type CostByYear = Record<string, CostPoint[]>;

type Props = {
  data: CostByYear;
};

function CostChart({ data }: Props) {
  const years = Object.keys(data).sort();

  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);

  const chartData = useMemo(() => {
    return data[selectedYear] || [];
  }, [selectedYear, data]);

  return (
    <div
      className="w-full h-full p-4 relative"
      //   style={{
      //     width: "100%",
      //     height: "100%",
      //     padding: "16px",
      //     boxSizing: "border-box",
      //     position: "relative",
      //   }}
    >
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
          barSize={20}
          margin={{ top: 4, right: 12, bottom: 0, left: 12 }}
        >
          <XAxis dataKey="name" style={{ fontSize: "12px" }} />
          <YAxis style={{ fontSize: "12px" }} />
          <Tooltip cursor={{ fill: "#fcb53b40" }} />
          <Bar
            dataKey="value"
            fill="#fcb53b"
            activeBar={{
              fill: "#fcb53b",
              stroke: "none",
              strokeWidth: 0,
            }}
            style={{ cursor: "pointer" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CostChart;
