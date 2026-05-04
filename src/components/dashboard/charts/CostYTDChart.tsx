import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CostYTDChart() {
  const jobRequestCostData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 2390 },
    { name: "Aug", value: 2390 },
    { name: "Sept", value: 2390 },
    { name: "Oct", value: 2390 },
    { name: "Nov", value: 2390 },
    { name: "Dec", value: 2390 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={jobRequestCostData} barSize={20}>
        <XAxis dataKey="name" style={{ fontSize: "15px" }} />
        <YAxis style={{ fontSize: "15px" }} />
        <Tooltip cursor={{ fill: "#fcb53b40" }} />
        {/* CHnage this color to change the hover shade */}
        <Bar
          dataKey="value"
          fill="#fcb53b"
          activeBar={{
            fill: "#fcb53b",
            stroke: "none",
            strokeWidth: 0,
          }}
          style={{ cursor: "pointer" }}
          //   onClick={(jobRequestCostData, index) => {
          //     // invoke your function
          //     handleBarClick(jobRequestCostData, index);
          //   }}
          //
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
export default CostYTDChart;
