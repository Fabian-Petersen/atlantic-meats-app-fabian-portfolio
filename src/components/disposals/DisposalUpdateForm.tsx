import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Path, type Resolver } from "react-hook-form";

import useGlobalContext from "@/context/useGlobalContext";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import {
  disposalReasons,
  disposalUpdateSchema,
  type DisposalUpdateFormValues,
  type DisposalUpdatePayload,
  type DisposalWorkflowResponse,
} from "@/schemas/disposalsSchemas";
import { useById, useUpdateItem } from "@/utils/api";
import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";
import type { PresignedUrlResponse } from "@/schemas";
import type { PresignedUrls } from "@/schemas/jobSchemas";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import DynamicForm, {
  DynamicFormActions,
  type DynamicFormField,
} from "../forms/DynamicForm";
import { FormSkeleton } from "../forms/FormSkeleton";
import { AssetSectionHeader } from "../forms/AssetSectionHeader";
import Field from "../features/layout/Field";

const DISPOSALS_QUERY_KEY = ["disposals"] as const;

const toDateInputValue = (value?: string) => value?.slice(0, 10) ?? "";

const toDisposalReason = (
  value?: string,
): DisposalUpdateFormValues["disposalReason"] =>
  disposalReasons.find((reason) => reason === value) ?? "";

type DisposalUpdateEditorProps = {
  id: string;
  item: DisposalWorkflowResponse;
};

