import { AnimatePresence, motion } from "framer-motion";
import type { Path, UseFormReturn } from "react-hook-form";

import type {
  CreateJobRequestFormValues,
  PresignedUrls,
  UpdateJobRequestFormValues,
} from "@/schemas/jobSchemas";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/styles/motionStyles";
import { sharedStyles } from "@/styles/shared";
import DynamicForm, { type DynamicFormField } from "../forms/DynamicForm";
import { AssetSectionHeader } from "../forms/AssetSectionHeader";

type JobAssetFormValues =
  | CreateJobRequestFormValues
  | UpdateJobRequestFormValues;

interface JobAssetFieldsProps<TForm extends JobAssetFormValues> {
  form: UseFormReturn<TForm>;
  assetIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
  existingImages?: PresignedUrls[];
  onRemoveExistingImage?: (image: PresignedUrls) => void;
  initialAsset?: {
    area?: string;
    equipment?: string;
    assetID?: string;
  };
  unifiedImageGallery?: boolean;
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

const JobAssetFields = <TForm extends JobAssetFormValues>({
  form,
  assetIndex,
  isOpen,
  onToggle,
  onRemove,
  canRemove,
  existingImages = [],
  onRemoveExistingImage,
  initialAsset,
  unifiedImageGallery = false,
}: JobAssetFieldsProps<TForm>) => {
  const path = (name: string) => name as Path<TForm>;
  const area = form.watch(path(`assets.${assetIndex}.area`)) as string;
  const equipment = form.watch(
    path(`assets.${assetIndex}.equipment`),
  ) as string;
  const assetID = form.watch(path(`assets.${assetIndex}.assetID`)) as string;
  const assetIssueReason = form.watch(
    path(`assets.${assetIndex}.assetIssueReason`),
  ) as string;

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
    locationField: path("location"),
    assetIndex,
    preserveValues: {
      area: initialAsset?.area,
      equipment:
        area === initialAsset?.area ? initialAsset?.equipment : undefined,
      assetID:
        area === initialAsset?.area &&
        equipment === initialAsset?.equipment
          ? initialAsset?.assetID
          : undefined,
    },
  });

  const showUnidentifiedAssetWorkflow =
    !!equipment && !hasVerifiedAssets && allowUnidentifiedAsset;

  const includeCurrentOption = (
    options: string[],
    currentValue?: string,
  ): string[] =>
    currentValue && !options.includes(currentValue)
      ? [currentValue, ...options]
      : options;

  const assetIdField: DynamicFormField<TForm>[] =
    showUnidentifiedAssetWorkflow
      ? [
          {
            fieldType: "select",
            name: path(`assets.${assetIndex}.assetIssueReason`),
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
                  name: path(`assets.${assetIndex}.assetIssueDetails`),
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
            name: path(`assets.${assetIndex}.assetID`),
            label: "Asset ID",
            placeholder: "Select Asset ID",
            options: includeCurrentOption(
              normalizeOptions(assetIdOptions),
              assetID,
            ),
            required: false,
            disabled: !area || !equipment || isAssetLoading,
          },
        ];

  const fields: DynamicFormField<TForm>[] = [
    {
      fieldType: "select",
      name: path(`assets.${assetIndex}.area`),
      label: "Area",
      placeholder: "Select Area",
      options: includeCurrentOption(normalizeOptions(areaOptions), area),
      required: true,
      disabled: !form.watch(path("location")) || isLocationsLoading,
    },
    {
      fieldType: "select",
      name: path(`assets.${assetIndex}.equipment`),
      label: "Equipment",
      placeholder: "Select Equipment",
      options: includeCurrentOption(
        normalizeOptions(equipmentOptions),
        equipment,
      ),
      required: true,
      disabled: !area,
    },
    ...assetIdField,
    {
      fieldType: "file",
      name: path(`assets.${assetIndex}.images`),
      label: unifiedImageGallery ? "Images" : "Upload Images",
      placeholder: "",
      multiple: true,
      className: unifiedImageGallery
        ? "md:col-span-2"
        : "md:col-span-1",
      existingFiles: existingImages,
      onRemoveExisting: onRemoveExistingImage,
      galleryMode: unifiedImageGallery,
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
            <DynamicForm<TForm>
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
