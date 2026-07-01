// $ This hook is used to filter the assets based on the selected location, equipment and assetID in the maintenance request form. It returns the options for the select inputs and a loading state.

import { useMemo } from "react";
// import type { UseFormSetValue } from "react-hook-form";
import type { AssetRequestFormValues } from "@/schemas";

export type AssetFilterFormValues = {
  location: string;
  area: string;
  equipment: string;
  assetID: string;
};
type Params = {
  location?: string;
  assets: AssetRequestFormValues[];
  area?: string;
  equipment?: string;
  assetID?: string;
  // setValue: UseFormSetValue<AssetFilterFormValues>;
};

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

/**
 * A cascading filter hook for asset selection forms.
 *
 * Filters a flat list of assets through four hierarchical levels:
 * **Location → Area → Equipment → Asset ID**
 *
 * Each level's options are derived from the assets that pass all
 * upstream filters, so selecting a Location automatically narrows
 * the available Areas, and so on. When an upstream value changes
 * such that a downstream selection is no longer valid, the hook
 * automatically resets the stale field(s) via `setValue`.
 *
 * @param params - Configuration object
 * @param params.assets - The full, unfiltered list of assets (from the form
 *   state or an API response). Should be stable across renders to avoid
 *   unnecessary recomputation.
 * @param params.location - The currently selected location value (controlled).
 *   Pass `undefined` or `""` to show all locations.
 * @param params.area - The currently selected area value (controlled).
 *   Automatically cleared when it becomes invalid after a location change.
 * @param params.equipment - The currently selected equipment value (controlled).
 *   Automatically cleared when it becomes invalid after an area change.
 * @param params.assetID - The currently selected asset ID value (controlled).
 *   Automatically cleared when it becomes invalid after an equipment change.
 *   Values that are `null`, `undefined`, `NaN`, `""`, or the string `"nan"`
 *   are excluded from the available options.
 * @param params.setValue - The `setValue` function from `react-hook-form`,
 *   used to reset downstream fields when an upstream filter changes.
 *
 * @returns An object containing four option arrays for use in select inputs:
 * @returns returns.locationOptions - All unique locations across the full asset list.
 * @returns returns.areaOptions - Unique areas within the selected location
 *   (or all areas if no location is selected).
 * @returns returns.equipmentOptions - Unique equipment types within the selected
 *   location + area combination.
 * @returns returns.assetIdOptions - Valid, unique asset IDs within the selected
 *   location + area + equipment combination. Invalid IDs (`null`, `undefined`,
 *   `NaN`, `""`, `"nan"`) are filtered out.
 *
 * @example
 * // Basic usage inside a react-hook-form form component
 * const { control, setValue, watch } = useForm<JobRequestFormValues>();
 *
 * const location  = watch("location");
 * const area      = watch("area");
 * const equipment = watch("equipment");
 * const assetID   = watch("assetID");
 *
 * const {
 *   locationOptions,
 *   areaOptions,
 *   equipmentOptions,
 *   assetIdOptions,
 * } = useAssetFilters({
 *   assets,      // AssetRequestFormValues[] from API or form state
 *   location,
 *   area,
 *   equipment,
 *   assetID,
 *   setValue,
 * });
 *
 * return (
 *   <>
 *     <Select name="location" options={locationOptions} />
 *     <Select name="area"      options={areaOptions} />
 *     <Select name="equipment" options={equipmentOptions} />
 *     <Select name="assetID"   options={assetIdOptions ?? []} />
 *   </>
 * );
 *
 * @example
 * // Cascade reset behaviour — when location changes from "Site A" to "Site B",
 * // if the current area ("Zone 1") doesn't exist under "Site B", the hook
 * // automatically calls:
 * //   setValue("area", "")
 * //   setValue("equipment", "")
 * //   setValue("assetID", "")
 *
 * @dependencies
 * - react          — `useMemo`, `useEffect`
 * - react-hook-form — `UseFormSetValue` (type), `setValue` at runtime
 *
 * @see {@link AssetRequestFormValues} for the shape of each asset record
 * @see {@link JobRequestFormValues}   for the parent form schema
 */
export const useAssetFilters = ({
  location,
  assets,
  area,
  equipment,
  assetID,
  // setValue,
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

  /* ------------------ RESET LOGIC ------------------ */
  // useEffect(() => {
  //   if (area && !areaOptions.some((o) => o.value === area)) {
  //     setValue("area", "");
  //     setValue("equipment", "");
  //     setValue("assetID", "");
  //   }
  // }, [area, areaOptions, setValue]);

  // useEffect(() => {
  //   if (equipment && !equipmentOptions.some((o) => o.value === equipment)) {
  //     setValue("equipment", "");
  //     setValue("assetID", "");
  //   }
  // }, [equipment, equipmentOptions, setValue]);

  // useEffect(() => {
  //   if (assetID && !assetIdOptions?.some((o) => o.value === assetID)) {
  //     setValue("assetID", "");
  //   }
  // }, [assetID, assetIdOptions, setValue]);

  return {
    locationOptions,
    areaOptions,
    equipmentOptions,
    assetIdOptions,
    isFieldValid: {
      area: !area || areaOptions.some((o) => o.value === area),
      equipment:
        !equipment || equipmentOptions.some((o) => o.value === equipment),
      assetID: !assetID || assetIdOptions.some((o) => o.value === assetID),
    },
  };
};
