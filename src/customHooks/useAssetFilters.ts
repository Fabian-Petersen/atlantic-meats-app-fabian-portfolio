// useAssetFilters.ts
//
// Backend-driven cascading asset selection.
//
// Supports forms that use:
//   location
// or:
//   locationFrom
//
// The backend remains the source of truth for:
//   Location → Area → Equipment → Asset ID

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
  area: string;
  equipment: string;
  assetID: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type AssetFilterForm = FieldValues & {
  area?: string;
  equipment?: string;
  assetID?: string;
  location?: string;
  locationFrom?: string;
};

type Params<TForm extends AssetFilterForm> = {
  form: UseFormReturn<TForm>;

  /**
   * Field containing the selected location.
   *
   * Defaults to "location".
   *
   * Example:
   *   Jobs     → "location"
   *   Transfers → "locationFrom"
   */
  locationField?: Path<TForm>;
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
}: Params<TForm>) => {
  // ==========================================================================
  // Resolve form field names
  // ==========================================================================

  // Auto-detect which location field this form uses, unless the caller
  // explicitly overrides it. This lets Jobs ("location") and Transfers
  // ("locationFrom") share the hook with zero configuration.
  const resolvedLocationField =
    locationField ??
    (("locationFrom" in form.getValues()
      ? "locationFrom"
      : "location") as Path<TForm>);

  // ==========================================================================
  // Watch cascading values
  // ==========================================================================

  const selectedLocation = form.watch(resolvedLocationField);

  const selectedArea = form.watch("area" as Path<TForm>);

  const selectedEquipment = form.watch("equipment" as Path<TForm>);

  const selectedAssetID = form.watch("assetID" as Path<TForm>);

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
  // Level 2 — Location
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
  console.log("locationData:", locationData);
  // ==========================================================================
  // Level 3 — Area
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

  console.log("areaData:", areaData);
  // ==========================================================================
  // Level 4 — Equipment / Asset IDs
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
    // Prefer the dedicated area response.
    if (areaData?.equipment) {
      return areaData.equipment.map(equipmentToSelectOption);
    }

    // Fall back to equipment contained
    // inside the location response.
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

    resetArea: () =>
      form.setValue("area" as Path<TForm>, "" as TForm[Path<TForm>]),

    resetEquipment: () =>
      form.setValue("equipment" as Path<TForm>, "" as TForm[Path<TForm>]),

    resetAssetID: () => {
      form.setValue("assetID" as Path<TForm>, "" as TForm[Path<TForm>]);

      // These fields only exist on the job form.
      if ("assetIssueReason" in form.getValues()) {
        form.setValue(
          "assetIssueReason" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );

        form.setValue(
          "assetIssueDetails" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }
    },

    resetAll: () => {
      form.setValue("area" as Path<TForm>, "" as TForm[Path<TForm>]);

      form.setValue("equipment" as Path<TForm>, "" as TForm[Path<TForm>]);

      form.setValue("assetID" as Path<TForm>, "" as TForm[Path<TForm>]);

      if ("assetIssueReason" in form.getValues()) {
        form.setValue(
          "assetIssueReason" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );

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
      if ("assetIssueReason" in form.getValues()) {
        form.setValue(
          "assetIssueReason" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );

        form.setValue(
          "assetIssueDetails" as Path<TForm>,
          "" as TForm[Path<TForm>],
        );
      }
    } else if (allowUnidentifiedAsset) {
      form.setValue("assetID" as Path<TForm>, "" as TForm[Path<TForm>]);
    }
  }, [hasVerifiedAssets, allowUnidentifiedAsset, selectedEquipment, form]);

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
    // Select options
    locationOptions,
    areaOptions,
    equipmentOptions,
    assetIdOptions,

    // Asset identification
    hasVerifiedAssets,
    allowUnidentifiedAsset,

    // Validation
    isFieldValid,

    // Query state
    isPending,
    isError,

    // Individual loading states
    isLocationsPending,
    isLocationPending,
    isAreaPending,
    isAssetPending,

    // Raw responses
    locationsData,
    locationData,
    areaData,
    assetData,
  };
};
/* -------------------------------------------------------------------------- */
/*                           Old Hook (Not Dynamic)                           */
/* -------------------------------------------------------------------------- */

