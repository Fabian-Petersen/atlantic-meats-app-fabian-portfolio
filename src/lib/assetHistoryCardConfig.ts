import { Wallet, FileCheck2, Currency, FileBarChart } from "lucide-react";

import type { CardData } from "@/schemas/dashboardSchema";

export const assetHistoryCardConfig: CardData[] = [
  {
    id: "pendingRequests",
    title: "Pending Requests",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
  },
  {
    id: "approvedRequests",
    title: "Open Requests",
    icon: FileCheck2,
    color: "#82ca9d",
    bgColor: "rgba(130, 202, 157, 0.1)",
  },
  {
    id: "totalCompleted",
    title: "Completed Jobs",
    icon: FileBarChart,
    color: "#ffc658",
    bgColor: "rgba(255, 198, 88, 0.1)",
  },
  {
    id: "totalCost",
    title: "Overdue Requests",
    icon: Currency,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
];
