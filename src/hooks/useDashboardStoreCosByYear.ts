// import type { DashboardJobsStoreCostByYearResponse } from "@/schemas/dashboardSchema";
import { useGetAll } from "@/utils/api";
import type { CostPoint } from "@/components/dashboard/charts/CostChart";

export const useDashboardJobsStoreCostByYear = (): {
  data: CostPoint[] | undefined;
  isPending: boolean;
  isError: boolean;
} => {
  const { data, isPending, isError } = useGetAll<CostPoint[]>({
    resourcePath: "dashboard/metrics/charts",
    queryKey: ["dashboard", "storeCostByYear", "charts"],
  });

  return { data, isPending, isError };
};
