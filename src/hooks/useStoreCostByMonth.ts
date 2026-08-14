import { useGetAll } from "@/utils/api";
import type { StoreJobsByMonth } from "@/schemas/dashboardSchema";

export const useStoreCostByMonth = (
  year: string | null,
  location: string | null,
  month: string | null,
): {
  data: StoreJobsByMonth | undefined;
  isPending: boolean;
  isError: boolean;
} => {
  const { data, isPending, isError } = useGetAll<StoreJobsByMonth>({
    resourcePath: "api/dashboard/metrics/charts",
    queryKey: [
      "dashboard",
      "storeJobsByMonth",
      "charts",
      year,
      location,
      month,
    ],
    params: {
      year,
      location,
      month,
    },
    enabled: !!year && !!location && !!month,
  });

  return {
    data,
    isPending,
    isError,
  };
};
