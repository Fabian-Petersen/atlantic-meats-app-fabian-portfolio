import { PureComponent } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReliabilityKey = "mtbf" | "mttr" | "availability" | "failureCount";

type ReliabilityEntry = Partial<Record<ReliabilityKey, number>>;

interface ReliabilityPieChartProps {
  /** Array of single-key reliability objects */
  reliability: ReliabilityEntry[];
  /** Override default colors (cycles if fewer than data length) */
  colors?: string[];
  /** Override default labels for each metric key */
  labels?: Partial<Record<ReliabilityKey, string>>;
  /** Inner radius of the donut (px) */
  innerRadius?: number;
  /** Outer radius of the donut (px) */
  outerRadius?: number;
  /** Label shown in the centre when nothing is hovered */
  centerLabel?: string;
}

interface ReliabilityPieChartState {
  activeIndex: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const DEFAULT_LABELS: Record<ReliabilityKey, string> = {
  mtbf: "MTBF",
  mttr: "MTTR",
  availability: "Availability",
  failureCount: "Failures",
};

/** Flatten the array-of-single-key-objects into chart-friendly records */
function normaliseReliability(
  reliability: ReliabilityEntry[],
): { name: string; key: ReliabilityKey; value: number; raw: number }[] {
  return reliability.flatMap((entry) =>
    (Object.entries(entry) as [ReliabilityKey, number][]).map(([key, raw]) => ({
      key,
      name: DEFAULT_LABELS[key] ?? key,
      raw,
      // Use absolute value so the slice is always visible; show the real
      // number in the tooltip / centre text.
      value: Math.abs(raw) || 0.001,
    })),
  );
}

/** Format a raw reliability number sensibly */
function formatValue(key: ReliabilityKey, raw: number): string {
  if (key === "availability") {
    return `${(raw * 100).toFixed(2)}%`;
  }
  if (key === "mttr" || key === "mtbf") {
    // Values are in hours; surface as hours with reasonable precision
    return raw === 0 ? "0 h" : `${raw.toFixed(4)} h`;
  }
  return String(raw);
}

// ─── Custom active-sector shape ───────────────────────────────────────────────

interface SectorProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  isActive: boolean;
}

function CustomSector({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  isActive,
}: SectorProps) {
  // Dynamically import recharts sector
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Sector } = require("recharts");
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
      opacity={isActive ? 1 : 0.82}
      style={{
        transition: "all 0.2s ease",
        filter: isActive ? `drop-shadow(0 0 6px ${fill}99)` : "none",
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export class PieChartGeneric extends PureComponent<
  ReliabilityPieChartProps,
  ReliabilityPieChartState
> {
  state: ReliabilityPieChartState = { activeIndex: -1 };

  render() {
    const {
      reliability,
      colors = DEFAULT_COLORS,
      labels,
      innerRadius = 80,
      outerRadius = 110,
      centerLabel = "Metrics",
    } = this.props;

    const mergedLabels = { ...DEFAULT_LABELS, ...labels };

    const data = normaliseReliability(reliability).map((d) => ({
      ...d,
      name: mergedLabels[d.key] ?? d.name,
    }));

    const { activeIndex } = this.state;
    const active = activeIndex >= 0 ? data[activeIndex] : null;

    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Centre text */}
            <g>
              {active ? (
                <>
                  <text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    fill="var(--chart-text, #e2e8f0)"
                    fontSize={13}
                    fontWeight={500}
                    letterSpacing={1}
                    style={{ textTransform: "uppercase" }}
                  >
                    {active.name}
                  </text>
                  <text
                    x="50%"
                    y="54%"
                    textAnchor="middle"
                    fill="var(--chart-text, #e2e8f0)"
                    fontSize={22}
                    fontWeight={700}
                  >
                    {formatValue(active.key, active.raw)}
                  </text>
                </>
              ) : (
                <>
                  <text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    fill="var(--chart-text-muted, #94a3b8)"
                    fontSize={13}
                    letterSpacing={1}
                    fontWeight={500}
                  >
                    {centerLabel.toUpperCase()}
                  </text>
                  <text
                    x="50%"
                    y="56%"
                    textAnchor="middle"
                    fill="var(--chart-text, #e2e8f0)"
                    fontSize={28}
                    fontWeight={700}
                  >
                    {data.length}
                  </text>
                </>
              )}
            </g>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              paddingAngle={3}
              onMouseEnter={(_: unknown, index: number) =>
                this.setState({ activeIndex: index })
              }
              onMouseLeave={() => this.setState({ activeIndex: -1 })}
              shape={(props: SectorProps & { index: number }) => (
                <CustomSector
                  {...props}
                  isActive={props.index === activeIndex}
                />
              )}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 16px",
            justifyContent: "center",
            listStyle: "none",
            margin: "0",
            padding: "8px 0 0",
          }}
        >
          {data.map((d, i) => (
            <li
              key={d.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color:
                  activeIndex === i
                    ? colors[i % colors.length]
                    : "var(--chart-text-muted, #94a3b8)",
                fontWeight: activeIndex === i ? 600 : 400,
                cursor: "default",
                transition: "color 0.2s",
              }}
              onMouseEnter={() => this.setState({ activeIndex: i })}
              onMouseLeave={() => this.setState({ activeIndex: -1 })}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: colors[i % colors.length],
                  flexShrink: 0,
                }}
              />
              {d.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default PieChartGeneric;
