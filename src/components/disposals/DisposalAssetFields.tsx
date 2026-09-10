import type { UseFormReturn } from "react-hook-form";

import type { DisposalRequestFormValues } from "@/schemas/disposalsSchemas";
import { useAssetFilters } from "@/customHooks/useAssetFilters";

import DynamicForm, { type DynamicFormField } from "../forms/DynamicForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";
import { AssetSectionHeader } from "../forms/AssetSectionHeader";

interface DisposalAssetFieldsProps {
  form: UseFormReturn<DisposalRequestFormValues>;
  assetIndex: number;

  /**
   * Controls whether the asset fields are currently visible.
   * The parent owns this state so it can automatically collapse
   * the previous asset when a new asset is added.
   */
  isOpen: boolean;

  /**
   * Called when the user clicks the asset header/chevron.
   */
  onToggle: () => void;

  /**
   * Removes this asset from the useFieldArray.
   */
  onRemove: () => void;

  /**
   * Prevents removing the final asset.
   */
  canRemove: boolean;
}

const normalizeOptions = (
  options:
    | Array<string>
    | Array<{ label: string; value: string }>
    | undefined
    | null,
): string[] => {
  if (!options) return [];

  return options.map((option) =>
    typeof option === "string" ? option : option.value,
  );
};

const DisposalAssetFields = ({
  form,
  assetIndex,
  isOpen,
  onToggle,
  onRemove,
  canRemove,
}: DisposalAssetFieldsProps) => {
  // ---------------------------------------------------------------------------
  // Asset values
  // ---------------------------------------------------------------------------

  const area = form.watch(`assets.${assetIndex}.area`);
  const equipment = form.watch(`assets.${assetIndex}.equipment`);
  const assetID = form.watch(`assets.${assetIndex}.assetID`);
  const assetIssueReason = form.watch(`assets.${assetIndex}.assetIssueReason`);

  // const images = form.watch(`assets.${assetIndex}.images`);
  // const invoices = form.watch("transportInvoices");

  // console.log("invoices:", invoices);
  // console.log(`Asset ${assetIndex + 1} images:`, images);

  // ---------------------------------------------------------------------------
  // Asset filters
  // ---------------------------------------------------------------------------

  const {
    equipmentOptions,
    assetIdOptions,
    areaOptions,

    hasVerifiedAssets,
    allowUnidentifiedAsset,

    // isPending,
    isError,

    isLocationsLoading,
    isAssetLoading,
  } = useAssetFilters({
    form,
    assetIndex,
  });

  // ---------------------------------------------------------------------------
  // Options
  // ---------------------------------------------------------------------------

  const areaSelectOptions = normalizeOptions(areaOptions);
  const equipmentSelectOptions = normalizeOptions(equipmentOptions);
  const assetIdSelectOptions = normalizeOptions(assetIdOptions);

  // ---------------------------------------------------------------------------
  // Unidentified asset workflow
  // ---------------------------------------------------------------------------

  const showUnidentifiedAssetWorkflow =
    !!equipment && !hasVerifiedAssets && allowUnidentifiedAsset;

  // ---------------------------------------------------------------------------
  // Fields
  // ---------------------------------------------------------------------------

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
            disabled: !area || !equipment,
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
            disabled: !area || !equipment || isAssetLoading,
          },
        ];

  const fields: DynamicFormField<DisposalRequestFormValues>[] = [
    {
      fieldType: "select",
      name: `assets.${assetIndex}.area`,
      label: "Area",
      placeholder: "Select Area",
      options: areaSelectOptions,
      disabled: !form.watch("location") || isLocationsLoading,
      required: true,
    },

    {
      fieldType: "select",
      name: `assets.${assetIndex}.equipment`,
      label: "Equipment",
      placeholder: "Select Equipment",
      options: equipmentSelectOptions,
      disabled: !area,
      required: true,
    },

    ...assetSectionFields,

    {
      fieldType: "file",
      name: `assets.${assetIndex}.images`,
      multiple: true,
      label: "Upload Images",
      className: "md:col-span-1",
      placeholder: "",
    },
  ];

  return (
    <div className={cn(sharedStyles.formInputDefault, "px-0 py-0")}>
      {/* --------------------------------------------------------------------- */}
      {/* Collapsible header                                                    */}
      {/* --------------------------------------------------------------------- */}

      <AssetSectionHeader
        assetNumber={assetIndex + 1}
        isOpen={isOpen}
        summary={
          [equipment, assetID || area].filter(Boolean).join(" • ") ||
          "Asset details not completed"
        }
        onToggle={onToggle}
        onRemove={onRemove}
        canRemove={canRemove}
      />

      {/* --------------------------------------------------------------------- */}
      {/* Asset fields                                                          */}
      {/* --------------------------------------------------------------------- */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={motionVariants.expandable}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden px-2 py-2"
          >
            <DynamicForm
              form={form}
              fields={fields}
              renderFieldsOnly
              gridClassName="gap-6"
            />

            {isError && (
              <p className="mt-3 text-sm text-red-600">
                Failed to load asset options.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DisposalAssetFields;
