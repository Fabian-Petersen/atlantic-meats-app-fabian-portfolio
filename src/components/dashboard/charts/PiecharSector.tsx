import { Sector, type PieSectorDataItem } from "recharts";

export const CustomSector = (
  props: PieSectorDataItem & { isActive?: boolean },
) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
    isActive,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {isActive && (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      )}

      {isActive && (
        <>
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="var(--chart-text)"
            fontSize={22}
          >
            {payload?.name}
          </text>
          <text
            x={cx}
            y={cy + 24}
            textAnchor="middle"
            fill="var(--chart-text)"
            fontSize={28}
            fontWeight={400}
          >
            {value}
          </text>
        </>
      )}
    </g>
  );
};
