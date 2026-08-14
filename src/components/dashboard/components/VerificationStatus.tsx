import { useState } from "react";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

import { PieChartSkeleton } from "../charts/PieChartSkeleton";
import ChartHeading from "../ChartHeading";
import AssetVerificationStatusPieChart from "../charts/AssetVerificationStatusPieChart";

import { useUserRole } from "@/hooks/useUserRole";
// import { useVerificationData } from "@/hooks/useVerificationData";
import { STORE_OPTIONS, type StoreValue } from "@/data/stores";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";

type Props = {
  data?: AssetVerificationSummary;
  isPending: boolean;
};

function VerificationStatus({ data, isPending }: Props) {
  const role = useUserRole();
  const [selectedStore, setSelectedStore] = useState<StoreValue>("all");

  // const { data, isPending } = useVerificationData(
  //   role === "admin" ? selectedStore : undefined,
  // );

  return (
    <section
      className={cn(
        sharedStyles.chartParent,
        "xl:col-span-1",
        "dark:text-(--clr-textDark) text-(--clr-textLight)",
      )}
    >
      <div className="flex items-center justify-between">
        <ChartHeading
          title="Asset Verification Status"
          className={cn(sharedStyles.chartHeading)}
        />

        {role === "admin" ? (
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value as StoreValue)}
            className="text-sm base-select border border-gray-200 py-2 px-1 rounded-sm"
          >
            {STORE_OPTIONS.map((store) => (
              <option key={store.value} value={store.value}>
                {store.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-(--clr-textMuted)">
            {data?.location}
          </span>
        )}
      </div>

      {isPending || !data ? (
        <PieChartSkeleton />
      ) : (
        <div className="flex-1 min-h-60">
          <AssetVerificationStatusPieChart data={data} />
        </div>
      )}
    </section>
  );
}

export default VerificationStatus;
