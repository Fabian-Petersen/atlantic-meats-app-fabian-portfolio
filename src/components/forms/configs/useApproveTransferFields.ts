import {
  type TransferRequestFormValues,
  type AssetRequestFormValues,
} from "@/schemas";
import { useWatch, type UseFormReturn } from "react-hook-form";

import type { DynamicFormField } from "../DynamicForm";

import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { useAssetFilterReset } from "@/customHooks/useAssetFilterReset";

// $ ——— Hook ─────────────────────────────────────────────────────
export const useTransfersFields = (
  form: UseFormReturn<TransferRequestFormValues>,
  assetsArray: AssetRequestFormValues[],
) => {
  // $ ─── Watch Dependent Values ─────────────────────────────────
  const selectedLocation = useWatch({
    control: form.control,
    name: "locationFrom",
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
  const {
    equipmentOptions,
    assetIdOptions,
    locationOptions,
    areaOptions,
    isFieldValid,
  } = useAssetFilters({
    assets: assetsArray || [], // ✅ default to empty array if assets is undefined
    location: selectedLocation,
    area: selectedArea,
    equipment: selectedEquipment,
    assetID: selectedAssetID,
  });

  /* ------------------ RESET LOGIC ------------------ */
  useAssetFilterReset({
    resetArea: () => {
      form.setValue("area", "");
      form.setValue("equipment", "");
      form.setValue("assetID", "");
    },
    resetEquipment: () => {
      form.setValue("equipment", "");
      form.setValue("assetID", "");
    },
    resetAssetID: () => {
      form.setValue("assetID", "");
    },
    validity: isFieldValid,
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
  const fields: DynamicFormField<TransferRequestFormValues>[] = [
    {
      fieldType: "textarea",
      name: "transferReason",
      required: true,
      rows: 1,
      className: "md:col-span-2",
      label: "Reason for transfer",
    },
    {
      fieldType: "select",
      name: "locationFrom",
      label: "Location From",
      placeholder: "Select Location From",
      options: normalizeOptions(locationOptions),
      required: true,
    },
    {
      fieldType: "select",
      name: "locationTo",
      label: "Location To",
      placeholder: "Select Location To",
      options: normalizeOptions(locationOptions),
      required: true,
    },
    {
      fieldType: "select",
      name: "area",
      label: "Area",
      placeholder: "Select Area",
      options: normalizeOptions(areaOptions),
      required: true,
    },
    {
      fieldType: "select",
      name: "equipment",
      label: "Equipment",
      placeholder: "Select Equipment",
      options: normalizeOptions(equipmentOptions),
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
      fieldType: "select",
      name: "assetID",
      label: "Asset ID",
      placeholder: "Select Asset ID",
      options: normalizeOptions(assetIdOptions),
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
