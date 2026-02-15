// $ This hook is used to filter the assets based on the selected location, equipment and assetID in the maintenance request form. It returns the options for the select inputs and a loading state.

import { useMemo, useEffect } from "react";
// import { useGetAssetList } from "./useGetAssetList";
import type { UseFormSetValue } from "react-hook-form";
import type {
  AssetRequestFormValues,
  // AssetsAPIResponse,
  JobRequestFormValues,
} from "@/schemas";

interface Params {
  location?: string;
  assets: AssetRequestFormValues[];
  area?: string;
  equipment?: string;
  assetID?: string;
  setValue: UseFormSetValue<JobRequestFormValues>;
}

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

export const useAssetFilters = ({
  location,
  assets,
  area,
  equipment,
  assetID,
  setValue,
}: Params) => {
  /* ------------------ LOCATION OPTIONS ------------------ */
  const locationOptions = useMemo(() => {
    const unique = Array.from(new Set(assets.map((a) => a.location)));
    return unique.map((l) => ({ label: l, value: l }));
  }, [assets]);

  /* ------------------ FILTER BY LOCATION ------------------ */
  const assetsByLocation = useMemo(() => {
    if (!location) return assets;
    const n = normalize(location);
    return assets?.filter((a) => normalize(a.location) === n);
  }, [assets, location]);

  /* ------------------ AREA OPTIONS ------------------ */
  const areaOptions = useMemo(() => {
    const unique = Array.from(new Set(assetsByLocation?.map((a) => a.area)));
    return unique.map((a) => ({ label: a, value: a }));
  }, [assetsByLocation]);

  /* ------------------ FILTER BY AREA ------------------ */
  const assetsByArea = useMemo(() => {
    if (!area) return assetsByLocation;
    const n = normalize(area);
    return assetsByLocation?.filter((a) => normalize(a.area) === n);
  }, [assetsByLocation, area]);

  /* ------------------ EQUIPMENT OPTIONS ------------------ */
  const equipmentOptions = useMemo(() => {
    const unique = Array.from(new Set(assetsByArea?.map((a) => a.equipment)));
    return unique.map((e) => ({ label: e, value: e }));
  }, [assetsByArea]);

  /* ------------------ FILTER BY EQUIPMENT ------------------ */
  const assetsByEquipment = useMemo(() => {
    if (!equipment) return assetsByArea;
    const n = normalize(equipment);
    return assetsByArea?.filter((a) => normalize(a.equipment) === n);
  }, [assetsByArea, equipment]);

  /* ------------------ ASSET ID OPTIONS ------------------ */
  /* Only show valid assetID's, filter nan/null/undefined/"nan" etc */
  const assetIdOptions = useMemo(() => {
    return assetsByEquipment
      ?.filter((a) => {
        const id = a.assetID;

        if (id === null || id === undefined) return false; // null/undefined
        if (typeof id === "number" && Number.isNaN(id)) return false; // actual NaN

        const str = String(id).trim().toLowerCase(); // normalize
        if (str === "" || str === "nan") return false; // empty or string "nan"

        return true; // valid
      })
      .map((a) => {
        const str = String(a.assetID).trim();
        return {
          label: str,
          value: str,
        };
      });
  }, [assetsByEquipment]);

  // const assetIdOptions = useMemo(() => {
  //   return assetsByEquipment.map((a) => ({
  //     label: a.assetID,
  //     value: a.assetID,
  //   }));
  // }, [assetsByEquipment]);

  /* ------------------ RESET LOGIC ------------------ */
  useEffect(() => {
    if (area && !areaOptions.some((o) => o.value === area)) {
      setValue("area", "");
      setValue("equipment", "");
      setValue("assetID", "");
    }
  }, [area, areaOptions, setValue]);

  useEffect(() => {
    if (equipment && !equipmentOptions.some((o) => o.value === equipment)) {
      setValue("equipment", "");
      setValue("assetID", "");
    }
  }, [equipment, equipmentOptions, setValue]);

  useEffect(() => {
    if (assetID && !assetIdOptions?.some((o) => o.value === assetID)) {
      setValue("assetID", "");
    }
  }, [assetID, assetIdOptions, setValue]);

  return {
    locationOptions,
    areaOptions,
    equipmentOptions,
    assetIdOptions,
  };
};
