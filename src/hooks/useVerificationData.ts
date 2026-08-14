import { useGetAll } from "@/utils/api";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

// location is only ever sent for admins choosing a specific location;
// managers get their own location resolved server-side from claims regardless.
export function useVerificationData(location: string | undefined) {
  console.log("useVerificationData:", {
    location,
    queryKey: ["dashboard", "verification", location ?? "self"],
    params: location && location !== "all" ? { location } : undefined,
  });
  console.log("hook-location:", location);
  const { data, isPending } = useGetAll<AssetVerificationSummary>({
    resourcePath: "api/dashboard/metrics/verification",
    queryKey: ["dashboard", "verification", location ?? "self"],
    params: location && location !== "all" ? { location } : undefined,
    enabled: !!location,
  });

  console.log("hook-data:", data);
  return { data, isPending };
}
