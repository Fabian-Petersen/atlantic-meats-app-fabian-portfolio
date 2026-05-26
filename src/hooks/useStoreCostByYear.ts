import { useGetAll } from "@/utils/api";
import type { LocationMonthlyCosts } from "@/schemas/dashboardSchema";

export const useStoreCostByYear = (
  year: string | null,
  location: string | null,
): {
  data: LocationMonthlyCosts | undefined;
  isPending: boolean;
  isError: boolean;
} => {
  const { data, isPending, isError } = useGetAll<LocationMonthlyCosts>({
    resourcePath: "api/dashboard/metrics/charts",
    queryKey: ["dashboard", "storeCostByYear", "charts", year, location],
    params: { year, location },
    enabled: !!year && !!location, //skip fetch until both are set
  });

  return { data, isPending, isError };
};
