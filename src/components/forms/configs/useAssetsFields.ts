import { type AssetRequestFormValues } from "@/schemas";

import {
  condition,
  location,
  CeateAssetFormOptionsData,
} from "@/data/assetSelectOptions";

import type { DynamicFormField } from "../DynamicForm";
import { useState } from "react";
import {
  assetTypes,
  category as assetCategories,
} from "@/schemas/assetSchemas";
type BusinessUnit = keyof typeof CeateAssetFormOptionsData.business_unit;

// $ ——— Hook ─────────────────────────────────────────────────────
type InitialAssetFieldValues = Pick<
  AssetRequestFormValues,
  "business_unit" | "area" | "equipment" | "location" | "condition"
> & {
  existingImages?: { key: string; filename: string; url: string }[];
  onRemoveExistingImage?: (file: {
    key: string;
    filename: string;
    url: string;
  }) => void;
};

export const useAssetsFields = (initialValues?: InitialAssetFieldValues) => {
  // $ Use cascading (dependent) select inputs driven directly from the data structure.
  const DATA = CeateAssetFormOptionsData;
  const initialBusinessUnit = initialValues?.business_unit;
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(() =>
    initialBusinessUnit && initialBusinessUnit in DATA.business_unit
      ? (initialBusinessUnit as BusinessUnit)
      : null,
  );
  const [category, setCategory] = useState<string | null>(
    initialValues?.area ?? null,
  );

  const businessUnitOptions = Object.keys(DATA.business_unit) as BusinessUnit[];

  const includeCurrentValue = (
    options: readonly string[] | undefined | null,
    currentValue?: string,
  ): string[] => {
    const availableOptions = options ?? [];

    if (!currentValue || availableOptions.includes(currentValue)) {
      return [...availableOptions];
    }

    return [currentValue, ...availableOptions];
  };

  const availableCategoryOptions = businessUnit
    ? Object.keys(DATA.business_unit[businessUnit].category)
    : [];

  const categoryOptions = includeCurrentValue(
    availableCategoryOptions,
    initialValues?.area,
  );

  const availableItemOptions =
    businessUnit && category
      ? DATA.business_unit[businessUnit].category[
          category as keyof (typeof DATA.business_unit)[typeof businessUnit]["category"]
        ]
      : [];

  const itemOptions = includeCurrentValue(
    availableItemOptions,
    initialValues?.equipment,
  );

  // $ sort the locations in alphabetical order
  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

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
  const fields: DynamicFormField<AssetRequestFormValues>[] = [
    {
      fieldType: "select",
      name: "location",
      label: "Location",
      placeholder: "Select Location",
      options: normalizeOptions(
        includeCurrentValue(sortedLocations, initialValues?.location),
      ),
    },
    {
      fieldType: "select",
      name: "business_unit",
      label: "Business Unit",
      placeholder: "Select Business Unit",
      options: normalizeOptions(businessUnitOptions),
      required: true,
      onChange: ([value]) => {
        setBusinessUnit(value as BusinessUnit);
        setCategory(null);
      },
    },
    {
      fieldType: "select",
      name: "area",
      label: "Area",
      placeholder: "Select Area",
      options: normalizeOptions(categoryOptions),
      required: true,
      onChange: ([value]) => {
        setCategory(value);
      },
    },

    {
      fieldType: "select",
      name: "equipment",
      label: "Equipment",
      placeholder: "Select Equipment",
      options: normalizeOptions(itemOptions),
      required: true,
    },
    {
      fieldType: "select",
      name: "assetType",
      label: "Asset Type",
      placeholder: "Select Asset Type",
      options: [...assetTypes],
      required: true,
    },
    {
      fieldType: "select",
      name: "category",
      label: "Asset Category",
      placeholder: "Select Asset Category",
      options: [...assetCategories],
      required: true,
    },
    {
      fieldType: "input",
      type: "number",
      name: "replacementValue",
      label: "Replacement Value",
      min: 0,
      step: 0.01,
      valueAsNumber: true,
      required: true,
    },
    {
      fieldType: "input",
      type: "text",
      name: "assetID",
      label: "Asset ID",
    },

    {
      fieldType: "select",
      name: "condition",
      label: "condition",
      options: includeCurrentValue(condition, initialValues?.condition),
      placeholder: "Select Condition",
      required: true,
    },
    {
      fieldType: "input",
      type: "text",
      name: "serialNumber",
      label: "serial number",
    },
    {
      fieldType: "file",
      name: "images",
      multiple: true,
      label: "Upload Images",
      placeholder: "",
      existingFiles: initialValues?.existingImages,
      onRemoveExisting: initialValues?.onRemoveExistingImage,
      className: "col-span-full",
    },
    {
      fieldType: "textarea",
      name: "additional_notes",
      label: "Notes",
      rows: 3,
      className: "lg:col-span-2",
    },
  ];

  return {
    fields,
  };
};
