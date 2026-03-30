import * as z from "zod";
import type { LucideIcon } from "lucide-react";
import { PureComponent } from "react";

// $ Schema to create card item
export const cardItemSchema = z.object({
  title: z.string(),
  color: z.string(),
  bgColor: z.string(),
});

export type MetricItem = {
  value: number;
  valueChange: number;
};

type Metrics<T extends string> = Record<T, MetricItem>;

export type CardData<T extends string> = {
  id: T;
  title: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
};

export type CardItem<T extends string> = {
  cardData: CardData<T>[];
  metrics: Metrics<T>;
};

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
