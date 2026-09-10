import { useMemo } from "react";
import { assetHistoryConfig } from "@/lib/assetHistoryConfig";
import type { CardData, MetricValues } from "@/schemas/dashboardSchema";
import type { AssetHistoryResponse } from "@/schemas/assetSchemas";

import { useGetAll } from "@/utils/api";

type AssetHistoryCardConfig = {
  cardData: CardData;
  metrics: MetricValues;
};

type AssetHistoryProps = {
  cards: AssetHistoryCardConfig[];
  isPending: boolean;
  hasHistory: boolean;
  isError: boolean;
  data: AssetHistoryResponse | undefined;
  retry: () => void;
};
export const useAssetJobsHistory = (assetId?: string): AssetHistoryProps => {
  const { data, isPending, isError, refetch } = useGetAll<AssetHistoryResponse>(
    {
      resourcePath: `api/assets/${encodeURIComponent(assetId ?? "")}/history`,
      queryKey: ["asset", "jobs-history", assetId],
      enabled: Boolean(assetId),
    },
  );

  const hasHistory = (data?.history?.length ?? 0) > 0;
  // console.log("hook-assets-history:", data);

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

  return {
    cards,
    isPending,
    hasHistory,
    isError,
    data,
    retry: () => {
      void refetch();
    },
  };
};