// // $ This hook manages the cascading asset selections used by the
// // $ maintenance job request form.
// //
// // $ The filtering is performed by the backend rather than locally.
// // $ The backend is the source of truth for:
// // $
// // $ Location → Area → Equipment → Asset ID
// //
// // $ This keeps the frontend aligned with the actual DynamoDB asset
// // $ records and avoids downloading the complete asset table just
// // $ to construct select options.

// import { useEffect, useMemo } from "react";
// import type { UseFormReturn } from "react-hook-form";
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

// import type { JobRequestFormValues } from "@/schemas/jobSchemas";

// import { useGetAll } from "@/utils/api";

// // ============================================================================
// // Types
// // ============================================================================

// export type AssetFilterFormValues = {
//   location: string;
//   area: string;
//   equipment: string;
//   assetID: string;
// };

// type Params = {
//   form: UseFormReturn<JobRequestFormValues>;
// };

// type SelectOption = {
//   label: string;
//   value: string;
// };

// // ============================================================================
// // Constants
// // ============================================================================

// const RESOURCE_PATH = "api/assets/options";

// // ============================================================================
// // Helpers
// // ============================================================================

// /**
//  * Converts an API option into the simple `{ label, value }` structure
//  * expected by the generic select components.
//  */
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

// /**
//  * Converts an area returned by the backend into a select option.
//  */
// const areaToSelectOption = (area: AssetAreaOption): SelectOption => ({
//   label: area.name,
//   value: area.name,
// });

// /**
//  * Converts an equipment returned by the backend into a select option.
//  */
// const equipmentToSelectOption = (
//   equipment: AssetEquipmentOption,
// ): SelectOption => ({
//   label: equipment.name,
//   value: equipment.name,
// });

// /**
//  * Converts an asset returned by the backend into a select option.
//  *
//  * The asset ID is what the user sees and what is submitted by the
//  * Create Job form.
//  */
// const assetToSelectOption = (asset: AssetOption): SelectOption => ({
//   label: asset.assetID,
//   value: asset.assetID,
// });

// // ============================================================================
// // Hook
// // ============================================================================

