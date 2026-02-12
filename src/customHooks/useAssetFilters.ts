// $ This hook is used to filter the assets based on the selected location, equipment and assetID in the maintenance request form. It returns the options for the select inputs and a loading state.

import { useMemo, useEffect } from "react";
import { useGetAssetList } from "./useGetAssetList";
import type { UseFormSetValue } from "react-hook-form";
import type { CreateJobFormValues } from "@/schemas";

interface Params {
  location?: string;
  equipment?: string;
  assetID?: string;
  setValue: UseFormSetValue<CreateJobFormValues>;
}

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

export const useAssetFilters = ({
  location,
  equipment,
  assetID,
  setValue,
}: Params) => {
  const { assets = [], isPending } = useGetAssetList();

  // console.log("assets:", assets);

  // Generates the top-level dropdown options
  // ALL assets → unique locations → location dropdown

  const locationOptions = useMemo(() => {
    const unique = Array.from(new Set(assets.map((a) => a.location)));
    // console.log("Location selected:", location);
    // console.log(
    //   "Matching assets:",
    //   assets.filter((a) => a.location === location),
    // );

    return unique.map((l) => ({
      label: l,
      value: l,
    }));
  }, [assets]);

  /**
   * -----------------------------------------
   * 1️⃣ Filter by Location ONLY
   * -----------------------------------------
   */
  // Filters the dataset after a location is selected. This is used to generate the equipment options and filter the assetID options.
  // Selected location → filtered assets
  const assetsByLocation = useMemo(() => {
    if (!location) return assets;

    const normalizedLocation = normalize(location);
    // console.log("Location selected:", location);
    // console.log(
    //   "Matching assets:",
    //   assets.filter((a) => a.location === location),
    // );

    return assets.filter((a) => normalize(a.location) === normalizedLocation);
  }, [assets, location]);

  /**
   * -----------------------------------------
   * 2️⃣ Equipment Options (depends ONLY on location)
   * -----------------------------------------
   */
  const equipmentOptions = useMemo(() => {
    const unique = Array.from(
      new Set(assetsByLocation.map((a) => a.equipment)),
    );

    return unique.map((e) => ({
      label: e,
      value: e,
    }));
  }, [assetsByLocation]);

  /**
   * -----------------------------------------
   * 3️⃣ Filter by Equipment (after location)
   * -----------------------------------------
   */
  const assetsByEquipment = useMemo(() => {
    if (!equipment) return assetsByLocation;

    const normalizedEquipment = normalize(equipment);

    return assetsByLocation.filter(
      (a) => normalize(a.equipment) === normalizedEquipment,
    );
  }, [assetsByLocation, equipment]);

  /**
   * -----------------------------------------
   * 4️⃣ AssetID Options (depends on location + equipment)
   * -----------------------------------------
   */
  const assetIdOptions = useMemo(() => {
    return assetsByEquipment.map((a) => ({
      label: a.assetID,
      value: a.assetID,
    }));
  }, [assetsByEquipment]);

  /**
   * -----------------------------------------
   * 5️⃣ Reset logic (prevents invalid selections)
   * -----------------------------------------
   */

  // Reset equipment if not valid for location
  useEffect(() => {
    if (equipment && !equipmentOptions.some((o) => o.value === equipment)) {
      setValue("equipment", "");
      setValue("assetID", "");
    }
  }, [equipment, equipmentOptions, setValue]);

  // Reset assetID if not valid for equipment
  useEffect(() => {
    if (assetID && !assetIdOptions.some((o) => o.value === assetID)) {
      setValue("assetID", "");
    }
  }, [assetID, assetIdOptions, setValue]);

  return {
    locationOptions,
    equipmentOptions,
    assetIdOptions,
    isPending,
  };
};
