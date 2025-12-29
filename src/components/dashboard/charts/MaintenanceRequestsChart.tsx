import ChartHeading from "../ChartHeading";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MaintenanceRequestsChart() {
  const revenueData = [
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
    <>
      <ChartHeading title="Monthly Maintenance Requests" />
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={revenueData} barSize={10}>
          <XAxis dataKey="name" style={{ fontSize: "15px" }} />
          <YAxis style={{ fontSize: "15px" }} />
          <Tooltip />
          <Bar dataKey="value" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default MaintenanceRequestsChart;
