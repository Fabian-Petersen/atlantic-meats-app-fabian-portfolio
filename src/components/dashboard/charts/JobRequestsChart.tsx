import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// type Props = {
//   payload: {
//     name: string;
//     value: number;
//   };
// };

function JobRequestsChart() {
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

  // const handleBarClick = (data: Props) => {
  //   console.log("Month:", data.name);
  //   console.log("index:", data.payload);
  // };

  return (
    <div className="h-[300px] w-full outline-none focus:outline-none focus:ring-0">
      <ResponsiveContainer width="100%" height="90%">
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
    </div>
  );
}
// hover:bg-primary/20
export default JobRequestsChart;
