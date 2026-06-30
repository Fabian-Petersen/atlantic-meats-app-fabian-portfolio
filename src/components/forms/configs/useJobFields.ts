import { useWatch, type UseFormReturn } from "react-hook-form";
import {
  type JobRequestFormValues,
  type AssetRequestFormValues,
} from "@/schemas";

import type { DynamicFormField } from "../DynamicForm";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { impact, priority, type } from "@/data/maintenanceRequestFormData";

// $ ——— Hook ─────────────────────────────────────────────────────
export const useJobFields = (
  form: UseFormReturn<JobRequestFormValues>,
  assetsArray: AssetRequestFormValues[],
) => {
  // $ ─── Watch Dependent Values ─────────────────────────────────
  const selectedLocation = useWatch({
    control: form.control,
    name: "location",
  });

  const selectedArea = useWatch({
    control: form.control,
    name: "area",
  });

  const selectedEquipment = useWatch({
    control: form.control,
    name: "equipment",
  });

  const selectedAssetID = useWatch({
    control: form.control,
    name: "assetID",
  });

  // $ ─── Dynamic Asset Filters ─────────────────────────────────────
  const { equipmentOptions, assetIdOptions, locationOptions, areaOptions } =
    useAssetFilters({
      assets: assetsArray || [], // ✅ default to empty array if assets is undefined
      location: selectedLocation,
      area: selectedArea,
      equipment: selectedEquipment,
      assetID: selectedAssetID,
      setValue: form.setValue,
    });

  // $ ─── Helpers ──────────────────────────────────────
  /**
   * Safely converts any option shape to plain string values.
   * Returns [] if the source array is undefined/null so that
   * FormRowSelect never receives undefined and tries to .map() it.
   */
  const normalizeOptions = (
    options:
      | Array<string>
      | Array<{ label: string; value: string }>
      | undefined
      | null,
  ): string[] => {
    if (!options) return []; // ✅ guard against undefined/null from async data
    return options.map((option) =>
      typeof option === "string" ? option : option.value,
    );
  };

  // $ ─── Field Config ─────────────────────────────────
  const fields: DynamicFormField<JobRequestFormValues>[] = [
    {
      fieldType: "textarea",
      name: "description",
      label: "Enter a job description",
      rows: 1,
      className: "md:col-span-2",
      required: true,
    },
    {
      fieldType: "select",
      name: "location",
      label: "Location",
      placeholder: "Select Location",
      // ✅ always an array, even when assets haven't loaded yet
      options: normalizeOptions(locationOptions),
      required: true,
    },

    {
      fieldType: "select",
      name: "area",
      label: "Area",
      placeholder: "Select Area",
      options: normalizeOptions(areaOptions),
    },

    {
      fieldType: "select",
      name: "equipment",
      label: "Equipment",
      placeholder: "Select Equipment",
      options: normalizeOptions(equipmentOptions),
      required: true,
    },

    {
      fieldType: "select",
      name: "assetID",
      label: "Asset ID",
      placeholder: "Select Asset ID",
      options: normalizeOptions(assetIdOptions),
    },
    {
      fieldType: "input",
      type: "datetime-local",
      name: "breakdown_time",
      label: "Breakdown Time",
      required: true,
      placeholder: "",
    },

    {
      fieldType: "select",
      name: "type",
      label: "Type",
      placeholder: "Select Type",
      options: normalizeOptions(type),
      required: true,
    },

    {
      fieldType: "select",
      name: "impact",
      label: "Impact",
      placeholder: "Select Impact",
      options: normalizeOptions(impact),
      required: true,
    },

    {
      fieldType: "select",
      name: "priority",
      label: "Priority",
      placeholder: "Select Priority",
      options: normalizeOptions(priority),
      required: true,
    },

    {
      fieldType: "file",
      name: "images",
      label: "Upload Images",
      multiple: true,
    },

    {
      fieldType: "textarea",
      name: "jobComments",
      label: "Additional Information",
      rows: 4,
      className: "lg:col-span-2",
    },
  ];

  return {
    fields,
  };
};

export const total_cost_by_store = [
  {
    "2025": {
      maitland: "8000",
      bellville: "6500",
    },
  },
  {
    "2026": {
      maitland: "8000",
      bellville: "6500",
    },
  },
];

export const costs = {
  "2026": [
    { name: "maitland", value: 18740.0 },
    { name: "bellville", value: 12620.0 },
  ],
};