// /**
//  * A backend-driven cascading asset selection hook for maintenance
//  * job request forms.
//  *
//  * Unlike the previous implementation, this hook does NOT receive
//  * the complete asset table and does NOT filter assets in memory.
//  *
//  * DynamoDB is the source of truth and the backend progressively
//  * returns the valid options for the user's current selection.
//  *
//  * ----------------------------------------------------------------------------
//  * Selection hierarchy
//  * ----------------------------------------------------------------------------
//  *
//  *     Location
//  *        ↓
//  *     Area
//  *        ↓
//  *     Equipment
//  *        ↓
//  *     Asset ID
//  *
//  * ----------------------------------------------------------------------------
//  * API requests
//  * ----------------------------------------------------------------------------
//  *
//  * Initial render:
//  *
//  *     GET /api/assets/options
//  *
//  * Returns:
//  *
//  *     locations
//  *
//  *
//  * After selecting a location:
//  *
//  *     GET /api/assets/options?location=Maitland
//  *
//  * Returns:
//  *
//  *     areas
//  *     equipment
//  *     verified assets
//  *
//  *
//  * After selecting an area:
//  *
//  *     GET /api/assets/options
//  *       ?location=Maitland
//  *       &area=Sales%20Floor
//  *
//  * Returns:
//  *
//  *     equipment
//  *     verified assets
//  *
//  *
//  * After selecting equipment:
//  *
//  *     GET /api/assets/options
//  *       ?location=Maitland
//  *       &area=Sales%20Floor
//  *       &equipment=Fridge
//  *
//  * Returns:
//  *
//  *     verified asset IDs
//  *
//  * ----------------------------------------------------------------------------
//  * Important
//  * ----------------------------------------------------------------------------
//  *
//  * The backend excludes invalid asset IDs such as:
//  *
//  *     null
//  *     undefined
//  *     ""
//  *     "nan"
//  *
//  * However, equipment with no valid asset ID is still returned.
//  *
//  * This allows the Create Job form to support assets where the barcode
//  * is damaged, unreadable, or missing.
//  *
//  * ----------------------------------------------------------------------------
//  * @param params
//  * @param params.form - React Hook Form instance used to watch the
//  *                      cascading selections.
//  *
//  * @returns
//  * Returns select-ready options and query state:
//  *
//  *     locationOptions
//  *     areaOptions
//  *     equipmentOptions
//  *     assetIdOptions
//  *
//  *     isPending
//  *     isError
//  *
//  *     hasVerifiedAssets
//  *     allowUnidentifiedAsset
//  *
//  *     isFieldValid
//  *
//  * ----------------------------------------------------------------------------
//  * @example
//  *
//  * const form = useForm<JobRequestFormValues>({
//  *   defaultValues: {
//  *     location: "",
//  *     area: "",
//  *     equipment: "",
//  *     assetID: "",
//  *   },
//  * });
//  *
//  * const {
//  *   locationOptions,
//  *   areaOptions,
//  *   equipmentOptions,
//  *   assetIdOptions,
//  *   isPending,
//  *   isError,
//  * } = useAssetFilters({
//  *   form,
//  * });
//  *
//  * return (
//  *   <>
//  *     <Select
//  *       name="location"
//  *       options={locationOptions}
//  *     />
//  *
//  *     <Select
//  *       name="area"
//  *       options={areaOptions}
//  *     />
//  *
//  *     <Select
//  *       name="equipment"
//  *       options={equipmentOptions}
//  *     />
//  *
//  *     <Select
//  *       name="assetID"
//  *       options={assetIdOptions}
//  *     />
//  *   </>
//  * );
//  *
//  * ----------------------------------------------------------------------------
//  * @example
//  *
//  * // React Hook Form values:
//  *
//  * location = "Maitland"
//  * area = "Sales Floor"
//  * equipment = "Fridge"
//  *
//  * The hook automatically requests:
//  *
//  * GET /api/assets/options
//  *   ?location=Maitland
//  *   &area=Sales%20Floor
//  *   &equipment=Fridge
//  *
//  * and exposes:
//  *
//  * assetIdOptions = [
//  *   {
//  *     label: "AST-001",
//  *     value: "AST-001",
//  *   },
//  *   {
//  *     label: "AST-002",
//  *     value: "AST-002",
//  *   },
//  * ];
//  *
//  * ----------------------------------------------------------------------------
//  * @example
//  *
//  * // Equipment without a valid asset ID:
//  *
//  * equipment = "Stainless Double Sink"
//  *
//  * Backend data:
//  *
//  * assetID = "nan"
//  *
//  * The equipment is still returned, but:
//  *
//  * assetIdOptions = []
//  *
//  * hasVerifiedAssets = false
//  *
//  * allowUnidentifiedAsset = true
//  *
//  * This allows the UI to display a barcode-missing/unreadable workflow
//  * instead of preventing the user from creating the job request.
//  */
// export const useAssetFilters = ({ form }: Params) => {
//   // ==========================================================================
//   // Watch form selections
//   // ==========================================================================

//   const selectedLocation = form.watch("location");

//   const selectedArea = form.watch("area");

//   const selectedEquipment = form.watch("equipment");

//   const selectedAssetID = form.watch("assetID");

//   // ==========================================================================
//   // Level 1 — Locations
//   // ==========================================================================

//   /**
//    * Initial request.
//    *
//    * No parameters are sent.
//    *
//    * GET /api/assets/options
//    */
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

//   /**
//    * Request made after a location has been selected.
//    *
//    * GET /api/assets/options?location=Maitland
//    *
//    * The backend returns the areas belonging to the location.
//    *
//    * The response may also contain equipment and assets, allowing the
//    * frontend to use the returned hierarchy without another request.
//    */
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

//   // ==========================================================================
//   // Level 3 — Area
//   // ==========================================================================

