import { useGetAll } from "@/utils/api";
import type { CostByYear } from "@/components/dashboard/charts/CostChart";

/**
 * useAllStoresCostByYear
 *
 * React hook that fetches aggregated store cost data grouped by year.
 * The data is typically used for charting (e.g. Recharts bar/line charts)
 * where each year contains a list of cost points per location/store.
 *
 * Data shape:
 *
 * type CostPoint = {
 *   name: string;   // Store/location name (e.g. "Bellville")
 *   value: number;  // Total cost for that store in the given year
 * };
 *
 * type CostByYear = Record<string, CostPoint[]>;
 *
 * Example response:
 *
 * {
 *   "2025": [
 *     { "name": "Maitland", "value": 12500 },
 *     { "name": "Bellville", "value": 9800 }
 *   ],
 *   "2026": [
 *     { "name": "Maitland", "value": 18740 },
 *     { "name": "Bellville", "value": 12620 }
 *   ]
 * }
 *
 * Returns:
 *
 * @returns {
 *   data: CostByYear | undefined; // Grouped cost data by year (undefined while loading)
 *   isPending: boolean;           // True while request is in progress
 *   isError: boolean;             // True if the request failed
 * }
 *
 * Example usage:
 *
 * const { data, isPending, isError } = useAllStoresCostByYear();
 *
 * if (isPending) return <LoadingSpinner />;
 * if (isError) return <ErrorState />;
 *
 * return (
 *   <CostChart data={data ?? {}} />
 * );
 */
export const useAllStoresCostByYear = (): {
  data: CostByYear | undefined;
  isPending: boolean;
  isError: boolean;
} => {
  const { data, isPending, isError } = useGetAll<CostByYear>({
    resourcePath: "api/dashboard/metrics/charts",
    queryKey: ["dashboard", "storeCostByYear", "charts"],
  });

  return { data, isPending, isError };
};
