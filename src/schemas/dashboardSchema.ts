import * as z from "zod";
import type { LucideIcon } from "lucide-react";
import { PureComponent } from "react";

// $ Schema to create card item
export const cardItemSchema = z.object({
  title: z.string(),
  color: z.string(),
  bgColor: z.string(),
});

type Metrics<T extends string> = Record<
  T,
  {
    value: number;
    valueChange: number;
  }
>;

// $ Metrics Key for each job card
export type JobsMetricKey = "totalRequests" | "openRequests";
export type JobMetrics = Metrics<JobsMetricKey>;

// $ Metrics Key for each asset card
export type AssetMetricKey = "totalAssets";
export type AssetMetrics = Metrics<AssetMetricKey>;

// $ Metrics Key for each action card
export type ActionMetricKey = "totalCompleted";
export type ActionMetrics = Metrics<ActionMetricKey>;

export type JobCardItem = z.infer<typeof cardItemSchema> & {
  id: JobsMetricKey;
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
