import { useEffect } from "react";

import type {
  AssetEquipmentResponse,
  AssetLocationHierarchyResponse,
  AssetLocationsResponse,
  AssetOptionsResponse,
} from "@/schemas/assetSchemas";
import { useGetAll } from "@/utils/api";

const RESOURCE_PATH = "api/assets/options" as const;

type UseAssetOptionsParams = {
  location?: string;
  area?: string;
  equipment?: string;
};

/**
 * Loads the asset-selection hierarchy from the API one level at a time.
 * Child requests remain disabled until their parent selection is available.
 */
export const useAssetOptions = ({
  location,
  area,
  equipment,
}: UseAssetOptionsParams = {}) => {
  const locationsQuery = useGetAll<AssetLocationsResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: ["assets", "options", "locations"],
  });

  const areasQuery = useGetAll<AssetLocationHierarchyResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: ["assets", "options", "location", location],
    params: { location },
    enabled: Boolean(location),
  });

  useEffect(() => {
    if (!location) return;

    console.log("[useAssetOptions] Requesting areas for location:", location);
  }, [location]);

  useEffect(() => {
    if (!location || !areasQuery.data) return;

    console.log("[useAssetOptions] Areas response:", {
      requestedLocation: location,
      response: areasQuery.data,
    });
  }, [location, areasQuery.data]);

  useEffect(() => {
    if (!location || !areasQuery.error) return;

    console.error("[useAssetOptions] Areas request failed:", {
      requestedLocation: location,
      error: areasQuery.error,
    });
  }, [location, areasQuery.error]);

  const equipmentQuery = useGetAll<AssetEquipmentResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: ["assets", "options", "area", location, area],
    params: { location, area },
    enabled: Boolean(location && area),
  });

  const assetsQuery = useGetAll<AssetOptionsResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: ["assets", "options", "asset", location, area, equipment],
    params: { location, area, equipment },
    enabled: Boolean(location && area && equipment),
  });

  return {
    locationsQuery,
    areasQuery,
    equipmentQuery,
    assetsQuery,
  };
};
