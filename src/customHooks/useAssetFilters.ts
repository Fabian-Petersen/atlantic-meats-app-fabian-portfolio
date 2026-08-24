import { useEffect, useMemo } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { useAssetFilterReset } from "./useAssetFilterReset";

import type {
  AssetLocationsResponse,
  AssetLocationHierarchyResponse,
  AssetEquipmentResponse,
  AssetOptionsResponse,
  AssetLocationOption,
  AssetAreaOption,
  AssetEquipmentOption,
  AssetOption,
} from "@/schemas/assetSchemas";

import { useGetAll } from "@/utils/api";

// ============================================================================
// Types
// ============================================================================

export type AssetFilterFormValues = {
  location?: string;
  locationFrom?: string;

  // Existing flat form support
  area?: string;
  equipment?: string;
  assetID?: string;

  // Transfer form support
  assets?: Array<{
    area?: string;
    equipment?: string;
    assetID?: string;
    assetIssueReason?: string;
    assetIssueDetails?: string;
  }>;
};

type SelectOption = {
  label: string;
  value: string;
};

type AssetFilterForm = FieldValues & {
  location?: string;
  locationFrom?: string;

  area?: string;
  equipment?: string;
  assetID?: string;

  assets?: Array<{
    area?: string;
    equipment?: string;
    assetID?: string;
    assetIssueReason?: string;
    assetIssueDetails?: string;
  }>;
};

type Params<TForm extends AssetFilterForm> = {
  form: UseFormReturn<TForm>;

  /**
   * Field containing the selected location.
   *
   * Defaults to:
   *   "location" for normal forms
   *   "locationFrom" when that field exists
   */
  locationField?: Path<TForm>;

  /**
   * When supplied, asset-specific fields are resolved from:
   *
   * assets.${assetIndex}.area
   * assets.${assetIndex}.equipment
   * assets.${assetIndex}.assetID
   *
   * This allows the hook to support multiple transfer assets.
   */
  assetIndex?: number;
};

// ============================================================================
// Constants
// ============================================================================

const RESOURCE_PATH = "api/assets/options";

// ============================================================================
// Helpers
// ============================================================================

const toSelectOption = (option: AssetLocationOption | string): SelectOption => {
  if (typeof option === "string") {
    return {
      label: option,
      value: option,
    };
  }

  return {
    label: option.label,
    value: option.value,
  };
};

const areaToSelectOption = (area: AssetAreaOption): SelectOption => ({
  label: area.name,
  value: area.name,
});

const equipmentToSelectOption = (
  equipment: AssetEquipmentOption,
): SelectOption => ({
  label: equipment.name,
  value: equipment.name,
});

const assetToSelectOption = (asset: AssetOption): SelectOption => ({
  label: asset.assetID,
  value: asset.assetID,
});

// ============================================================================
// Hook
// ============================================================================

