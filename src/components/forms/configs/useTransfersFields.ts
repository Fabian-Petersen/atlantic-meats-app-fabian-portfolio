import { type TransferRequestFormValues } from "@/schemas";

import { location, CeateAssetFormOptionsData } from "@/data/assetSelectOptions";

import type { DynamicFormField } from "../DynamicForm";
import { useState } from "react";
type BusinessUnit = keyof typeof CeateAssetFormOptionsData.business_unit;

// $ ——— Hook ─────────────────────────────────────────────────────
export const useTransfersFields = () => {
  // $ Use cascading (dependent) select inputs driven directly from the data structure.
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const DATA = CeateAssetFormOptionsData;

  const businessUnitOptions = Object.keys(DATA.business_unit) as BusinessUnit[];

  const categoryOptions = businessUnit
    ? Object.keys(DATA.business_unit[businessUnit].category)
    : [];

  const itemOptions =
    businessUnit && category
      ? DATA.business_unit[businessUnit].category[
          category as keyof (typeof DATA.business_unit)[typeof businessUnit]["category"]
        ]
      : [];

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
  const fields: DynamicFormField<TransferRequestFormValues>[] = [
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
      name: "locationFrom",
      label: "Location From",
      placeholder: "Select Location From",
      options: normalizeOptions(sortedLocations),
      required: true,
    },
    {
      fieldType: "select",
      name: "locationTo",
      label: "Location To",
      placeholder: "Select Location To",
      options: normalizeOptions(sortedLocations),
      required: true,
    },
    {
      fieldType: "select",
      name: "equipment",
      label: "Equipment",
      placeholder: "Select Equipment",
      options: normalizeOptions(itemOptions),
      required: true,
    },
    // $ Add logic where a asset dont have a barcode to be transferred
    // {
    //   fieldType: "radio",
    //   name: "hasBarcode",
    //   label: "Does the asset have a valid barcode ID",
    //   options: [
    //     { label: "Yes", value: "yes" },
    //     { label: "No", value: "no" },
    //   ],
    // },

    {
      fieldType: "input",
      type: "text",
      name: "assetID",
      label: "Asset ID",
    },
    {
      fieldType: "input",
      type: "date",
      name: "expectedTransferDate",
      label: "Expected Transfer Date",
      placeholder: "Expected Transfer Date",
    },
    {
      fieldType: "file",
      name: "images",
      multiple: true,
      label: "Upload Images",
    },
  ];

  return {
    fields,
  };
};
