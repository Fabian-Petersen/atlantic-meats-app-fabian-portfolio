/**
 * This is a custom hook that generates the field configuration for the disposal request form. It uses react-hook-form's useWatch to monitor changes in specific form fields and dynamically updates the options for dependent select fields based on the selected values. The hook also includes logic to reset dependent fields when their parent field values change, ensuring that the form remains consistent and valid.
 *
 */

import { type DisposalRequestFormValues } from "@/schemas/disposalsSchemas";
import { type UseFormReturn } from "react-hook-form";

import type { DynamicFormField } from "../DynamicForm";

import { useAssetFilters } from "@/customHooks/useAssetFilters";

// $ ————————————————————————————————————————————————————————————————
// $ Helpers
// $ ————————————————————————————————————————————————————————————————

/**
 * Converts the option format returned by useAssetFilters into the
 * string[] format expected by DynamicForm select fields.
 *
 * The backend returns objects such as:
 *
 * {
 *   label: "Maitland",
 *   value: "Maitland"
 * }
 *
 * DynamicForm expects:
 *
 * ["Maitland"]
 *
 * Keeping this conversion here means the asset hook can retain a
 * richer API response without coupling itself to DynamicForm.
 */
const normalizeOptions = (
  options:
    | Array<string>
    | Array<{ label: string; value: string }>
    | undefined
    | null,
): string[] => {
  if (!options) {
    return [];
  }

  return options.map((option) =>
    typeof option === "string" ? option : option.value,
  );
};

// $ ————————————————————————————————————————————————————————————————
// $ Hook
// $ ————————————————————————————————————————————————————————————————
export const useDisposalsFields = (
  form: UseFormReturn<DisposalRequestFormValues>,
  assetIndex: number,
) => {
  const assetIssueReason = form.watch(`assets.${assetIndex}.assetIssueReason`);

  const location = form.watch("location");
  const area = form.watch(`assets.${assetIndex}.area`);
  const equipment = form.watch(`assets.${assetIndex}.equipment`);

  // $ ─── Backend Asset Options ─────────────────────────────────────
  //
  // useAssetFilters watches the relevant form values and requests
  // the appropriate data from the backend.
  //
  // No complete asset array is passed into this hook anymore.

  const {
    equipmentOptions,
    assetIdOptions,
    locationOptions,
    areaOptions,

    // $ Asset identification state
    hasVerifiedAssets,
    allowUnidentifiedAsset,

    // $ Query state
    isPending,
    isError,

    // $ Individual query states
    isLocationsLoading,
    isAssetLoading,
  } = useAssetFilters({
    form,
  });

  // $ ─── Asset Select Options ──────────────────────────────────────

  const locationSelectOptions = normalizeOptions(locationOptions);
  const areaSelectOptions = normalizeOptions(areaOptions);
  const equipmentSelectOptions = normalizeOptions(equipmentOptions);
  const assetIdSelectOptions = normalizeOptions(assetIdOptions);

  // $ ─── Field Configuration ───────────────────────────────────────

  const showUnidentifiedAssetWorkflow =
    !!equipment && !hasVerifiedAssets && allowUnidentifiedAsset;

  const assetSectionFields: DynamicFormField<DisposalRequestFormValues>[] =
    showUnidentifiedAssetWorkflow
      ? [
          {
            fieldType: "select",
            name: `assets.${assetIndex}.assetIssueReason`,
            label: "No Asset ID Available — Reason",
            placeholder: "Select a reason",
            options: [
              "No barcode visible",
              "barcode damaged",
              "rental unit",
              "other",
            ],
            required: true,
            disabled: !location || !area || !equipment,
          },

          ...(assetIssueReason === "other"
            ? [
                {
                  fieldType: "textarea",
                  name: `assets.${assetIndex}.assetIssueDetails`,
                  label: "Please describe the issue",
                  rows: 2,
                  required: true,
                  className: "md:col-span-2",
                } as DynamicFormField<DisposalRequestFormValues>,
              ]
            : []),
        ]
      : [
          {
            fieldType: "select",
            name: `assets.${assetIndex}.assetID`,
            label: "Asset ID",
            placeholder: "Select Asset ID",
            options: assetIdSelectOptions,
            required: false,
            disabled: !location || !area || !equipment || isAssetLoading,
          },
        ];
  // $ ─── Field Config ─────────────────────────────────
  const fields: DynamicFormField<DisposalRequestFormValues>[] = [
    // ========================================================================
    // Transfer Description / Reason
    // ========================================================================

    {
      fieldType: "textarea",
      name: "disposalReason",
      required: true,
      rows: 1,
      className: "md:col-span-2",
      label: "Reason for transfer",
    },

    // ========================================================================
    // Location From
    // ========================================================================

    {
      fieldType: "select",
      name: "location",
      label: "Location",
      placeholder: "Select Location From",
      options: locationSelectOptions,
      required: true,
    },

    // ========================================================================
    // Area
    // ========================================================================

    {
      fieldType: "select",
      name: `assets.${assetIndex}.area`,
      label: "Area",
      placeholder: "Select Area",
      options: areaSelectOptions,
      // Area cannot be selected until a location has been selected.
      disabled: !form.watch("location") || isLocationsLoading,
      required: true,
    },
    {
      fieldType: "select",
      name: `assets.${assetIndex}.equipment`,
      label: "Equipment",
      placeholder: "Select Equipment",
      options: equipmentSelectOptions,
      required: true,
    },
    // ========================================================================
    // Asset ID
    // ========================================================================
    ...assetSectionFields,

    // ========================================================================
    // Expected Date of Transfer
    // ========================================================================
    {
      fieldType: "input",
      type: "date",
      name: "expectedDisposalDate",
      label: "Expected Transit Date",
      // placeholder: "Expected Transfer Date",
    },

    // ========================================================================
    // Images
    // ========================================================================
    {
      /*
       * I would make this REQUIRED for the unidentified-asset
       * workflow at the schema/business-rule level rather than
       * simply making the field universally required here.
       *
       * This allows:
       *
       * 1. Normal asset:
       *      assetID = AST-123
       *      images optional
       *
       * 2. Missing/damaged barcode:
       *      assetID = ""
       *      images REQUIRED
       */
      fieldType: "file",
      name: `assets.${assetIndex}.images`,
      multiple: true,
      label: "Upload Images",
      className: "",
    },
  ];

  return {
    fields,
    isPending,
    isError,
    hasVerifiedAssets,
    allowUnidentifiedAsset,
  };
};