export const useAssetFilters = <TForm extends AssetFilterForm>({
  form,
  locationField,
  assetIndex,
}: Params<TForm>) => {
  // ==========================================================================
  // Resolve form field names
  // ==========================================================================

  const resolvedLocationField =
    locationField ??
    (("locationFrom" in form.getValues()
      ? "locationFrom"
      : "location") as Path<TForm>);

  /**
   * Resolve the asset-specific field paths.
   *
   * Normal forms:
   *   area
   *   equipment
   *   assetID
   *
   * Transfer forms:
   *   assets.0.area
   *   assets.0.equipment
   *   assets.0.assetID
   */
  const areaField = (
    assetIndex !== undefined ? `assets.${assetIndex}.area` : "area"
  ) as Path<TForm>;

  const equipmentField = (
    assetIndex !== undefined ? `assets.${assetIndex}.equipment` : "equipment"
  ) as Path<TForm>;

  const assetIDField = (
    assetIndex !== undefined ? `assets.${assetIndex}.assetID` : "assetID"
  ) as Path<TForm>;

  // ==========================================================================
  // Watch cascading values
  // ==========================================================================

  const selectedLocation = form.watch(resolvedLocationField);

  const selectedArea = form.watch(areaField);

  const selectedEquipment = form.watch(equipmentField);

  const selectedAssetID = form.watch(assetIDField);

  // ==========================================================================
  // Level 1 — Locations
  // ==========================================================================

  const {
    data: locationsData,
    isPending: isLocationsPending,
    isError: isLocationsError,
  } = useGetAll<AssetLocationsResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: ["assets", "options", "locations"],
    enabled: true,
  });

  // ==========================================================================
  // Level 2 — Location → Areas
  // ==========================================================================

  const {
    data: locationData,
    isPending: isLocationPending,
    isError: isLocationError,
  } = useGetAll<AssetLocationHierarchyResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: ["assets", "options", "location", selectedLocation],
    params: {
      location: selectedLocation,
    },
    enabled: !!selectedLocation,
  });

  // ==========================================================================
  // Level 3 — Area → Equipment
  // ==========================================================================

  const {
    data: areaData,
    isPending: isAreaPending,
    isError: isAreaError,
  } = useGetAll<AssetEquipmentResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: ["assets", "options", "area", selectedLocation, selectedArea],
    params: {
      location: selectedLocation,
      area: selectedArea,
    },
    enabled: !!selectedLocation && !!selectedArea,
  });

  // ==========================================================================
  // Level 4 — Equipment → Asset IDs
  // ==========================================================================

  const {
    data: assetData,
    isPending: isAssetPending,
    isError: isAssetError,
  } = useGetAll<AssetOptionsResponse>({
    resourcePath: RESOURCE_PATH,
    queryKey: [
      "assets",
      "options",
      "asset",
      selectedLocation,
      selectedArea,
      selectedEquipment,
    ],
    params: {
      location: selectedLocation,
      area: selectedArea,
      equipment: selectedEquipment,
    },
    enabled: !!selectedLocation && !!selectedArea && !!selectedEquipment,
  });

  // ==========================================================================
  // Location Options
  // ==========================================================================

  const locationOptions = useMemo<SelectOption[]>(
    () => locationsData?.locations?.map(toSelectOption) ?? [],
    [locationsData],
  );

  // ==========================================================================
  // Area Options
  // ==========================================================================

  const areaOptions = useMemo<SelectOption[]>(
    () => locationData?.areas?.map(areaToSelectOption) ?? [],
    [locationData],
  );

  // ==========================================================================
  // Equipment Options
  // ==========================================================================

  const equipmentOptions = useMemo<SelectOption[]>(() => {
    if (areaData?.equipment) {
      return areaData.equipment.map(equipmentToSelectOption);
    }

    if (locationData?.areas && selectedArea) {
      const selectedAreaData = locationData.areas.find(
        (item) => item.name === selectedArea,
      );

      return selectedAreaData?.equipment?.map(equipmentToSelectOption) ?? [];
    }

    return [];
  }, [areaData, locationData, selectedArea]);

  // ==========================================================================
  // Asset ID Options
  // ==========================================================================

  const assetIdOptions = useMemo<SelectOption[]>(
    () => assetData?.assets?.map(assetToSelectOption) ?? [],
    [assetData],
  );

  // ==========================================================================
  // Asset Identification
  // ==========================================================================

  const hasVerifiedAssets = useMemo(() => {
    if (!selectedEquipment) {
      return false;
    }

    if (assetData) {
      return assetData.assets.length > 0;
    }

    if (areaData?.equipment) {
      const equipment = areaData.equipment.find(
        (item) => item.name === selectedEquipment,
      );

      return equipment?.hasVerifiedAssets ?? false;
    }

    return false;
  }, [assetData, areaData, selectedEquipment]);

  const allowUnidentifiedAsset = assetData?.allowUnidentifiedAsset ?? false;

  // ==========================================================================
  // Validation
  // ==========================================================================

  const isFieldValid = {
    location:
      !selectedLocation ||
      locationOptions.some((option) => option.value === selectedLocation),

    area:
      !selectedArea ||
      areaOptions.some((option) => option.value === selectedArea),

    equipment:
      !selectedEquipment ||
      equipmentOptions.some((option) => option.value === selectedEquipment),

    assetID:
      !selectedAssetID ||
      assetIdOptions.some((option) => option.value === selectedAssetID),
  };

  // ==========================================================================
  // Reset cascading fields
  // ==========================================================================

  useAssetFilterReset({
    location: selectedLocation,
    validity: isFieldValid,

    resetArea: () => form.setValue(areaField, "" as TForm[Path<TForm>]),

    resetEquipment: () =>
      form.setValue(equipmentField, "" as TForm[Path<TForm>]),

    resetAssetID: () => {
      form.setValue(assetIDField, "" as TForm[Path<TForm>]);

      const values = form.getValues();

      if ("assetIssueReason" in values) {
        form.setValue(
          "assetIssueReason" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }

      if ("assetIssueDetails" in values) {
        form.setValue(
          "assetIssueDetails" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }
    },

    resetAll: () => {
      form.setValue(areaField, "" as TForm[Path<TForm>]);

      form.setValue(equipmentField, "" as TForm[Path<TForm>]);

      form.setValue(assetIDField, "" as TForm[Path<TForm>]);

      const values = form.getValues();

      if ("assetIssueReason" in values) {
        form.setValue(
          "assetIssueReason" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }

      if ("assetIssueDetails" in values) {
        form.setValue(
          "assetIssueDetails" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }
    },
  });

  // ==========================================================================
  // Clear inactive asset workflow
  // ==========================================================================

  useEffect(() => {
    if (!selectedEquipment) {
      return;
    }

    if (hasVerifiedAssets) {
      const values = form.getValues();

      if ("assetIssueReason" in values) {
        form.setValue(
          "assetIssueReason" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }

      if ("assetIssueDetails" in values) {
        form.setValue(
          "assetIssueDetails" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }
    } else if (allowUnidentifiedAsset) {
      form.setValue(assetIDField, "" as TForm[Path<TForm>]);
    }
  }, [
    hasVerifiedAssets,
    allowUnidentifiedAsset,
    selectedEquipment,
    assetIDField,
    form,
  ]);

  // ==========================================================================
  // Combined Query State
  // ==========================================================================

  const isPending =
    isLocationsPending || isLocationPending || isAreaPending || isAssetPending;

  const isError =
    isLocationsError || isLocationError || isAreaError || isAssetError;

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    locationOptions,
    areaOptions,
    equipmentOptions,
    assetIdOptions,

    hasVerifiedAssets,
    allowUnidentifiedAsset,

    isFieldValid,

    isPending,
    isError,

    isLocationsPending,
    isLocationPending,
    isAreaPending,
    isAssetPending,

    locationsData,
    locationData,
    areaData,
    assetData,
  };
};

/* -------------------------------------------------------------------------- */
/*                                  OLD HOOK                                  */
/* -------------------------------------------------------------------------- */

// // useAssetFilters.ts
// //
// // Backend-driven cascading asset selection.
// //
// // Supports forms that use:
// //   location
// // or:
// //   locationFrom
// //
// // The backend remains the source of truth for:
// //   Location → Area → Equipment → Asset ID

// import { useEffect, useMemo } from "react";
// import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

// import { useAssetFilterReset } from "./useAssetFilterReset";

// import type {
//   AssetLocationsResponse,
//   AssetLocationHierarchyResponse,
//   AssetEquipmentResponse,
//   AssetOptionsResponse,
//   AssetLocationOption,
//   AssetAreaOption,
//   AssetEquipmentOption,
//   AssetOption,
// } from "@/schemas/assetSchemas";

// import { useGetAll } from "@/utils/api";

// // ============================================================================
// // Types
// // ============================================================================

// export type AssetFilterFormValues = {
//   location?: string;
//   locationFrom?: string;
//   area: string;
//   equipment: string;
//   assetID: string;
// };

// type SelectOption = {
//   label: string;
//   value: string;
// };

// type AssetFilterForm = FieldValues & {
//   area?: string;
//   equipment?: string;
//   assetID?: string;
//   location?: string;
//   locationFrom?: string;
// };

// type Params<TForm extends AssetFilterForm> = {
//   form: UseFormReturn<TForm>;

//   /**
//    * Field containing the selected location.
//    *
//    * Defaults to "location".
//    *
//    * Example:
//    *   Jobs     → "location"
//    *   Transfers → "locationFrom"
//    */
//   locationField?: Path<TForm>;
// };

// // ============================================================================
// // Constants
// // ============================================================================

// const RESOURCE_PATH = "api/assets/options";

// // ============================================================================
// // Helpers
// // ============================================================================

// const toSelectOption = (option: AssetLocationOption | string): SelectOption => {
//   if (typeof option === "string") {
//     return {
//       label: option,
//       value: option,
//     };
//   }

//   return {
//     label: option.label,
//     value: option.value,
//   };
// };

// const areaToSelectOption = (area: AssetAreaOption): SelectOption => ({
//   label: area.name,
//   value: area.name,
// });

// const equipmentToSelectOption = (
//   equipment: AssetEquipmentOption,
// ): SelectOption => ({
//   label: equipment.name,
//   value: equipment.name,
// });

// const assetToSelectOption = (asset: AssetOption): SelectOption => ({
//   label: asset.assetID,
//   value: asset.assetID,
// });

// // ============================================================================
// // Hook
// // ============================================================================

// export const useAssetFilters = <TForm extends AssetFilterForm>({
//   form,
//   locationField,
// }: Params<TForm>) => {
//   // ==========================================================================
//   // Resolve form field names
//   // ==========================================================================

//   // Auto-detect which location field this form uses, unless the caller
//   // explicitly overrides it. This lets Jobs ("location") and Transfers
//   // ("locationFrom") share the hook with zero configuration.
//   const resolvedLocationField =
//     locationField ??
//     (("locationFrom" in form.getValues()
//       ? "locationFrom"
//       : "location") as Path<TForm>);

//   // ==========================================================================
//   // Watch cascading values
//   // ==========================================================================

//   const selectedLocation = form.watch(resolvedLocationField);

//   const selectedArea = form.watch("area" as Path<TForm>);

//   const selectedEquipment = form.watch("equipment" as Path<TForm>);

//   const selectedAssetID = form.watch("assetID" as Path<TForm>);

//   // ==========================================================================
//   // Level 1 — Locations
//   // ==========================================================================

//   const {
//     data: locationsData,
//     isPending: isLocationsPending,
//     isError: isLocationsError,
//   } = useGetAll<AssetLocationsResponse>({
//     resourcePath: RESOURCE_PATH,
//     queryKey: ["assets", "options", "locations"],
//     enabled: true,
//   });

//   // ==========================================================================
//   // Level 2 — Location
//   // ==========================================================================

//   const {
//     data: locationData,
//     isPending: isLocationPending,
//     isError: isLocationError,
//   } = useGetAll<AssetLocationHierarchyResponse>({
//     resourcePath: RESOURCE_PATH,
//     queryKey: ["assets", "options", "location", selectedLocation],
//     params: {
//       location: selectedLocation,
//     },
//     enabled: !!selectedLocation,
//   });
//   // console.log("locationData:", locationData);
//   // ==========================================================================
//   // Level 3 — Area
//   // ==========================================================================

//   const {
//     data: areaData,
//     isPending: isAreaPending,
//     isError: isAreaError,
//   } = useGetAll<AssetEquipmentResponse>({
//     resourcePath: RESOURCE_PATH,
//     queryKey: ["assets", "options", "area", selectedLocation, selectedArea],
//     params: {
//       location: selectedLocation,
//       area: selectedArea,
//     },
//     enabled: !!selectedLocation && !!selectedArea,
//   });

//   // console.log("areaData:", areaData);
//   // ==========================================================================
//   // Level 4 — Equipment / Asset IDs
//   // ==========================================================================

//   const {
//     data: assetData,
//     isPending: isAssetPending,
//     isError: isAssetError,
//   } = useGetAll<AssetOptionsResponse>({
//     resourcePath: RESOURCE_PATH,
//     queryKey: [
//       "assets",
//       "options",
//       "asset",
//       selectedLocation,
//       selectedArea,
//       selectedEquipment,
//     ],
//     params: {
//       location: selectedLocation,
//       area: selectedArea,
//       equipment: selectedEquipment,
//     },
//     enabled: !!selectedLocation && !!selectedArea && !!selectedEquipment,
//   });

//   // ==========================================================================
//   // Location Options
//   // ==========================================================================

//   const locationOptions = useMemo<SelectOption[]>(
//     () => locationsData?.locations?.map(toSelectOption) ?? [],
//     [locationsData],
//   );

//   // ==========================================================================
//   // Area Options
//   // ==========================================================================

//   const areaOptions = useMemo<SelectOption[]>(
//     () => locationData?.areas?.map(areaToSelectOption) ?? [],
//     [locationData],
//   );

//   // ==========================================================================
//   // Equipment Options
//   // ==========================================================================

//   const equipmentOptions = useMemo<SelectOption[]>(() => {
//     // Prefer the dedicated area response.
//     if (areaData?.equipment) {
//       return areaData.equipment.map(equipmentToSelectOption);
//     }

//     // Fall back to equipment contained
//     // inside the location response.
//     if (locationData?.areas && selectedArea) {
//       const selectedAreaData = locationData.areas.find(
//         (item) => item.name === selectedArea,
//       );

//       return selectedAreaData?.equipment?.map(equipmentToSelectOption) ?? [];
//     }

//     return [];
//   }, [areaData, locationData, selectedArea]);

//   // ==========================================================================
//   // Asset ID Options
//   // ==========================================================================

//   const assetIdOptions = useMemo<SelectOption[]>(
//     () => assetData?.assets?.map(assetToSelectOption) ?? [],
//     [assetData],
//   );

//   // ==========================================================================
//   // Asset Identification
//   // ==========================================================================

//   const hasVerifiedAssets = useMemo(() => {
//     if (!selectedEquipment) {
//       return false;
//     }

//     if (assetData) {
//       return assetData.assets.length > 0;
//     }

//     if (areaData?.equipment) {
//       const equipment = areaData.equipment.find(
//         (item) => item.name === selectedEquipment,
//       );

//       return equipment?.hasVerifiedAssets ?? false;
//     }

//     return false;
//   }, [assetData, areaData, selectedEquipment]);

//   const allowUnidentifiedAsset = assetData?.allowUnidentifiedAsset ?? false;

//   // ==========================================================================
//   // Validation
//   // ==========================================================================

//   const isFieldValid = {
//     location:
//       !selectedLocation ||
//       locationOptions.some((option) => option.value === selectedLocation),

//     area:
//       !selectedArea ||
//       areaOptions.some((option) => option.value === selectedArea),

//     equipment:
//       !selectedEquipment ||
//       equipmentOptions.some((option) => option.value === selectedEquipment),

//     assetID:
//       !selectedAssetID ||
//       assetIdOptions.some((option) => option.value === selectedAssetID),
//   };

//   // ==========================================================================
//   // Reset cascading fields
//   // ==========================================================================

//   useAssetFilterReset({
//     location: selectedLocation,
//     validity: isFieldValid,

//     resetArea: () =>
//       form.setValue("area" as Path<TForm>, "" as TForm[Path<TForm>]),

//     resetEquipment: () =>
//       form.setValue("equipment" as Path<TForm>, "" as TForm[Path<TForm>]),

//     resetAssetID: () => {
//       form.setValue("assetID" as Path<TForm>, "" as TForm[Path<TForm>]);

//       // These fields only exist on the job form.
//       if ("assetIssueReason" in form.getValues()) {
//         form.setValue(
//           "assetIssueReason" as Path<TForm>,
//           "" as TForm[Path<TForm>],
//         );

//         form.setValue(
//           "assetIssueDetails" as Path<TForm>,
//           "" as TForm[Path<TForm>],
//         );
//       }
//     },

//     resetAll: () => {
//       form.setValue("area" as Path<TForm>, "" as TForm[Path<TForm>]);

//       form.setValue("equipment" as Path<TForm>, "" as TForm[Path<TForm>]);

//       form.setValue("assetID" as Path<TForm>, "" as TForm[Path<TForm>]);

//       if ("assetIssueReason" in form.getValues()) {
//         form.setValue(
//           "assetIssueReason" as Path<TForm>,
//           "" as TForm[Path<TForm>],
//         );

//         form.setValue(
//           "assetIssueDetails" as Path<TForm>,
//           "" as TForm[Path<TForm>],
//         );
//       }
//     },
//   });

//   // ==========================================================================
//   // Clear inactive asset workflow
//   // ==========================================================================

//   useEffect(() => {
//     if (!selectedEquipment) {
//       return;
//     }

//     if (hasVerifiedAssets) {
//       if ("assetIssueReason" in form.getValues()) {
//         form.setValue(
//           "assetIssueReason" as Path<TForm>,
//           "" as TForm[Path<TForm>],
//         );

//         form.setValue(
//           "assetIssueDetails" as Path<TForm>,
//           "" as TForm[Path<TForm>],
//         );
//       }
//     } else if (allowUnidentifiedAsset) {
//       form.setValue("assetID" as Path<TForm>, "" as TForm[Path<TForm>]);
//     }
//   }, [hasVerifiedAssets, allowUnidentifiedAsset, selectedEquipment, form]);

//   // ==========================================================================
//   // Combined Query State
//   // ==========================================================================

//   const isPending =
//     isLocationsPending || isLocationPending || isAreaPending || isAssetPending;

//   const isError =
//     isLocationsError || isLocationError || isAreaError || isAssetError;

//   // ==========================================================================
//   // Return
//   // ==========================================================================

//   return {
//     // Select options
//     locationOptions,
//     areaOptions,
//     equipmentOptions,
//     assetIdOptions,

//     // Asset identification
//     hasVerifiedAssets,
//     allowUnidentifiedAsset,

//     // Validation
//     isFieldValid,

//     // Query state
//     isPending,
//     isError,

//     // Individual loading states
//     isLocationsPending,
//     isLocationPending,
//     isAreaPending,
//     isAssetPending,

//     // Raw responses
//     locationsData,
//     locationData,
//     areaData,
//     assetData,
//   };
// };
