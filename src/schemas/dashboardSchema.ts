import * as z from "zod";
import type { LucideIcon } from "lucide-react";
import { PureComponent } from "react";
// import { transferWorkflowResponseSchema } from "@/schemas/transfersSchemas";
// import { assetHistoryResponseSchema } from "@/schemas/assetSchemas";
import { metricValuesSchema, cardMetricsSchema } from "./metricSchemas";

// $ Schema to create card item
export const cardItemSchema = z.object({
  title: z.string(),
  color: z.string(),
  bgColor: z.string(),
});

/* // $ ------------------ Dashboard Charts Schema & Types ------------------ */
export const dbCostByYearResponseSchema = z.record(
  z.string(),
  z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    }),
  ),
);

export const verificationStatusSchema = z.enum([
  "Verified",
  "Due",
  "Overdue",
  "Not Verified",
]);

export const verificationSummarySchema = z.object({
  compliance: z.number(),
  location: z.string(),
  total: z.number(),
  statuses: z.array(
    z.object({
      name: verificationStatusSchema,
      value: z.number(),
    }),
  ),
});

export const dashboardMetricKeySchema = z.enum([
  "pendingRequests",
  "approvedRequests",
  "overdueRequests",
  "totalCompleted",
  "inProgressRequests",
  "completedRequests",
  "totalAssets",
  "total_cost",
]);

export const metricCardConfigSchema = z.object({
  cardData: z.object({
    id: dashboardMetricKeySchema,
    title: z.string(),
    color: z.string(),
    bgColor: z.string(),
    icon: z.custom<LucideIcon>(),
    titleIcon: z.custom<LucideIcon>(),
  }),
  metrics: metricValuesSchema,
});

/* -------------------------------------------------------------------------- */
/*                   Maintenance Cost Chart Schema and Types                  */
/* -------------------------------------------------------------------------- */

export const storeCostSchema = z.object({
  parts: z.number(),
  sundries: z.number(),
  contractor: z.number(),
  total: z.number(),
});

export const storeByMonthSchema = z.object({
  request_id: z.string(),
  action_id: z.string(),
  assetID: z.string(),
  date: z.string(),
  costs: storeCostSchema,
});

export const storeJobsByMonthSchema = z.object({
  location: z.string(),
  year: z.string(),
  month: z.string(),
  total_jobs: z.number(),
  total_cost: z.number(),
  jobs: z.array(storeByMonthSchema),
});

export const userDashboardSchema = z.object({
  role: z.enum(["admin", "manager", "user", "maintenance"]),
  location: z.string(),
});
export type StoreJobsByMonth = z.infer<typeof storeJobsByMonthSchema>;

export const jobSchema = storeByMonthSchema.pick({
  assetID: true,
  costs: true,
});

export type JobCostItem = z.infer<typeof jobSchema>;

export const allYearlyCostPointSchema = z.object({
  name: z.string(),
  value: z.number(),
});
export type AllYearlyCostPoint = z.infer<typeof allYearlyCostPointSchema>;

export const costByYearSchema = z.record(
  z.string(),
  z.array(allYearlyCostPointSchema),
);

export type CostByYear = Record<string, AllYearlyCostPoint[]>;

// schema for the dashboard metrics item: getDashboardMetrics
export const dashboardMetricSchema = z.object({
  user: userDashboardSchema,
  storeCost: costByYearSchema,
  cards: cardMetricsSchema,
  verification: verificationSummarySchema,
  // assets: assetHistoryResponseSchema,
  // transfers: transferWorkflowResponseSchema,
});

export type AssetVerificationSummary = z.infer<
  typeof verificationSummarySchema
>;

export type StoreCostByYear = z.infer<typeof dbCostByYearResponseSchema>;

/**
 * Type for the API response for all stores annual cost
 */

export type MonthlyCostPoint = {
  name: string;
  value: number;
};

/**
 * Type for the API response for a single store annual cost
 */
export type LocationMonthlyCosts = {
  location: string;
  year: string;
  data: Record<string, MonthlyCostPoint[]>;
};

export type DashboardMetricKey = z.infer<typeof dashboardMetricKeySchema>;

/* // $ ------------------- Dashboard Cards Schema & Types ------------------ */
export type MetricValues = z.infer<typeof metricValuesSchema>;

export type CardData = {
  id: DashboardMetricKey;
  title: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
  titleIcon: LucideIcon;
};

// export type MetricCardConfig = {
//   cardData: CardData;
//   metrics: MetricValues;
// };

export type MetricCardConfig = z.infer<typeof metricCardConfigSchema>;

export type DashboardMetricsResponse = Record<DashboardMetricKey, MetricValues>;

/* -------------------------------- Old Types ------------------------------- */

type Metrics<T extends string> = Record<T, MetricValues>;

// $ Metrics Key for pending jobs card
export type PendingJobsMetricKey = "pendingRequests";
export type PendingJobMetrics = Metrics<PendingJobsMetricKey>;

// $ Metrics Key for approved jobs card
export type ApprovedJobsMetricKey = "approvedRequests";
export type ApprovedJobMetrics = Metrics<ApprovedJobsMetricKey>;

// $ Metrics Key for approved jobs card
export type OverdueJobsMetricKey = "overdueRequests";
export type OverdueJobMetrics = Metrics<OverdueJobsMetricKey>;

// $ Metrics Key for each asset card
export type AssetMetricKey = "totalAssets";
export type AssetMetrics = Metrics<AssetMetricKey>;

// $ Metrics Key for each action card
export type ActionMetricKey = "totalCompleted";
export type ActionMetrics = Metrics<ActionMetricKey>;

// $ Metrics Key for all Metrics
export type DashboardMetrics = z.infer<typeof dashboardMetricSchema>;

export type PendingJobCardItem = z.infer<typeof cardItemSchema> & {
  id: PendingJobsMetricKey;
  icon: LucideIcon;
};

export type ApprovedJobCardItem = z.infer<typeof cardItemSchema> & {
  id: ApprovedJobsMetricKey;
  icon: LucideIcon;
};

export type OverdueJobCardItem = z.infer<typeof cardItemSchema> & {
  id: OverdueJobsMetricKey;
  icon: LucideIcon;
};

export type AssetCardItem = z.infer<typeof cardItemSchema> & {
  id: AssetMetricKey;
  icon: LucideIcon;
};

export type ActionCardItem = z.infer<typeof cardItemSchema> & {
  id: ActionMetricKey;
  icon: LucideIcon;
};

// Pie Chart
export default class OpenRequestsPieChart extends PureComponent {
  state = {
    activeIndex: -1,
  };
}
