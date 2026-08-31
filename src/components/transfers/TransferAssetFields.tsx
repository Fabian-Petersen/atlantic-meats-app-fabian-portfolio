import { ChevronDown, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { TransferRequestFormValues } from "../../schemas";
import { useAssetFilters } from "@/customHooks/useAssetFilters";

import DynamicForm, { type DynamicFormField } from "../forms/DynamicForm";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { AnimatePresence, motion } from "framer-motion";
import { motionVariants } from "@/styles/motionStyles";

interface TransferAssetFieldsProps {
  form: UseFormReturn<TransferRequestFormValues>;
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

const TransferAssetFields = ({
  form,
  assetIndex,
  isOpen,
  onToggle,
  onRemove,
  canRemove,
}: TransferAssetFieldsProps) => {
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

  const assetSectionFields: DynamicFormField<TransferRequestFormValues>[] =
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
                } as DynamicFormField<TransferRequestFormValues>,
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

  const fields: DynamicFormField<TransferRequestFormValues>[] = [
    {
      fieldType: "select",
      name: `assets.${assetIndex}.area`,
      label: "Area",
      placeholder: "Select Area",
      options: areaSelectOptions,
      disabled: !form.watch("locationFrom") || isLocationsLoading,
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
    <div className={cn(sharedStyles.formInputDefault, "py-0")}>
      {/* --------------------------------------------------------------------- */}
      {/* Collapsible header                                                    */}
      {/* --------------------------------------------------------------------- */}

      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex justify-between items-center w-full">
            <div className="min-w-0">
              <h3 className="font-semibold">Asset {assetIndex + 1}</h3>

              {!isOpen && (
                <p className="truncate text-xs text-gray-500 mt-1 flex gap-2">
                  <span>
                    {equipment ||
                      assetID ||
                      area ||
                      "Asset details not completed"}
                  </span>
                  <span>{area && equipment && assetID && "-"}</span>
                  <span>{assetID}</span>
                </p>
              )}
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 transition-transform duration-200 hover:cursor-pointer ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove asset ${assetIndex + 1}`}
            className="shrink-0 rounded-md p-2 text-red-500 hover:bg-red-50 hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

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
            className="overflow-hidden py-2"
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

            {/* {isPending && (
              <p className="mt-3 text-sm text-muted-foreground">
                Loading asset options...
              </p>
            )} */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransferAssetFields;
