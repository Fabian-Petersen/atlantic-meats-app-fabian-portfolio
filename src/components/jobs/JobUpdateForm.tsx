import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";

import useGlobalContext from "@/context/useGlobalContext";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { impact, priority, type } from "@/data/maintenanceRequestFormData";
import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";
import { useById, useUpdateItem } from "@/utils/api";
import type { PresignedUrlResponse } from "@/schemas";
import {
  updateJobRequestSchema,
  type JobApprovedAPIResponse,
  type PresignedUrls,
  type UpdateJobRequestFormValues,
  type UpdateJobRequestPayload,
} from "@/schemas/jobSchemas";
import DynamicForm, {
  DynamicFormActions,
  type DynamicFormField,
} from "../forms/DynamicForm";
import { FormSkeleton } from "../forms/FormSkeleton";
import FormInfo from "../features/forms/FormInfo";
import { AddAssetButton } from "../forms/AddAssetButton";
import JobAssetFields from "./JobAssetFields";

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

const includeCurrentOption = (options: string[], currentValue?: string) =>
  currentValue && !options.includes(currentValue)
    ? [currentValue, ...options]
    : options;

const toDateTimeLocal = (value?: string) => {
  if (!value) return "";
  return value.length >= 16 ? value.slice(0, 16) : value;
};

const toAssetIssueReason = (
  value?: string,
): UpdateJobRequestFormValues["assets"][number]["assetIssueReason"] => {
  const reasons = [
    "No barcode visible",
    "barcode damaged",
    "rental unit",
    "other",
    "",
  ] as const;
  return reasons.find((reason) => reason === value) ?? "";
};

type JobUpdateEditorProps = {
  id: string;
  item: JobApprovedAPIResponse;
  requestStatus: "pending" | "in progress";
};

