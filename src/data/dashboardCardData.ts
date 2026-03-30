import {
  Wallet,
  FileCheck2,
  Users2,
  FileBarChart,
  AlertTriangle,
} from "lucide-react";
import type {
  AssetCardItem,
  OverdueJobCardItem,
  PendingJobCardItem,
  ApprovedJobCardItem,
} from "@/schemas";
import type { ActionCardItem } from "@/schemas/dashboardSchema";

export const jobsPendingCardData: PendingJobCardItem[] = [
  {
    id: "pendingRequests",
    title: "Pending Requests",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
  },
];

export const jobsApprovedCardData: ApprovedJobCardItem[] = [
  {
    id: "approvedRequests",
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
    title: "Completed Jobs",
    icon: FileBarChart,
    color: "#ffc658",
    bgColor: "rgba(255, 198, 88, 0.1)",
  },
];

export const jobsOverdueCardData: OverdueJobCardItem[] = [
  {
    id: "overdueRequests",
    title: "Overdue Requests",
    icon: AlertTriangle,
    color: "#ef4444", // Tailwind red-500
    bgColor: "rgba(239, 68, 68, 0.1)", // soft red background
  },
];
