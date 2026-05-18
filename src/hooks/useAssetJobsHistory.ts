import { useMemo } from "react";
import { assetHistoryConfig } from "@/lib/assetHistoryConfig";
import type { CardData, MetricValues } from "@/schemas/dashboardSchema";
import type { AssetHistoryResponse } from "@/schemas/assetSchemas";

import { useGetAll } from "@/utils/api";
import useGlobalContext from "@/context/useGlobalContext";

type AssetHistoryCardConfig = {
  cardData: CardData;
  metrics: MetricValues;
};
export const useAssetJobsHistory = (): {
  cards: AssetHistoryCardConfig[];
  isPending: boolean;
  barcode_id: string;
} => {
  const { selectedRowId } = useGlobalContext();

  const { data, isPending } = useGetAll<AssetHistoryResponse>({
    resourcePath: `assets-data/${selectedRowId}/history`,
    queryKey: ["asset", "jobs-history", selectedRowId],
  });

  const barcode_id = data?.barcode_id ?? "";

  const cards: AssetHistoryCardConfig[] = useMemo(
    () =>
      assetHistoryConfig.map((config) => ({
        cardData: config,
        metrics: data?.metrics?.[config.id as keyof typeof data.metrics] ?? {
          value: 0,
        },
      })),
    [data],
  );

  return { cards, isPending, barcode_id };
};
