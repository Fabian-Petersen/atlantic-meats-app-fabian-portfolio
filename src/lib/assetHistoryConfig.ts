import {
  Wallet,
  FileBarChart,
  ClipboardClock,
  Loader,
  CircleCheckBig,
  DollarSign,
} from "lucide-react";

import type { CardData } from "@/schemas/dashboardSchema";
export const assetHistoryConfig: CardData[] = [
  {
    id: "pendingRequests",
    title: "Pending ",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
    titleIcon: ClipboardClock,
  },
  {
    id: "inProgressRequests",
    title: "In Progress",
    icon: FileBarChart,
    color: "#ffc658",
    bgColor: "rgba(255, 198, 88, 0.1)",
    titleIcon: Loader,
  },
  {
    id: "completedRequests",
    title: "Total Completed",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
    titleIcon: CircleCheckBig,
  },
  {
    id: "totalCostYTD",
    title: "Total Cost YTD",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
    titleIcon: DollarSign,
  },
];

// interface AssetWorkHistoryMetrics {
//   assetId: string;
//   period: { from: Date; to: Date };

//   reliability: {
//     mtbf: number;           // hours
//     mttr: number;           // hours
//     availability: number;   // 0–100 %
//     failureCount: number;
//   };

//   maintenance: {
//     totalWorkOrders: number;
//     byType: Record<'corrective' | 'preventive' | 'predictive' | 'inspection', number>;
//     pmComplianceRate: number;     // 0–100 %
//     plannedRatio: number;         // 0–100 %
//     openBacklog: number;
//   };

//   cost: {
//     totalCost: number;
//     laborCost: number;
//     partsCost: number;
//     contractorCost: number;
//     costPerWorkOrder: number;
//     costAsPercentOfRAV: number;
//   };

//   efficiency: {
//     avgResponseTimeHours: number;
//     firstTimeFixRate: number;     // 0–100 %
//     avgWrenchTimePercent: number;
//   };
// }
