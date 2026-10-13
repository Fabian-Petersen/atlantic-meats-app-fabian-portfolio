import { useGetAll } from "@/utils/api";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

// Admins/technicians use this endpoint for both all-site and specific-location
// summaries. Managers/users use the dashboard summary scoped by the backend.
export function useVerificationData(location: string | undefined) {
  const { data, isPending } = useGetAll<AssetVerificationSummary>({
    resourcePath: "api/dashboard/metrics/verification",
    queryKey: ["dashboard", "verification", location ?? "self"],
    params: location && location !== "all" ? { location } : undefined,
    enabled: location !== undefined,
  });

  return { data, isPending };
}
