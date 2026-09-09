import { ChevronDown, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";

import type { CreateJobRequestFormValues } from "@/schemas/jobSchemas";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/styles/motionStyles";
import { sharedStyles } from "@/styles/shared";
import DynamicForm, { type DynamicFormField } from "../forms/DynamicForm";

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
    <div className={cn(sharedStyles.formInputDefault, "py-0")}>
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex w-full items-center justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold">Asset {assetIndex + 1}</h3>
              {!isOpen && (
                <p className="mt-1 flex gap-2 truncate text-xs text-gray-500">
                  <span>
                    {equipment || assetID || area || "Asset details not completed"}
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
            className="shrink-0 rounded-md p-2 text-red-500 hover:cursor-pointer hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobAssetFields;
