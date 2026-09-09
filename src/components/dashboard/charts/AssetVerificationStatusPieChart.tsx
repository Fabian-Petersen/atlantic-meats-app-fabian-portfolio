import { useState } from "react";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

const COLORS = ["#22c55e", "#eab308", "#ef4444", "#94a3b8"];
const CHART_SIZE = { width: 300, height: 256 };
const CENTER = { x: 150, y: 128 };
const RADIUS = 95;
const STROKE_WIDTH = 30;
const HIGHLIGHT_RADIUS = 116;
const HIGHLIGHT_WIDTH = 4;
const SECTOR_GAP = 3;

type Props = {
  data: AssetVerificationSummary;
};

type ChartSector = {
  name: string;
  value: number;
  chartValue: number;
  fill: string;
};

export default function AssetVerificationStatusPieChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const statuses = Array.isArray(data.statuses) ? data.statuses : [];
  const compliance = Number.isFinite(data.compliance) ? data.compliance : 0;
  const populatedStatuses = statuses.filter((status) => status.value > 0);

  const chartData: ChartSector[] =
    populatedStatuses.length > 0
      ? populatedStatuses.map((status) => ({
          ...status,
          chartValue: status.value,
          fill: COLORS[statuses.indexOf(status) % COLORS.length],
        }))
      : [
          {
            name: "Not Verified",
            value: 0,
            chartValue: 1,
            fill: COLORS[3],
          },
        ];

  const chartTotal = chartData.reduce(
    (total, sector) => total + sector.chartValue,
    0,
  );
  const circumference = 2 * Math.PI * RADIUS;
  const highlightCircumference = 2 * Math.PI * HIGHLIGHT_RADIUS;
  const activeSector = activeIndex >= 0 ? chartData[activeIndex] : undefined;

  const complianceColor =
    compliance < 50 ? "#f80606" : compliance < 80 ? "#eab308" : "#22c55e";

  return (
    <svg
      viewBox={`0 0 ${CHART_SIZE.width} ${CHART_SIZE.height}`}
      className="h-full w-full"
      role="img"
      aria-label={`${compliance}% asset verification compliance`}
    >
      {chartData.map((sector, index) => {
        const ratio = sector.chartValue / chartTotal;
        const sectorLength = ratio * circumference;
        const highlightLength = ratio * highlightCircumference;
        const accumulatedValue = chartData
          .slice(0, index)
          .reduce(
            (total, previousSector) => total + previousSector.chartValue,
            0,
          );
        const offsetRatio = accumulatedValue / chartTotal;
        const sectorOffset = -(offsetRatio * circumference);
        const highlightOffset = -(offsetRatio * highlightCircumference);
        const gap = chartData.length > 1 ? SECTOR_GAP : 0;

        return (
          <g
            key={sector.name}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
            className="cursor-pointer"
          >
            <title>{`${sector.name}: ${sector.value}`}</title>
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={RADIUS}
              fill="none"
              stroke={sector.fill}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${Math.max(sectorLength - gap, 0)} ${circumference}`}
              strokeDashoffset={sectorOffset}
              transform={`rotate(-90 ${CENTER.x} ${CENTER.y})`}
            />
            {activeIndex === index && (
              <circle
                cx={CENTER.x}
                cy={CENTER.y}
                r={HIGHLIGHT_RADIUS}
                fill="none"
                stroke={sector.fill}
                strokeWidth={HIGHLIGHT_WIDTH}
                strokeDasharray={`${Math.max(highlightLength - gap, 0)} ${highlightCircumference}`}
                strokeDashoffset={highlightOffset}
                transform={`rotate(-90 ${CENTER.x} ${CENTER.y})`}
              />
            )}
          </g>
        );
      })}

      <text
        x={CENTER.x}
        y={activeSector ? CENTER.y - 6 : CENTER.y}
        textAnchor="middle"
        fill={activeSector ? "var(--chart-text)" : complianceColor}
        fontSize={activeSector ? 22 : 48}
      >
        {activeSector ? activeSector.name : `${compliance}%`}
      </text>
      <text
        x={CENTER.x}
        y={activeSector ? CENTER.y + 24 : CENTER.y + 32}
        textAnchor="middle"
        fill={activeSector ? "var(--chart-text)" : "var(--chart-axis)"}
        fontSize={activeSector ? 28 : 18}
        fontWeight={400}
      >
        {activeSector ? activeSector.value : "Compliance"}
      </text>
    </svg>
  );
}
