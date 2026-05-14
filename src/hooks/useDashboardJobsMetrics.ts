import { useMemo } from "react";
import { dashboardCardConfig } from "@/lib/dashboardCardConfig";
import type {
  DashboardMetricsResponse,
  MetricCardConfig,
} from "@/schemas/dashboardSchema";
import { useGetAll } from "@/utils/api";

export const useDashboardJobsMetrics = (): {
  cards: MetricCardConfig[];
  isPending: boolean;
} => {
  const { data, isPending } = useGetAll<DashboardMetricsResponse>({
    resourcePath: "dashboard/metrics/jobs",
    queryKey: ["dashboard", "metrics"],
  });

  const cards: MetricCardConfig[] = useMemo(
    () =>
      dashboardCardConfig.map((config) => ({
        cardData: config,
        metrics: data?.[config.id as keyof DashboardMetricsResponse] ?? {
          value: 0,
          valueChange: 0,
        },
      })),
    [data],
  );

  return { cards, isPending };
};
