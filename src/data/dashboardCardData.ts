import { Wallet, FileCheck2, Users2, FileBarChart } from "lucide-react";
// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
// const COLORS = [
//   "rgba(136, 132, 216, 0.7)", // #8884d8
//   "rgba(130, 202, 157, 0.7)", // #82ca9d
//   "rgba(255, 198, 88, 0.7)", // #ffc658
//   "rgba(255, 128, 66, 0.7)", // #ff8042
// ];
export const dashboardCardData = [
  {
    id: "1",
    title: "total revenue",
    value: 30000,
    valueChange: 70,
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
  },
  {
    id: "2",
    title: "open tasks",
    value: 5,
    valueChange: -40,
    icon: FileCheck2,
    color: "#82ca9d",
    bgColor: "rgba(130, 202, 157, 0.1)",
  },
  {
    id: "3",
    title: "active projects",
    value: 3,
    valueChange: 30,
    icon: FileBarChart,
    color: "#ffc658",
    bgColor: "rgba(255, 198, 88, 0.1)",
  },
  {
    id: "4",
    title: "active customers",
    value: 10,
    valueChange: -20,
    icon: Users2,
    color: "#ff8042",
    bgColor: "rgba(255, 128, 66, 0.10)",
  },
];
