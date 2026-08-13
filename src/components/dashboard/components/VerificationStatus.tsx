import { sharedStyles } from "@/styles/shared";
import { cn } from "@/lib/utils";

import { PieChartSkeleton } from "../charts/PieChartSkeleton";
import ChartHeading from "../ChartHeading";

import type { AssetVerificationSummary } from "@/schemas/dashboardSchema";
import AssetVerificationStatusPieChart from "../charts/AssetVerificationStatusPieChart";

type Props = {
  isPending: boolean;
  data: AssetVerificationSummary;
};

function VerificationStatus({ isPending, data }: Props) {
  return (
    <section
      className={cn(
        sharedStyles.chartParent,
        "xl:col-span-1",
        "dark:text-(--clr-textDark) text-(--clr-textLight)",
      )}
    >
      {isPending ? (
        <PieChartSkeleton />
      ) : (
        <div className="flex items-center justify-between border border-red-500">
          <ChartHeading
            title="Asset Verification Status"
            className={cn(
              sharedStyles.chartHeading,
              "w-full border border-dashed border-red-500",
            )}
          />
          <AssetVerificationStatusPieChart data={data} />
        </div>
      )}
    </section>
  );
}

export default VerificationStatus;
