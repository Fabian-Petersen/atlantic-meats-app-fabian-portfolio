import type { AssetAPIResponse, AssetMetrics } from "@/schemas";

export const getAssetCardValues = (
  assets: AssetAPIResponse[],
  // location: string,
): AssetMetrics => {
  const totalAssets = assets.length;

  return {
    totalAssets: {
      value: totalAssets,
      valueChange: 0,
    },
  };
};
