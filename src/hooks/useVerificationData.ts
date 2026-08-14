import { useGetAll } from "@/utils/api";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

// store is only ever sent for admins choosing a specific store;
// managers get their own location resolved server-side from claims regardless.
export function useVerificationData(store: string | undefined) {
  return useGetAll<AssetVerificationSummary>({
    resourcePath: "api/dashboard/metrics/verification",
    queryKey: ["dashboard", "verification", store ?? "self"],
    params: store && store !== "all" ? { store } : undefined,
  });
}
