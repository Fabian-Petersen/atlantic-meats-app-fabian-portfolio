// $ This hook return the assets from the database to be used in e.g. the maintenance-request page to populate the assets select input for equipment.
import { useGetAll } from "@/utils/api";
import { type AssetFormValues } from "../schemas";

export const useGetAssetList = () => {
  const { data, isPending, isError } = useGetAll<AssetFormValues>("asset", [
    "assetRequests",
  ]);

  return { assets: data ?? [], isPending, isError };
};
