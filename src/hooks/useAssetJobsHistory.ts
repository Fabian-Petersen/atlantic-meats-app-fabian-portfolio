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

type AssetHistoryProps = {
  cards: AssetHistoryCardConfig[];
  isPending: boolean;
  hasHistory: boolean;
  isError: boolean;
  data: AssetHistoryResponse | undefined;
};
export const useAssetJobsHistory = (): AssetHistoryProps => {
  const { selectedRowId } = useGlobalContext();

  const { data, isPending, isError } = useGetAll<AssetHistoryResponse>({
    resourcePath: `assets-data/${selectedRowId}/history`,
    queryKey: ["asset", "jobs-history", selectedRowId],
  });

  const hasHistory = (data?.history?.length ?? 0) > 0;

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

  return { cards, isPending, hasHistory, isError, data };
};
