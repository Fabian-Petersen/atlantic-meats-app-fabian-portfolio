// $ This hook return the assets from the database to be used in e.g. the maintenance-request page to populate the assets select input for equipment.
import { useGetAll } from "@/utils/api";
import { type AssetRequestFormValues } from "../schemas";

export const useGetAssetList = () => {
  const { data, isPending, isError } = useGetAll<AssetRequestFormValues>(
    "asset",
    ["getAllAssets"],
  );

  return { data, isPending, isError };
};
