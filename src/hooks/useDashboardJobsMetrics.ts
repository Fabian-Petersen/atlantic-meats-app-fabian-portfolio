import { useMemo } from "react";
import { dashboardCardConfig } from "@/lib/dashboardCardConfig";
import type {
  DashboardMetrics,
  MetricCardConfig,
} from "@/schemas/dashboardSchema";

/**
 * Transforms dashboard card metrics received from the backend into the
 * `MetricCardConfig[]` structure required by `CardContainer`.
 *
 * The hook combines:
 * - `dashboardCardConfig` — static frontend card configuration such as
 *   titles, icons, styling, and card IDs.
 * - `data` — dynamic metric values returned by the dashboard API.
 *
 * The backend is responsible only for providing metric data. The frontend
 * remains responsible for combining that data with the presentation
 * configuration used by the dashboard cards.
 *
 * @param data - The `cards` portion of the dashboard metrics API response.
 *
 * @returns An array of `MetricCardConfig` objects ready to be passed to
 *   `CardContainer`.
 *
 * @example
 * ```tsx
 * const { data: metrics, isPending } = useGetAll<DashboardMetrics>({
 *   resourcePath: "api/dashboard/metrics",
 *   queryKey: ["metrics", "all"],
 * });
 *
 * const cards = useDashboardJobsMetrics(metrics?.cards);
 *
 * return (
 *   <CardContainer
 *     cards={cards}
 *     isPending={isPending}
 *   />
 * );
 * ```
 *
 * @example
 * Backend data:
 * ```ts
 * {
 *   pendingRequests: {
 *     value: 4,
 *     valueChange: -100,
 *   },
 *   approvedRequests: {
 *     value: 0,
 *     valueChange: 0,
 *   },
 * }
 * ```
 *
 * The hook combines each metric with its matching frontend card configuration:
 * ```ts
 * {
 *   cardData: dashboardCardConfigItem,
 *   metrics: {
 *     value: 4,
 *     valueChange: -100,
 *   },
 * }
 * ```
 */
export const useDashboardJobsMetrics = (
  data?: DashboardMetrics["cards"],
): MetricCardConfig[] => {
  return useMemo(
    () =>
      dashboardCardConfig.map((config) => ({
        cardData: config,
        metrics: data?.[config.id as keyof DashboardMetrics["cards"]] ?? {
          value: 0,
          valueChange: 0,
        },
      })),
    [data],
  );
};
// import { useMemo } from "react";
// import { dashboardCardConfig } from "@/lib/dashboardCardConfig";
// import type {
//   DashboardMetrics,
//   MetricCardConfig,
// } from "@/schemas/dashboardSchema";
// import { useGetAll } from "@/utils/api";

// export const useDashboardJobsMetrics = (): {
//   cards: MetricCardConfig[];
//   isPending: boolean;
// } => {
//   const { data, isPending } = useGetAll<DashboardMetrics>({
//     resourcePath: "api/dashboard/metrics/jobs",
//     queryKey: ["dashboard", "metrics"],
//   });

//   const cards: MetricCardConfig[] = useMemo(
//     () =>
//       dashboardCardConfig.map((config) => ({
//         cardData: config,
//         metrics: data?.[config.id as keyof DashboardMetrics] ?? {
//           value: 0,
//           valueChange: 0,
//         },
//       })),
//     [data],
//   );

//   return { cards, isPending };
// };