const JobUpdateEditor = ({
  id,
  item,
  requestStatus,
}: JobUpdateEditorProps) => {
  const navigate = useNavigate();
  const isPendingRequest = requestStatus === "pending";
  const returnPath = isPendingRequest
    ? "jobs/pending-approval"
    : "jobs/in-progress";
  const [openAssetIndex, setOpenAssetIndex] = useState(-1);
  const {
    setShowUpdateMaintenanceDialog,
    setSuccessConfig,
    setShowSuccess,
    setErrorConfig,
    setShowError,
  } = useGlobalContext();

  const initialAssets = item.assets?.length
    ? item.assets
    : [
        {
          equipment: item.equipment,
          assetID: item.assetID,
          area: item.area,
          assetIssueReason: item.assetIssueReason,
          assetIssueDetails: item.assetIssueDetails,
          images: item.images ?? [],
        },
      ];

  const [existingImagesByAsset, setExistingImagesByAsset] = useState<
    PresignedUrls[][]
  >(() => initialAssets.map((asset) => asset.images ?? []));
  const [preservedAssets, setPreservedAssets] = useState(() =>
    initialAssets.map((asset) => ({
      area: asset.area,
      equipment: asset.equipment,
      assetID: asset.assetID,
    })),
  );
  const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([]);

  const form = useForm<
    UpdateJobRequestFormValues,
    unknown,
    UpdateJobRequestFormValues
  >({
    resolver: zodResolver(
      updateJobRequestSchema,
    ) as unknown as Resolver<UpdateJobRequestFormValues>,
    defaultValues: {
      description: item.description ?? "",
      location: item.location ?? "",
      type: item.type ?? "",
      impact: item.impact ?? "",
      priority: item.priority ?? "",
      breakdown_time: toDateTimeLocal(item.breakdown_time),
      assets: initialAssets.map((asset) => ({
        area: asset.area ?? "",
        equipment: asset.equipment ?? "",
        assetID: asset.assetID ?? "",
        assetIssueReason: toAssetIssueReason(asset.assetIssueReason),
        assetIssueDetails: asset.assetIssueDetails ?? "",
        images: [],
      })),
    },
  });

  const location = useWatch({ control: form.control, name: "location" });
  const {
    fields: assetFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "assets",
  });
  const { locationOptions } = useAssetFilters({
    form,
    locationField: "location",
  });

  const requestFields: DynamicFormField<UpdateJobRequestFormValues>[] = [
    {
      fieldType: "textarea",
      name: "description",
      label: "Job description",
      rows: 2,
      className: "md:col-span-2",
      required: true,
    },
    {
      fieldType: "select",
      name: "location",
      label: "Location",
      placeholder: "Select Location",
      options: includeCurrentOption(
        normalizeOptions(locationOptions),
        location,
      ),
      required: true,
    },
    {
      fieldType: "input",
      type: "datetime-local",
      name: "breakdown_time",
      label: "Breakdown Time",
      placeholder: "",
      required: true,
    },
    {
      fieldType: "select",
      name: "type",
      label: "Type",
      placeholder: "Select Type",
      options: includeCurrentOption(type, form.watch("type")),
      required: true,
    },
    {
      fieldType: "select",
      name: "impact",
      label: "Impact",
      placeholder: "Select Impact",
      options: includeCurrentOption(impact, form.watch("impact")),
      required: true,
    },
    {
      fieldType: "select",
      name: "priority",
      label: "Priority",
      placeholder: "Select Priority",
      options: includeCurrentOption(priority, form.watch("priority")),
      required: true,
    },
  ];

  const { mutateAsync, isPending } = useUpdateItem<
    UpdateJobRequestPayload,
    { presigned_urls?: PresignedUrlResponse }
  >({
    resourcePath: "api/jobs",
    queryKey: ["jobs", isPendingRequest ? "pending" : "in-progress"],
  });

  const removeExistingImage = (assetIndex: number, image: PresignedUrls) => {
    setExistingImagesByAsset((current) =>
      current.map((images, index) =>
        index === assetIndex
          ? images.filter((existingImage) => existingImage.key !== image.key)
          : images,
      ),
    );
    setDeletedImageKeys((current) =>
      current.includes(image.key) ? current : [...current, image.key],
    );
  };

  const removeAsset = (assetIndex: number) => {
    const removedImageKeys =
      existingImagesByAsset[assetIndex]?.map((image) => image.key) ?? [];
    setDeletedImageKeys((current) => [
      ...current,
      ...removedImageKeys.filter((key) => !current.includes(key)),
    ]);
    setExistingImagesByAsset((current) =>
      current.filter((_, index) => index !== assetIndex),
    );
    setPreservedAssets((current) =>
      current.filter((_, index) => index !== assetIndex),
    );
    remove(assetIndex);
    setOpenAssetIndex((current) => {
      if (current === assetIndex) return Math.max(0, assetIndex - 1);
      if (current > assetIndex) return current - 1;
      return current;
    });
  };

  const onSubmit = async (values: UpdateJobRequestFormValues) => {
    let hasImageError = false;
    values.assets.forEach((asset, assetIndex) => {
      if (
        asset.assetIssueReason &&
        !existingImagesByAsset[assetIndex]?.length &&
        !asset.images?.length
      ) {
        form.setError(`assets.${assetIndex}.images`, {
          message: "Images are compulsory if no barcode is supplied",
        });
        hasImageError = true;
      }
    });
    if (hasImageError) return;

    try {
      const rawImages = values.assets.flatMap((asset) => asset.images ?? []);
      const compressedImages = rawImages.length
        ? await compressImagesToWebpv1(rawImages)
        : [];
      let cursor = 0;
      const assets = values.assets.map((asset) => {
        const imageCount = asset.images?.length ?? 0;
        const assetImages = compressedImages.slice(cursor, cursor + imageCount);
        cursor += imageCount;
        return {
          ...asset,
          assetIssueReason: asset.assetIssueReason ?? "",
          assetIssueDetails: asset.assetIssueDetails ?? "",
          images: assetImages.map((file) => ({
            filename: file.name,
            content_type: file.type,
          })),
        };
      });
      const payload: UpdateJobRequestPayload = {
        ...values,
        assets,
        deleted_image_keys: deletedImageKeys,
      };

      const response = await mutateAsync({ id, payload });

      if (compressedImages.length) {
        if (!response.presigned_urls) {
          throw new Error("Expected upload URLs but none were returned.");
        }
        await Promise.all(
          response.presigned_urls.map(async (upload) => {
            const file = compressedImages.find(
              (image) => image.name === upload.filename,
            );
            if (!file) {
              throw new Error(
                `Could not find local file for ${upload.filename}.`,
              );
            }
            const uploadResponse = await fetch(upload.url, {
              method: "PUT",
              headers: { "Content-Type": upload.content_type },
              body: file,
            });
            if (!uploadResponse.ok) {
              throw new Error(`Image upload failed for ${upload.filename}.`);
            }
          }),
        );
      }

      setSuccessConfig({
        title: "Job Updated",
        message: `Job ${item.jobcardNumber} was successfully updated.`,
        redirectPath: returnPath,
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Job update failed:", error);
      setErrorConfig({
        title: "Job Update Failed",
        message: "Could not update the job. Please try again.",
        redirectPath: returnPath,
      });
      setShowError(true);
    }
  };

  const handleCancel = () => {
    setShowUpdateMaintenanceDialog(false);
    navigate(`/${returnPath}`);
  };

  return (
    <div className="space-y-1 p-1 dark:bg-(--bg-secondary_dark) md:space-y-8">
      <div className="flex items-center justify-between rounded-md border border-gray-200/80 bg-gray-50/80 px-3 py-2 md:hidden dark:border-gray-700/60 dark:bg-gray-800/40">
        <p className="text-[0.65rem] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Job number
        </p>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
          {item.jobcardNumber}
        </p>
      </div>
      <DynamicForm<UpdateJobRequestFormValues>
        form={form}
        formId="job-update-form"
        fields={requestFields}
        showFormHeading={!isPendingRequest}
        formHeadingClassName="py-2 md:py-0"
        formHeading={
          <>
            <span className="md:hidden">Update Job</span>
            <span className="hidden md:inline">
              Update Job · {item.jobcardNumber}
            </span>
          </>
        }
        redirect
        redirectTo={`/${returnPath}`}
        onSubmit={onSubmit}
        isPending={isPending}
        onCancel={handleCancel}
        gridClassName="gap-6 pt-3 md:pt-2"
        renderActions={false}
      />

      <div className={location ? "space-y-2" : "space-y-3"}>
        {location ? (
          <div className="flex items-center justify-end">
            <AddAssetButton
              onClick={() => {
                append({
                  area: "",
                  equipment: "",
                  assetID: "",
                  assetIssueReason: "",
                  assetIssueDetails: "",
                  images: [],
                });
                setExistingImagesByAsset((current) => [...current, []]);
                setPreservedAssets((current) => [
                  ...current,
                  { area: undefined, equipment: "", assetID: undefined },
                ]);
              }}
            />
          </div>
        ) : (
          <FormInfo
            message={
              <>
                Select a <strong>Location</strong> before editing assets.
              </>
            }
          />
        )}

        <div className="space-y-6">
          {assetFields.map((field, index) => (
            <JobAssetFields<UpdateJobRequestFormValues>
              key={field.id}
              form={form}
              assetIndex={index}
              isOpen={openAssetIndex === index}
              onToggle={() =>
                setOpenAssetIndex((current) => (current === index ? -1 : index))
              }
              canRemove={assetFields.length > 1}
              onRemove={() => removeAsset(index)}
              existingImages={existingImagesByAsset[index] ?? []}
              onRemoveExistingImage={(image) =>
                removeExistingImage(index, image)
              }
              initialAsset={preservedAssets[index]}
              unifiedImageGallery
            />
          ))}
        </div>
      </div>

      <DynamicFormActions
        formId="job-update-form"
        submitText="Update Job"
        cancelText="Cancel"
        onCancel={handleCancel}
        isPending={isPending}
        className="py-4"
      />
    </div>
  );
};

const JobUpdateForm = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { selectedRowId } = useGlobalContext();
  const id = routeId ?? selectedRowId ?? "";
  const requestStatus = pathname.includes("/pending-approval")
    ? "pending"
    : "in progress";
  const { data, isLoading, isError } = useById<JobApprovedAPIResponse>({
    id,
    resourcePath: "api/jobs",
    queryKey: ["jobs", requestStatus, "update"],
    params: { status: requestStatus },
  });

  if (isLoading) return <FormSkeleton />;

  if (!id || isError || !data) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        The job could not be loaded. Please return to the in-progress jobs list
        and try again.
      </p>
    );
  }

  return (
    <JobUpdateEditor
      key={id}
      id={id}
      item={data}
      requestStatus={requestStatus}
    />
  );
};

export default JobUpdateForm;
