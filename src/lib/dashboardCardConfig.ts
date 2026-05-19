import {
  Wallet,
  FileCheck2,
  FileBarChart,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  Clock,
  Loader,
} from "lucide-react";

import type { CardData } from "@/schemas/dashboardSchema";

export const dashboardCardConfig: CardData[] = [
  {
    id: "pendingRequests",
    title: "Pending Requests",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
    titleIcon: Clock,
  },

  {
    id: "approvedRequests",
    title: "Open Requests",
    icon: FileCheck2,
    color: "#82ca9d",
    bgColor: "rgba(130, 202, 157, 0.1)",
    titleIcon: Loader,
  },

  {
    id: "totalCompleted",
    title: "Completed Jobs",
    icon: FileBarChart,
    color: "#ffc658",
    bgColor: "rgba(255, 198, 88, 0.1)",
    titleIcon: CheckCircle,
  },
  {
    id: "overdueRequests",
    title: "Overdue Requests",
    icon: AlertTriangle,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    titleIcon: AlertOctagon,
  },

  // {
  //   id: "totalAssets",
  //   title: "Total Assets",
  //   icon: Users2,
  //   color: "#ff8042",
  //   bgColor: "rgba(255, 128, 66, 0.10)",
  // },
];
