import { Wallet, FileCheck2, Users2, FileBarChart } from "lucide-react";
import type { JobCardItem, AssetCardItem, ActionCardItem } from "@/schemas";

export const jobsCardData: JobCardItem[] = [
  {
    id: "totalRequests",
    title: "Total Requests",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
  },
  {
    id: "openRequests",
    title: "Open Requests",
    icon: FileCheck2,
    color: "#82ca9d",
    bgColor: "rgba(130, 202, 157, 0.1)",
  },
];

export const assetsCardData: AssetCardItem[] = [
  {
    id: "totalAssets",
    title: "Total Assets",
    icon: Users2,
    color: "#ff8042",
    bgColor: "rgba(255, 128, 66, 0.10)",
  },
];

export const actionCardData: ActionCardItem[] = [
  {
    id: "totalCompleted",
    title: "Completed Requests",
    icon: FileBarChart,
    color: "#ffc658",
    bgColor: "rgba(255, 198, 88, 0.1)",
  },
];