const DisposalUpdateEditor = ({ id, item }: DisposalUpdateEditorProps) => {
  const navigate = useNavigate();
  const [openAssetIndex, setOpenAssetIndex] = useState(0);
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();
  const request = item.pending;
  const [existingImagesByAsset, setExistingImagesByAsset] = useState<
    PresignedUrls[][]
  >(() => item.assets.map((asset) => asset.images ?? []));
  const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([]);

  const form = useForm<DisposalUpdateFormValues>({
    resolver: zodResolver(
      disposalUpdateSchema,
    ) as unknown as Resolver<DisposalUpdateFormValues>,
    defaultValues: {
      description: request.description ?? "",
      disposalReason: toDisposalReason(request.disposalReason),
      location: request.location ?? "",
      expectedDisposalDate: toDateInputValue(request.expectedDisposalDate),
      assets: item.assets.map((asset) => ({
        assetIndex: asset.assetIndex,
        assetID: asset.assetID,
        area: asset.area,
        equipment: asset.equipment,
        assetIssueReason: asset.assetIssueReason,
        assetIssueDetails: asset.assetIssueDetails ?? "",
        images: [],
      })),
    },
  });

  const { locationsQuery } = useAssetOptions();
  const locationOptions = Array.from(
    new Set([
      request.location,
      ...(locationsQuery.data?.locations ?? []).map((location) =>
        typeof location === "string" ? location : location.value,
      ),
    ]),
  ).filter((location): location is string => Boolean(location?.trim()));

  const fields: DynamicFormField<DisposalUpdateFormValues>[] = [
    {
      fieldType: "textarea",
      name: "description",
      required: true,
      rows: 1,
      className: "md:col-span-2",
      label: "Description",
    },
    {
      fieldType: "select",
      name: "disposalReason",
      required: true,
      label: "Reason for disposal",
      options: [...disposalReasons],
    },
    {
      fieldType: "select",
      name: "location",
      label: "Location",
      placeholder: "Select Location",
      options: locationOptions,
      required: true,
      isLoading: locationsQuery.isLoading,
    },
    {
      fieldType: "input",
      type: "date",
      name: "expectedDisposalDate",
      label: "Expected Disposal Date",
      required: true,
    },
  ];

  const { mutateAsync, isPending } = useUpdateItem<
    DisposalUpdatePayload,
    { presigned_urls?: PresignedUrlResponse }
  >({
    resourcePath: "api/disposals",
    queryKey: DISPOSALS_QUERY_KEY,
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

  const onSubmit = async (values: DisposalUpdateFormValues) => {
    let hasImageError = false;
    values.assets.forEach((asset, assetIndex) => {
      if (
        asset.assetIssueReason &&
        !existingImagesByAsset[assetIndex]?.length &&
        !asset.images.length
      ) {
        form.setError(`assets.${assetIndex}.images`, {
          message: "Images are compulsory if no barcode is supplied",
        });
        hasImageError = true;
      }
    });
    if (hasImageError) return;

    try {
      const rawImages = values.assets.flatMap((asset) => asset.images);
      const compressedImages = rawImages.length
        ? await compressImagesToWebpv1(rawImages)
        : [];
      let cursor = 0;
      const assets = values.assets.map((asset) => {
        const imageCount = asset.images.length;
        const assetImages = compressedImages.slice(cursor, cursor + imageCount);
        cursor += imageCount;

        return {
          assetIndex: asset.assetIndex,
          assetID: asset.assetID,
          area: asset.area,
          equipment: asset.equipment,
          assetIssueReason: asset.assetIssueReason,
          assetIssueDetails: asset.assetIssueDetails,
          images: assetImages.map((file) => ({
            filename: file.name,
            content_type: file.type,
          })),
        };
      });
      const payload: DisposalUpdatePayload = {
        description: values.description,
        disposalReason: values.disposalReason,
        location: values.location,
        expectedDisposalDate: values.expectedDisposalDate,
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
              throw new Error(`Could not find local file for ${upload.filename}.`);
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
        title: "Disposal Request Updated",
        message: `Disposal request ${id} was successfully updated.`,
        redirectPath: "disposals/requests",
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Disposal request update failed:", error);
      setErrorConfig({
        title: "Disposal Request Update Failed",
        message: "Could not update the disposal request. Please try again.",
        redirectPath: "disposals/requests",
      });
      setShowError(true);
    }
  };

  return (
    <div className="space-y-8">
      <DynamicForm<DisposalUpdateFormValues>
        form={form}
        formId="disposal-update-form"
        fields={fields}
        formHeading={`Update Disposal`}
        redirect
        redirectTo="/disposals/requests"
        onSubmit={onSubmit}
        isPending={isPending}
        submitText="Update Disposal"
        cancelText="Cancel"
        onCancel={() => navigate("/disposals/requests")}
        gridClassName="gap-6"
        renderActions={false}
      />

      <section className="space-y-3" aria-labelledby="disposal-assets-heading">
        <div>
          <h2
            id="disposal-assets-heading"
            className="text-sm font-semibold text-gray-800 dark:text-gray-100"
          >
            Assets
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Asset details cannot be changed. Images can be added or removed.
          </p>
        </div>

        <div className="space-y-4">
          {item.assets.map((asset, index) => (
            <div
              key={`${asset.assetID ?? "unidentified"}-${asset.assetIndex}`}
              className={cn(sharedStyles.formInputDefault, "px-0 py-0")}
            >
              <AssetSectionHeader
                assetNumber={index + 1}
                isOpen={openAssetIndex === index}
                summary={
                  [asset.equipment, asset.assetID || asset.area]
                    .filter(Boolean)
                    .join(" · ") || "Existing asset"
                }
                onToggle={() =>
                  setOpenAssetIndex((current) =>
                    current === index ? -1 : index,
                  )
                }
                onRemove={() => undefined}
                canRemove={false}
              />

              {openAssetIndex === index && (
                <div className="px-4 py-2">
                  <Field label="Asset ID" value={asset.assetID} />
                  <Field label="Equipment" value={asset.equipment} />
                  <Field label="Area" value={asset.area} />
                  <Field label="Issue reason" value={asset.assetIssueReason} />
                  <Field
                    label="Issue details"
                    value={asset.assetIssueDetails}
                  />
                  <DynamicForm<DisposalUpdateFormValues>
                    form={form}
                    fields={[
                      {
                        fieldType: "file",
                        name: `assets.${index}.images` as Path<DisposalUpdateFormValues>,
                        label: "Images",
                        placeholder: "",
                        multiple: true,
                        className: "md:col-span-2",
                        existingFiles: existingImagesByAsset[index] ?? [],
                        onRemoveExisting: (image) =>
                          removeExistingImage(index, image),
                        galleryMode: true,
                      },
                    ]}
                    renderFieldsOnly
                    gridClassName="gap-6 pt-3"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <DynamicFormActions
        formId="disposal-update-form"
        submitText="Update Disposal"
        cancelText="Cancel"
        onCancel={() => navigate("/disposals/requests")}
        isPending={isPending}
      />
    </div>
  );
};

function DisposalUpdateForm() {
  const { id = "" } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useById<DisposalWorkflowResponse>({
    id,
    resourcePath: "api/disposals",
    queryKey: ["disposals", "detail", "update"],
  });

  if (isLoading) return <FormSkeleton />;

  if (!id || isError || !data) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        The disposal request could not be loaded. Please return to the disposal
        requests list and try again.
      </p>
    );
  }

  return <DisposalUpdateEditor key={id} id={id} item={data} />;
}

export default DisposalUpdateForm;
