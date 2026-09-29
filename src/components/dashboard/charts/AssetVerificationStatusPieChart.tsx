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

  console.log("verification-data:", data);

  const statuses = Array.isArray(data.statuses) ? data.statuses : [];
  const normalizedStatuses: ChartSector[] = statuses.map((status, index) => {
    const value = Number(status.value);
    const numericValue = Number.isFinite(value) ? value : 0;

    return {
      name: status.name,
      value: numericValue,
      chartValue: numericValue,
      fill: COLORS[index % COLORS.length],
    };
  });
  const statusTotal = normalizedStatuses.reduce(
    (total, status) => total + status.value,
    0,
  );
  const verifiedTotal = normalizedStatuses.reduce(
    (total, status) =>
      status.name === "Verified" ? total + status.value : total,
    0,
  );
  const fallbackCompliance =
    statusTotal > 0 ? Math.round((verifiedTotal / statusTotal) * 100) : 0;
  const complianceValue = Number(data.compliance);
  const compliance = Number.isFinite(complianceValue)
    ? complianceValue
    : fallbackCompliance;
  const populatedStatuses = normalizedStatuses.filter(
    (status) => status.value > 0,
  );

  const chartData: ChartSector[] =
    populatedStatuses.length > 0
      ? populatedStatuses
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

  // console.log({
  //   rawCompliance: data.compliance,
  //   complianceValue,
  //   compliance,
  //   verifiedTotal,
  //   statusTotal,
  //   fallbackCompliance,
  // });

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
            onClick={() =>
              setActiveIndex((currentIndex) =>
                currentIndex === index ? -1 : index,
              )
            }
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(-1)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveIndex((currentIndex) =>
                  currentIndex === index ? -1 : index,
                );
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${sector.name}: ${sector.value}`}
            className="cursor-pointer outline-none"
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
