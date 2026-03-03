import { PureComponent } from "react";
import { CustomSector } from "./PiecharSector";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import ChartHeading from "../ChartHeading";

const data = [
  { name: "Total YTD", value: 16 },
  { name: "Completed", value: 10 },
  { name: "In Progress", value: 3 },
  { name: "On Hold", value: 3 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

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
                  fill="var(--chart-text)"
                  fontSize={32}
                >
                  Total
                </text>
                <text
                  x="50%"
                  y="50%"
                  dy={32}
                  textAnchor="middle"
                  fill="var(--chart-text)"
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
