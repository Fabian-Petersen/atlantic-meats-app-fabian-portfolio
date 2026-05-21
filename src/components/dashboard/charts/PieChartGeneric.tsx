import { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import type { Reliability } from "@/schemas/assetSchemas";

// ─── Types ────────────────────────────────────────────────────────────────────

type CustomSectorProps = PieSectorDataItem & {
  isActive: boolean;
};

interface Props {
  reliability: Reliability[]; // { name: string; value: number }[]
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatMetricValue(name: string, value: number) {
  if (name === "Availability") {
    return `${value.toFixed(0)}%`;
  }

  if (name === "MTTR" || name === "MTBF") {
    return `${value} hrs`;
  }

  return String(value);
}

// ─── Custom Sector ───────────────────────────────────────────────────────────

function CustomSector(props: CustomSectorProps & { isActive: boolean }) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    isActive,
  } = props;

  const ringGap = 8;
  const ringWidth = 4;

  // const expand = isActive ? 8 : 0;

  return (
    <>
      {/* Outer highlight ring */}
      {isActive && (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + ringGap}
          outerRadius={outerRadius + ringGap + ringWidth}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.9}
        />
      )}
      {/* Main Sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={isActive ? 1 : 0.8}
      />
    </>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export class PieChartGeneric extends PureComponent<Props> {
  state = {
    activeIndex: -1,
  };

  render() {
    const {
      reliability,
      // colors = COLORS,
      innerRadius = 80,
      outerRadius = 110,
    } = this.props;

    const { activeIndex } = this.state;

    const active = activeIndex >= 0 ? reliability[activeIndex] : null;

    const availabilityMetric = reliability.find(
      (item) => item.name === "Availability",
    );

    const coloredReliability = reliability.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }));

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Center display */}
            <g>
              {active ? (
                <>
                  <text
                    x="50%"
                    y="50%"
                    dy={32}
                    textAnchor="middle"
                    fill="var(--chart-text)"
                    fontSize={16}
                  >
                    {active.name}
                  </text>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="var(--chart-text)"
                    fontSize={32}
                  >
                    {formatMetricValue(active.name, active.value)}
                  </text>
                </>
              ) : (
                <>
                  <text
                    x="50%"
                    y="50%"
                    dy={32}
                    textAnchor="middle"
                    fill="var(--chart-text-muted)"
                    fontSize={16}
                  >
                    Availability
                  </text>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="var(--chart-text)"
                    fontSize={32}
                  >
                    {availabilityMetric
                      ? formatMetricValue(
                          availabilityMetric.name,
                          availabilityMetric.value,
                        )
                      : "0%"}
                  </text>
                </>
              )}
            </g>

            {/* Pie */}
            <Pie
              data={reliability}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              nameKey="name"
              paddingAngle={3}
              onMouseEnter={(_, index) => this.setState({ activeIndex: index })}
              onMouseLeave={() => this.setState({ activeIndex: -1 })}
              shape={(props: PieSectorDataItem & { index?: number }) => (
                <CustomSector
                  {...props}
                  isActive={props.index === activeIndex}
                />
              )}
            >
              {coloredReliability.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default PieChartGeneric;
