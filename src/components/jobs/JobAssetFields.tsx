import { AnimatePresence, motion } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";

import type { CreateJobRequestFormValues } from "@/schemas/jobSchemas";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/styles/motionStyles";
import { sharedStyles } from "@/styles/shared";
import DynamicForm, { type DynamicFormField } from "../forms/DynamicForm";
import { AssetSectionHeader } from "../forms/AssetSectionHeader";

interface JobAssetFieldsProps {
  form: UseFormReturn<CreateJobRequestFormValues>;
  assetIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

const normalizeOptions = (
  options:
    | Array<string>
    | Array<{ label: string; value: string }>
    | undefined
    | null,
): string[] =>
  options?.map((option) =>
    typeof option === "string" ? option : option.value,
  ) ?? [];

const JobAssetFields = ({
  form,
  assetIndex,
  isOpen,
  onToggle,
  onRemove,
  canRemove,
}: JobAssetFieldsProps) => {
  const area = form.watch(`assets.${assetIndex}.area`);
  const equipment = form.watch(`assets.${assetIndex}.equipment`);
  const assetID = form.watch(`assets.${assetIndex}.assetID`);
  const assetIssueReason = form.watch(
    `assets.${assetIndex}.assetIssueReason`,
  );

  const {
    equipmentOptions,
    assetIdOptions,
    areaOptions,
    hasVerifiedAssets,
    allowUnidentifiedAsset,
    isError,
    isLocationsLoading,
    isAssetLoading,
  } = useAssetFilters({
    form,
    locationField: "location",
    assetIndex,
  });

  const showUnidentifiedAssetWorkflow =
    !!equipment && !hasVerifiedAssets && allowUnidentifiedAsset;

  const assetIdField: DynamicFormField<CreateJobRequestFormValues>[] =
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
                  fieldType: "textarea" as const,
                  name: `assets.${assetIndex}.assetIssueDetails` as const,
                  label: "Please describe the issue",
                  rows: 2,
                  required: true,
                  className: "md:col-span-2",
                },
              ]
            : []),
        ]
      : [
          {
            fieldType: "select",
            name: `assets.${assetIndex}.assetID`,
            label: "Asset ID",
            placeholder: "Select Asset ID",
            options: normalizeOptions(assetIdOptions),
            required: false,
            disabled: !area || !equipment || isAssetLoading,
          },
        ];

  const fields: DynamicFormField<CreateJobRequestFormValues>[] = [
    {
      fieldType: "select",
      name: `assets.${assetIndex}.area`,
      label: "Area",
      placeholder: "Select Area",
      options: normalizeOptions(areaOptions),
      disabled: !form.watch("location") || isLocationsLoading,
    },
    {
      fieldType: "select",
      name: `assets.${assetIndex}.equipment`,
      label: "Equipment",
      placeholder: "Select Equipment",
      options: normalizeOptions(equipmentOptions),
      required: true,
      disabled: !area,
    },
    ...assetIdField,
    {
      fieldType: "file",
      name: `assets.${assetIndex}.images`,
      label: "Upload Images",
      placeholder: "",
      multiple: true,
      className: "md:col-span-1",
    },
  ];

  return (
    <div className={cn(sharedStyles.formInputDefault, "px-0 py-0")}>
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

export default JobAssetFields;
