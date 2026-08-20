import { useState } from "react";
import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

import { PieChartSkeleton } from "../charts/PieChartSkeleton";
import ChartHeading from "../ChartHeading";
import AssetVerificationStatusPieChart from "../charts/AssetVerificationStatusPieChart";

import { useUserRole } from "@/hooks/useUserRole";
import { useVerificationData } from "@/hooks/useVerificationData";
import { STORE_OPTIONS, type StoreValue } from "@/data/stores";
import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";
import { HeadingSkeleton } from "../charts/HeadingSkeleton";

type Props = {
  data?: AssetVerificationSummary;
  isPending: boolean;
};

function VerificationStatus({ data, isPending }: Props) {
  const role = useUserRole();
  const [selectedStore, setSelectedStore] = useState<StoreValue>("all");

  const { data: adminStoreData, isPending: isAdminPending } =
    useVerificationData(role === "admin" ? selectedStore : undefined);

  const activeData = role === "admin" ? adminStoreData : data;
  const activeIsPending = role === "admin" ? isAdminPending : isPending;

  return (
    <section
      className={cn(
        sharedStyles.chartParent,
        "xl:col-span-1 flex flex-col",
        "dark:text-(--clr-textDark) text-(--clr-textLight)",
        "relative",
      )}
    >
      <div className="flex items-center justify-between shrink-0">
        {isPending ? (
          <HeadingSkeleton className="w-48" />
        ) : (
          <ChartHeading
            title="Asset Verification Status"
            className={cn(sharedStyles.chartHeading)}
          />
        )}
        {role === "admin" ? (
          isPending ? (
            <HeadingSkeleton className="w-12" />
          ) : (
            <select
              value={selectedStore}
              onChange={(e) => {
                const location = e.target.value as StoreValue;
                // console.log("SELECT CHANGED:", location);
                setSelectedStore(location);
              }}
              className={sharedStyles.chartSelectBtn}
            >
              {STORE_OPTIONS.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          )
        ) : (
          <span className="text-sm text-(--clr-textMuted) capitalize">
            {data?.location}
          </span>
        )}
      </div>

      <div className="w-full h-64 shrink-0">
        {activeIsPending || !activeData ? (
          <PieChartSkeleton />
        ) : (
          <AssetVerificationStatusPieChart data={activeData} />
        )}
      </div>
    </section>
  );
}

export default VerificationStatus;
