import { useGetAll } from "@/utils/api";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

// location is only ever sent for admins choosing a specific location;
// managers get their own location resolved server-side from claims regardless.
export function useVerificationData(location: string | undefined) {
  const { data, isPending } = useGetAll<AssetVerificationSummary>({
    resourcePath: "api/dashboard/metrics/verification",
    queryKey: ["dashboard", "verification", location ?? "self"],
    params: location && location !== "all" ? { location } : undefined,
    enabled: !!location,
  });

  return { data, isPending };
}
