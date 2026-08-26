import { type UseFormReturn } from "react-hook-form";
import type { JobRequestFormValues } from "@/schemas";
import type { DynamicFormField } from "../DynamicForm";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { impact, priority, type } from "@/data/maintenanceRequestFormData";

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

/**
 * Builds the field configuration for the Create Job Request form.
 *
 * Asset-related fields are populated by the backend-driven
 * `useAssetFilters` hook.
 *
 * The asset selection hierarchy is:
 *
 *     Location
 *        ↓
 *     Area
 *        ↓
 *     Equipment
 *        ↓
 *     Asset ID
 *
 * The frontend no longer downloads the complete asset table.
 * Instead, useAssetFilters requests the appropriate asset options
 * from the backend based on the current form selections.
 *
 * ----------------------------------------------------------------------------
 * @param form
 * React Hook Form instance for JobRequestFormValues.
 *
 * ----------------------------------------------------------------------------
 * @example
 *
 * const form = useForm<JobRequestFormValues>({
 *   defaultValues: {
 *     location: "",
 *     area: "",
 *     equipment: "",
 *     assetID: "",
 *   },
 * });
 *
 * const { fields } = useJobFields(form);
 *
 * <DynamicForm
 *   form={form}
 *   fields={fields}
 * />
 *
 * ----------------------------------------------------------------------------
 * @returns
 *
 * {
 *   fields: DynamicFormField<JobRequestFormValues>[]
 * }
 */
export const useJobFields = (form: UseFormReturn<JobRequestFormValues>) => {
  const assetIssueReason = form.watch("assetIssueReason");

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
    isLocationLoading,
    isAreaLoading,
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
    !!form.watch("equipment") && !hasVerifiedAssets && allowUnidentifiedAsset;

  const assetSectionFields: DynamicFormField<JobRequestFormValues>[] =
    showUnidentifiedAssetWorkflow
      ? [
          {
            fieldType: "select",
            name: "assetIssueReason",
            label: "No Asset ID Unavailable — Reason",
            placeholder: "Select a reason",
            options: [
              "No barcode visible",
              "barcode damaged",
              "rental unit",
              "other",
            ],
            required: true,
            disabled:
              !form.watch("location") ||
              !form.watch("area") ||
              !form.watch("equipment"),
          },
          ...(assetIssueReason === "other"
            ? [
                {
                  fieldType: "textarea",
                  name: "assetIssueDetails",
                  label: "Please describe the issue",
                  rows: 2,
                  required: true,
                  className: "md:col-span-2",
                } as DynamicFormField<JobRequestFormValues>,
              ]
            : []),
        ]
      : [
          {
            fieldType: "select",
            name: "assetID",
            label: "Asset ID",
            placeholder: "Select Asset ID",
            options: assetIdSelectOptions,
            required: false,
            disabled:
              !form.watch("location") ||
              !form.watch("area") ||
              !form.watch("equipment") ||
              isAssetLoading,
          },
        ];

  const fields: DynamicFormField<JobRequestFormValues>[] = [
    // ========================================================================
    // Job Description
    // ========================================================================

    {
      fieldType: "textarea",
      name: "description",
      label: "Enter a job description",
      rows: 1,
      className: "md:col-span-2",
      required: true,
    },

    // ========================================================================
    // Location
    // ========================================================================

    {
      fieldType: "select",
      name: "location",
      label: "Location",
      placeholder: "Select Location",
      options: locationSelectOptions,
      required: true,
      // Optional loading support if DynamicForm supports these properties.
      // Remove these two properties if DynamicFormField does not define them.
      // isLoading: isLocationsLoading,
      disabled: isLocationsLoading,
    },

    // ========================================================================
    // Area
    // ========================================================================

    {
      fieldType: "select",
      name: "area",
      label: "Area",
      placeholder: "Select Area",
      options: areaSelectOptions,
      // Area cannot be selected until a location has been selected.
      disabled: !form.watch("location") || isLocationLoading,
      // isLoading: isLocationLoading,
    },

    // ========================================================================
    // Equipment
    // ========================================================================
    {
      fieldType: "select",
      name: "equipment",
      label: "Equipment",
      placeholder: "Select Equipment",
      options: equipmentSelectOptions,
      required: true,
      disabled: !form.watch("location") || !form.watch("area") || isAreaLoading,
      // isLoading: !isAreaLoading,
    },

    // ========================================================================
    // Asset ID
    // ========================================================================
    ...assetSectionFields,

    // ========================================================================
    // Breakdown Time
    // ========================================================================

    {
      fieldType: "input",
      type: "datetime-local",
      name: "breakdown_time",
      label: "Breakdown Time",
      required: true,
      placeholder: "",
    },

    // ========================================================================
    // Job Type
    // ========================================================================

    {
      fieldType: "select",
      name: "type",
      label: "Type",
      placeholder: "Select Type",
      options: normalizeOptions(type),
      required: true,
    },

    // ========================================================================
    // Impact
    // ========================================================================

    {
      fieldType: "select",
      name: "impact",
      label: "Impact",
      placeholder: "Select Impact",
      options: normalizeOptions(impact),
      required: true,
    },

    // ========================================================================
    // Priority
    // ========================================================================

    {
      fieldType: "select",
      name: "priority",
      label: "Priority",
      placeholder: "Select Priority",
      options: normalizeOptions(priority),
      required: true,
    },

    // ========================================================================
    // Images
    // ========================================================================

    {
      fieldType: "file",
      name: "images",
      label: "Upload Images",
      placeholder: "",
      multiple: true,

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
    },

    // ========================================================================
    // Additional Information
    // ========================================================================

    {
      fieldType: "textarea",
      name: "jobComments",
      label: "Additional Information",
      rows: 4,
      className: "lg:col-span-2",
    },
  ];

  // $ ─── Return ────────────────────────────────────────────────────

  return {
    fields,

    // Useful to the parent component if it needs to display
    // loading/error states outside DynamicForm.
    isPending,
    isError,

    // Asset identification state.
    hasVerifiedAssets,
    allowUnidentifiedAsset,
  };
};