//   /**
//    * Request made after an area has been selected.
//    *
//    * GET /api/assets/options
//    *     ?location=Maitland
//    *     &area=Sales Floor
//    *
//    * This request is only necessary when the location response does not
//    * already provide the required equipment data.
//    *
//    * Keeping this as a separate query also means the hook remains compatible
//    * with the backend's progressive API contract.
//    */
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

//   // ==========================================================================
//   // Level 4 — Equipment / Asset IDs
//   // ==========================================================================

//   /**
//    * Request made after equipment has been selected.
//    *
//    * GET /api/assets/options
//    *     ?location=Maitland
//    *     &area=Sales Floor
//    *     &equipment=Fridge
//    *
//    * Returns the valid asset IDs for that exact equipment.
//    */
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
//     /*
//      * Prefer the dedicated area response.
//      *
//      * If the location response already contains the selected area,
//      * fall back to that data. This prevents unnecessary dependency
//      * on the additional request.
//      */

//     if (areaData?.equipment) {
//       return areaData.equipment.map(equipmentToSelectOption);
//     }

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

//   const assetIdOptions = useMemo<SelectOption[]>(() => {
//     return assetData?.assets?.map(assetToSelectOption) ?? [];
//   }, [assetData]);

//   // ==========================================================================
//   // Asset Identification
//   // ==========================================================================

//   /**
//    * Indicates whether the selected equipment has at least one
//    * verified asset ID.
//    *
//    * If the equipment exists but its assetID is "nan", this will be false.
//    */
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

//   /**
//    * Indicates whether the backend allows the user to continue
//    * without selecting a verified asset ID.
//    *
//    * This is used for the damaged/missing barcode workflow.
//    */
//   const allowUnidentifiedAsset = assetData?.allowUnidentifiedAsset ?? false;

//   // ==========================================================================
//   // Validation
//   // ==========================================================================

//   /**
//    * Because the backend controls the available options, validation
//    * here only checks whether the currently selected value exists
//    * in the data currently loaded by the hook.
//    */
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
//   // Reset the form field when Location changes
//   // ==========================================================================
//   useAssetFilterReset({
//     location: selectedLocation,
//     validity: isFieldValid,

//     resetArea: () => form.setValue("area", ""),
//     resetEquipment: () => form.setValue("equipment", ""),

//     resetAssetID: () => {
//       form.setValue("assetID", "");
//       form.setValue("assetIssueReason", "");
//       form.setValue("assetIssueDetails", "");
//     },

//     resetAll: () => {
//       form.setValue("area", "");
//       form.setValue("equipment", "");
//       form.setValue("assetID", "");
//       form.setValue("assetIssueReason", "");
//       form.setValue("assetIssueDetails", "");
//     },
//   });

//   // $ ─── Clear the inactive branch when workflow mode flips ──────────
//   useEffect(() => {
//     if (!selectedEquipment) return;

//     if (hasVerifiedAssets) {
//       form.setValue("assetIssueReason", "");
//       form.setValue("assetIssueDetails", "");
//     } else if (allowUnidentifiedAsset) {
//       form.setValue("assetID", "");
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

//     // Raw responses when needed
//     locationsData,
//     locationData,
//     areaData,
//     assetData,
//   };
// };

// /* -------------------------------------------------------------------------- */
// /*                                  OLD HOOK                                  */
// /* -------------------------------------------------------------------------- */

// // // $ This hook is used to filter the assets based on the selected location, equipment and assetID in the maintenance request form. It returns the options for the select inputs and a loading state.

// // import { useMemo } from "react";
// // // import type { UseFormSetValue } from "react-hook-form";
// // import type { AssetRequestFormValues } from "@/schemas";

// // export type AssetFilterFormValues = {
// //   location: string;
// //   area: string;
// //   equipment: string;
// //   assetID: string;
// // };
// // type Params = {
// //   location?: string;
// //   assets: AssetRequestFormValues[];
// //   area?: string;
// //   equipment?: string;
// //   assetID?: string;
// //   // setValue: UseFormSetValue<AssetFilterFormValues>;
// // };

