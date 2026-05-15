import { Wallet, FileBarChart } from "lucide-react";

import type { CardData } from "@/schemas/dashboardSchema";
//  totalRequests: z.number,
//     completedRequests: z.number,
//     inProgressRequests: z.number,
//     pendingRequests: z.number,
export const assetHistoryConfig: CardData[] = [
  {
    id: "pendingRequests",
    title: "Requests: Pending ",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
  },
  {
    id: "inProgressRequests",
    title: "Requests: In Progress",
    icon: FileBarChart,
    color: "#ffc658",
    bgColor: "rgba(255, 198, 88, 0.1)",
  },
  {
    id: "completedRequests",
    title: "Requests: Total Completed",
    icon: Wallet,
    color: "#8884d8",
    bgColor: "rgba(136, 132, 216, 0.1)",
  },

  // {
  //   id: "totalCost",
  //   title: "Overdue Requests",
  //   icon: Currency,
  //   color: "#ef4444",
  //   bgColor: "rgba(239, 68, 68, 0.1)",
  // },
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
