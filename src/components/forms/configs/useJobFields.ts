import { useWatch, type UseFormSetValue, type Control } from "react-hook-form";

import type { JobRequestFormValues, AssetRequestFormValues } from "@/schemas";

import type { DynamicFormField } from "../DynamicForm";

import { useAssetFilters } from "@/customHooks/useAssetFilters";

import { impact, priority, type } from "@/data/maintenanceRequestFormData";

type UseJobFieldsProps = {
  control: Control<JobRequestFormValues>;
  setValue: UseFormSetValue<JobRequestFormValues>;
  assets: AssetRequestFormValues[];
};

export const useJobFields = ({
  control,
  setValue,
  assets,
}: UseJobFieldsProps) => {
  // ─── Watch Dependent Values ───────────────────────
  const selectedLocation = useWatch({
    control,
    name: "location",
  });

  const selectedArea = useWatch({
    control,
    name: "area",
  });

  const selectedEquipment = useWatch({
    control,
    name: "equipment",
  });

  const selectedAssetID = useWatch({
    control,
    name: "assetID",
  });

  // ─── Dynamic Asset Filters ───────────────────────
  const { equipmentOptions, assetIdOptions, locationOptions, areaOptions } =
    useAssetFilters({
      assets,
      location: selectedLocation,
      equipment: selectedEquipment,
      assetID: selectedAssetID,
      area: selectedArea,
      setValue,
    });

  // ─── Dynamic Fields ──────────────────────────────
  const normalizeOptions = (
    options: Array<string> | Array<{ label: string; value: string }>,
  ): string[] =>
    options.map((option) =>
      typeof option === "string" ? option : option.value,
    );

  const fields: DynamicFormField<JobRequestFormValues>[] = [
    {
      fieldType: "textarea",
      name: "description",
      label: "Enter a job description",
      rows: 1,
      className: "lg:col-span-2",
      required: true,
    },

    {
      fieldType: "select",
      name: "location",
      label: "Select Location",
      options: normalizeOptions(locationOptions),
      required: true,
    },

    {
      fieldType: "select",
      name: "area",
      label: "Select Area",
      options: normalizeOptions(areaOptions),
    },

    {
      fieldType: "select",
      name: "equipment",
      label: "Select Equipment",
      options: normalizeOptions(equipmentOptions),
      required: true,
    },

    {
      fieldType: "select",
      name: "assetID",
      label: "Select Asset ID",
      options: normalizeOptions(assetIdOptions),
    },

    {
      fieldType: "select",
      name: "type",
      label: "Select Type",
      options: normalizeOptions(type),
      required: true,
    },

    {
      fieldType: "select",
      name: "impact",
      label: "Select Impact",
      options: normalizeOptions(impact),
      required: true,
    },

    {
      fieldType: "select",
      name: "priority",
      label: "Select Priority",
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
      label: "Comments",
      rows: 4,
      className: "lg:col-span-2",
    },
  ];

  return {
    fields,
  };
};
