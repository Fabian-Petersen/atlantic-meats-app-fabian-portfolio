import { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  ResponsiveContainer,
  type PieSectorDataItem,
} from "recharts";
import ChartHeading from "../ChartHeading";

const data = [
  { name: "Total YTD", value: 16 },
  { name: "Completed", value: 10 },
  { name: "In Progress", value: 3 },
  { name: "On Hold", value: 3 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const CustomSector = (props: PieSectorDataItem & { isActive?: boolean }) => {
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
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize={22}>
            {payload?.name}
          </text>
          <text
            x={cx}
            y={cy + 24}
            textAnchor="middle"
            fill="#fff"
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

export default class OpenRequestsPieChart extends PureComponent {
  state = {
    activeIndex: -1,
  };

  render() {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
      <>
        <ChartHeading title="Requests Overview" />
        <ResponsiveContainer
          width="100%"
          height="93%"
          // style={{ border: "dashed 1px red" }}
        >
          <PieChart>
            {this.state.activeIndex === -1 && (
              <g>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={32}
                >
                  Total
                </text>
                <text
                  x="50%"
                  y="50%"
                  dy={32}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={32}
                  fontWeight={400}
                >
                  {total}
                </text>
              </g>
            )}

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              dataKey="value"
              onMouseEnter={(_, index) => this.setState({ activeIndex: index })}
              onMouseLeave={() => this.setState({ activeIndex: -1 })}
              shape={(props) => (
                <CustomSector
                  {...props}
                  isActive={props.index === this.state.activeIndex}
                />
              )}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  }
}

// import React, { PureComponent } from "react";
// import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
// import ChartHeading from "../ChartHeading";
// import { useColorModeValue } from "@/components/ui/color-mode";

// const data = [
//   { name: "Total YTD", value: 16 },
//   { name: "Completed", value: 10 },
//   { name: "In Progress", value: 3 },
//   { name: "On Hold", value: 3 },
// ];

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

// interface RenderActiveShapeProps {
//   cx: number;
//   cy: number;
//   midAngle: number;
//   innerRadius: number;
//   outerRadius: number;
//   startAngle: number;
//   endAngle: number;
//   fill: string;
//   payload: {
//     name: string;
//   };
//   percent: number;
//   value: number;
//   textColor: string;
// }

// const renderActiveShape = (props: RenderActiveShapeProps) => {
//   const RADIAN = Math.PI / 180;
//   const {
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     startAngle,
//     endAngle,
//     fill,
//     payload,
//     // percent,
//     value,
//   } = props;
//   const sin = Math.sin(-RADIAN * midAngle);
//   const cos = Math.cos(-RADIAN * midAngle);
//   const sx = cx + (outerRadius + 10) * cos;
//   const sy = cy + (outerRadius + 10) * sin;
//   const mx = cx + (outerRadius + 30) * cos;
//   const my = cy + (outerRadius + 30) * sin;
//   const ex = mx + (cos >= 0 ? 1 : -1) * 15;
//   const ey = my;
//   const textAnchor = cos >= 0 ? "start" : "end";

//   return (
//     <g>
//       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//         {payload.name}
//       </text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         innerRadius={outerRadius + 6}
//         outerRadius={outerRadius + 10}
//         fill={fill}
//         style={{}}
//       />
//       <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} fill="" />
//       <text
//         y={my + 10}
//         x={mx}
//         textAnchor={textAnchor}
//         fill="#fff"
//         style={{
//           fontSize: "30px",
//         }}
//       >
//         {`${value}`}
//       </text>
//       <text
//         x={ex + (cos >= 0 ? 1 : -1) * 12}
//         y={ey}
//         dy={18}
//         textAnchor={textAnchor}
//         fill="#999"
//       ></text>
//     </g>
//   );
// };

// export default class OpenRequestsPieChart extends PureComponent {
//   state = {
//     activeIndex: 0,
//   };

//   onPieEnter = (_: React.MouseEvent, index: number) => {
//     this.setState({
//       activeIndex: index,
//     });
//   };

//   render() {
//     // const { textColor } = this.props;
//     return (
//       <>
//         <ChartHeading title="Requests Overview" />
//         <ResponsiveContainer
//           width="100%"
//           height="100%"
//           style={{
//             border: "1px dotted red",
//             font: "white",
//           }}
//         >
//           <PieChart
//           // style={{
//           //   display: "flex",
//           //   justify: "center",
//           //   align: "center",
//           //   my: "auto",
//           //   mx: "auto",
//           // }}
//           >
//             <Pie
//               data={data}
//               // activeIndex={this.state.activeIndex}
//               activeShape={
//                 renderActiveShape as unknown as (
//                   props: unknown
//                 ) => React.JSX.Element
//               }
//               cx="50%"
//               cy="50%"
//               innerRadius={70}
//               outerRadius={80}
//               dataKey="value"
//               onMouseEnter={this.onPieEnter}
//             >
//               {data.map((_, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </>
//     );
//   }
// }