// // const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

// // /**
// //  * A cascading filter hook for asset selection forms.
// //  *
// //  * Filters a flat list of assets through four hierarchical levels:
// //  * **Location → Area → Equipment → Asset ID**
// //  *
// //  * Each level's options are derived from the assets that pass all
// //  * upstream filters, so selecting a Location automatically narrows
// //  * the available Areas, and so on. When an upstream value changes
// //  * such that a downstream selection is no longer valid, the hook
// //  * automatically resets the stale field(s) via `setValue`.
// //  *
// //  * @param params - Configuration object
// //  * @param params.assets - The full, unfiltered list of assets (from the form
// //  *   state or an API response). Should be stable across renders to avoid
// //  *   unnecessary recomputation.
// //  * @param params.location - The currently selected location value (controlled).
// //  *   Pass `undefined` or `""` to show all locations.
// //  * @param params.area - The currently selected area value (controlled).
// //  *   Automatically cleared when it becomes invalid after a location change.
// //  * @param params.equipment - The currently selected equipment value (controlled).
// //  *   Automatically cleared when it becomes invalid after an area change.
// //  * @param params.assetID - The currently selected asset ID value (controlled).
// //  *   Automatically cleared when it becomes invalid after an equipment change.
// //  *   Values that are `null`, `undefined`, `NaN`, `""`, or the string `"nan"`
// //  *   are excluded from the available options.
// //  * @param params.setValue - The `setValue` function from `react-hook-form`,
// //  *   used to reset downstream fields when an upstream filter changes.
// //  *
// //  * @returns An object containing four option arrays for use in select inputs:
// //  * @returns returns.locationOptions - All unique locations across the full asset list.
// //  * @returns returns.areaOptions - Unique areas within the selected location
// //  *   (or all areas if no location is selected).
// //  * @returns returns.equipmentOptions - Unique equipment types within the selected
// //  *   location + area combination.
// //  * @returns returns.assetIdOptions - Valid, unique asset IDs within the selected
// //  *   location + area + equipment combination. Invalid IDs (`null`, `undefined`,
// //  *   `NaN`, `""`, `"nan"`) are filtered out.
// //  *
// //  * @example
// //  * // Basic usage inside a react-hook-form form component
// //  * const { control, setValue, watch } = useForm<JobRequestFormValues>();
// //  *
// //  * const location  = watch("location");
// //  * const area      = watch("area");
// //  * const equipment = watch("equipment");
// //  * const assetID   = watch("assetID");
// //  *
// //  * const {
// //  *   locationOptions,
// //  *   areaOptions,
// //  *   equipmentOptions,
// //  *   assetIdOptions,
// //  * } = useAssetFilters({
// //  *   assets,      // AssetRequestFormValues[] from API or form state
// //  *   location,
// //  *   area,
// //  *   equipment,
// //  *   assetID,
// //  *   setValue,
// //  * });
// //  *
// //  * return (
// //  *   <>
// //  *     <Select name="location" options={locationOptions} />
// //  *     <Select name="area"      options={areaOptions} />
// //  *     <Select name="equipment" options={equipmentOptions} />
// //  *     <Select name="assetID"   options={assetIdOptions ?? []} />
// //  *   </>
// //  * );
// //  *
// //  * @example
// //  * // Cascade reset behaviour — when location changes from "Site A" to "Site B",
// //  * // if the current area ("Zone 1") doesn't exist under "Site B", the hook
// //  * // automatically calls:
// //  * //   setValue("area", "")
// //  * //   setValue("equipment", "")
// //  * //   setValue("assetID", "")
// //  *
// //  * @dependencies
// //  * - react          — `useMemo`, `useEffect`
// //  * - react-hook-form — `UseFormSetValue` (type), `setValue` at runtime
// //  *
// //  * @see {@link AssetRequestFormValues} for the shape of each asset record
// //  * @see {@link JobRequestFormValues}   for the parent form schema
// //  */
// // export const useAssetFilters = ({
// //   location,
// //   assets,
// //   area,
// //   equipment,
// //   assetID,
// //   // setValue,
// // }: Params) => {
// //   /* ------------------ LOCATION OPTIONS ------------------ */
// //   const locationOptions = useMemo(() => {
// //     const unique = Array.from(new Set(assets.map((a) => a.location)));
// //     return unique.map((l) => ({ label: l, value: l }));
// //   }, [assets]);

