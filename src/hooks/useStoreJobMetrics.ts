import { useGetAll } from "@/utils/api";
import type { StoreJobMetricsByMonth } from "@/schemas/dashboardSchema";

export const useStoreJobMetrics = (
  year: string | null,
  location: string | null,
  status: string | null,
): {
  data: StoreJobMetricsByMonth | undefined;
  isPending: boolean;
  isError: boolean;
} => {
  const { data, isPending, isError } = useGetAll<StoreJobMetricsByMonth>({
    resourcePath: "api/dashboard/metrics/charts",
    queryKey: [
      "dashboard",
      "storeJobsByYear",
      "charts",
      year,
      location,
      status,
    ],
    params: {
      year,
      location,
      status,
    },
    enabled: !!year && !!location && !!status,
  });

  return {
    data,
    isPending,
    isError,
  };
};
