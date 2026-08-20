import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { CustomSector } from "./PiecharSector";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

const COLORS = ["#22c55e", "#eab308", "#ef4444", "#94a3b8"];

type Props = {
  data: AssetVerificationSummary;
};

export default function AssetVerificationStatusPieChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const complianceColor =
    data.compliance < 50
      ? "#f80606"
      : data.compliance < 80
        ? "#eab308"
        : "#22c55e";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {activeIndex === -1 && (
          <g>
            <text
              x="51%"
              y="50%"
              textAnchor="middle"
              fill={complianceColor}
              fontSize={48}
            >
              {data.compliance}%
            </text>

            <text
              x="51%"
              y="50%"
              dy={32}
              textAnchor="middle"
              fill="var(--chart-axis)"
              fontSize={18}
              fontWeight={400}
            >
              Compliance
            </text>
          </g>
        )}

        <Pie
          data={data.statuses}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          dataKey="value"
          fill="var(--chart-axis)"
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(-1)}
          shape={(props) => (
            <CustomSector
              {...props}
              fill={COLORS[props.index % COLORS.length]}
              isActive={props.index === activeIndex}
              // textColor="var(--chart-axis)"
            />
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