// //   /* ------------------ FILTER BY LOCATION ------------------ */
// //   const assetsByLocation = useMemo(() => {
// //     if (!location) return assets;
// //     const n = normalize(location);
// //     return assets?.filter((a) => normalize(a.location) === n);
// //   }, [assets, location]);

// //   /* ------------------ AREA OPTIONS ------------------ */
// //   const areaOptions = useMemo(() => {
// //     const unique = Array.from(new Set(assetsByLocation?.map((a) => a.area)));
// //     return unique.map((a) => ({ label: a, value: a }));
// //   }, [assetsByLocation]);

// //   /* ------------------ FILTER BY AREA ------------------ */
// //   const assetsByArea = useMemo(() => {
// //     if (!area) return assetsByLocation;
// //     const n = normalize(area);
// //     return assetsByLocation?.filter((a) => normalize(a.area) === n);
// //   }, [assetsByLocation, area]);

// //   /* ------------------ EQUIPMENT OPTIONS ------------------ */
// //   const equipmentOptions = useMemo(() => {
// //     const unique = Array.from(new Set(assetsByArea?.map((a) => a.equipment)));
// //     return unique.map((e) => ({ label: e, value: e }));
// //   }, [assetsByArea]);

// //   /* ------------------ FILTER BY EQUIPMENT ------------------ */
// //   const assetsByEquipment = useMemo(() => {
// //     if (!equipment) return assetsByArea;
// //     const n = normalize(equipment);
// //     return assetsByArea?.filter((a) => normalize(a.equipment) === n);
// //   }, [assetsByArea, equipment]);

// //   /* ------------------ ASSET ID OPTIONS ------------------ */
// //   /* Only show valid assetID's, filter nan/null/undefined/"nan" etc */
// //   const assetIdOptions = useMemo(() => {
// //     return assetsByEquipment
// //       ?.filter((a) => {
// //         const id = a.assetID;

// //         if (id === null || id === undefined) return false; // null/undefined
// //         if (typeof id === "number" && Number.isNaN(id)) return false; // actual NaN

// //         const str = String(id).trim().toLowerCase(); // normalize
// //         if (str === "" || str === "nan") return false; // empty or string "nan"

// //         return true; // valid
// //       })
// //       .map((a) => {
// //         const str = String(a.assetID).trim();
// //         return {
// //           label: str,
// //           value: str,
// //         };
// //       });
// //   }, [assetsByEquipment]);

// //   /* ------------------ RESET LOGIC ------------------ */
// //   // useEffect(() => {
// //   //   if (area && !areaOptions.some((o) => o.value === area)) {
// //   //     setValue("area", "");
// //   //     setValue("equipment", "");
// //   //     setValue("assetID", "");
// //   //   }
// //   // }, [area, areaOptions, setValue]);

// //   // useEffect(() => {
// //   //   if (equipment && !equipmentOptions.some((o) => o.value === equipment)) {
// //   //     setValue("equipment", "");
// //   //     setValue("assetID", "");
// //   //   }
// //   // }, [equipment, equipmentOptions, setValue]);

// //   // useEffect(() => {
// //   //   if (assetID && !assetIdOptions?.some((o) => o.value === assetID)) {
// //   //     setValue("assetID", "");
// //   //   }
// //   // }, [assetID, assetIdOptions, setValue]);

// //   return {
// //     locationOptions,
// //     areaOptions,
// //     equipmentOptions,
// //     assetIdOptions,
// //     isFieldValid: {
// //       area: !area || areaOptions.some((o) => o.value === area),
// //       equipment:
// //         !equipment || equipmentOptions.some((o) => o.value === equipment),
// //       assetID: !assetID || assetIdOptions.some((o) => o.value === assetID),
// //     },
// //   };
// // };
