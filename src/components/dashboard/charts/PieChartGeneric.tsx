import { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReliabilityKey = "mtbf" | "mttr" | "availability" | "failureCount";
type ReliabilityEntry = Partial<Record<ReliabilityKey, number>>;
type CustomSectorProps = PieSectorDataItem & {
  isActive: boolean;
};

interface Props {
  reliability: ReliabilityEntry[];
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const LABELS: Record<ReliabilityKey, string> = {
  mtbf: "MTBF",
  mttr: "MTTR",
  availability: "Availability",
  failureCount: "Failures",
};

// ─── Transform ───────────────────────────────────────────────────────────────

// function normalize(data: ReliabilityEntry[]) {
//   return data.flatMap((entry) =>
//     Object.entries(entry).map(([key, value]) => ({
//       key: key as ReliabilityKey,
//       name: LABELS[key as ReliabilityKey] ?? key,
//       value: Math.abs(value as number) || 0.001,
//       raw: value as number,
//     })),
//   );
// }

// function formatValue(key: ReliabilityKey, raw: number) {
//   if (key === "availability") {
//     return `${(raw * 100).toFixed(2)}%`;
//   }

//   if (key === "mttr" || key === "mtbf") {
//     return `${raw} hrs`;
//   }

//   return String(raw);

// }

function normalizeReliabilityData(data: ReliabilityEntry[]) {
  return data.flatMap((entry) =>
    Object.entries(entry).map(([key, value]) => ({
      key: key as ReliabilityKey,
      name: LABELS[key as ReliabilityKey] ?? key,
      value: Math.abs(value as number) || 0.001,
      raw: value as number,
    })),
  );
}

function formatMetricValue(key: ReliabilityKey, raw: number) {
  if (key === "availability") {
    return `${raw.toFixed(0)}%`;
  }

  if (key === "mttr" || key === "mtbf") {
    return `${raw} hrs`;
  }

  return String(raw);
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

  const expand = isActive ? 8 : 0;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - (isActive ? 4 : 0)}
      outerRadius={outerRadius + expand}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      opacity={isActive ? 1 : 0.8}
    />
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
      colors = COLORS,
      // innerRadius = 80,
      // outerRadius = 110,
      // centerLabel = "Total",
    } = this.props;

    const data = normalizeReliabilityData(reliability);
    const { activeIndex } = this.state;

    const active = activeIndex >= 0 ? data[activeIndex] : null;
    // const total = data.reduce((sum, d) => sum + d.value, 0);
    const availabilityMetric = data.find((item) => item.key === "availability");
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
                    // fontWeight={500}
                  >
                    {active.name}
                  </text>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="var(--chart-text)"
                    fontSize={32}
                    // fontWeight={400}
                  >
                    {formatMetricValue(active.key, active.raw)}
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
                    // fontWeight={700}
                  >
                    {availabilityMetric
                      ? formatMetricValue(
                          availabilityMetric.key,

                          availabilityMetric.raw,
                        )
                      : "0%"}
                  </text>
                </>
              )}
            </g>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              dataKey="value"
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
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default PieChartGeneric;
