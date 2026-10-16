import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Path, type Resolver } from "react-hook-form";

import useGlobalContext from "@/context/useGlobalContext";
import { useAssetOptions } from "@/hooks/useAssetOptions";
import {
  transferUpdateSchema,
  type TransferResponseValues,
  type TransferUpdateFormValues,
  type TransferUpdatePayload,
  type TransferWorkflowResponse,
} from "@/schemas/transfersSchemas";
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

const TRANSFERS_QUERY_KEY = ["transfers"] as const;

const toDateInputValue = (value?: string) => value?.slice(0, 10) ?? "";

type TransferUpdateEditorProps = {
  id: string;
  item: TransferWorkflowResponse;
  request: TransferResponseValues;
};

const TransferUpdateEditor = ({
  id,
  item,
  request,
}: TransferUpdateEditorProps) => {
  const navigate = useNavigate();
  const [openAssetIndex, setOpenAssetIndex] = useState(0);
  const invoiceCount = request.transportInvoices?.length ?? 0;
  const [existingImagesByAsset, setExistingImagesByAsset] = useState<
    PresignedUrls[][]
  >(() => item.assets.map((asset) => asset.images ?? []));
  const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([]);
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  const form = useForm<TransferUpdateFormValues>({
    resolver: zodResolver(
      transferUpdateSchema,
    ) as unknown as Resolver<TransferUpdateFormValues>,
    defaultValues: {
      locationFrom: request.locationFrom ?? "",
      locationTo: request.locationTo ?? "",
      expectedDate: toDateInputValue(request.expectedDate),
      transferReason: request.transferReason ?? "",
      assets: item.assets.map((asset) => ({
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
      request.locationFrom,
      request.locationTo,
      ...(locationsQuery.data?.locations ?? []).map((location) =>
        typeof location === "string" ? location : location.value,
      ),
    ]),
  ).filter((location): location is string => Boolean(location?.trim()));

  const fields: DynamicFormField<TransferUpdateFormValues>[] = [
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
      options: locationOptions,
      required: true,
      isLoading: locationsQuery.isLoading,
    },
    {
      fieldType: "select",
      name: "locationTo",
      label: "Location To",
      placeholder: "Select Location To",
      options: locationOptions,
      required: true,
      isLoading: locationsQuery.isLoading,
    },
    {
      fieldType: "input",
      type: "date",
      name: "expectedDate",
      label: "Expected Transit Date",
      required: true,
    },
  ];

  const { mutateAsync, isPending } = useUpdateItem<
    TransferUpdatePayload,
    { presigned_urls?: PresignedUrlResponse }
  >({
    resourcePath: "api/transfers",
    queryKey: TRANSFERS_QUERY_KEY,
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

  const onSubmit = async (values: TransferUpdateFormValues) => {
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
      const payload: TransferUpdatePayload = {
        locationFrom: values.locationFrom,
        locationTo: values.locationTo,
        expectedDate: values.expectedDate,
        transferReason: values.transferReason,
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
        title: "Transfer Request Updated",
        message: `Transfer request ${id} was successfully updated.`,
        redirectPath: "transfers/requests",
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Transfer request update failed:", error);
      setErrorConfig({
        title: "Transfer Request Update Failed",
        message: "Could not update the transfer request. Please try again.",
        redirectPath: "transfers/requests",
      });
      setShowError(true);
    }
  };

  return (
    <div className="space-y-8">
      <DynamicForm<TransferUpdateFormValues>
        form={form}
        formId="transfer-update-form"
        fields={fields}
        formHeading={`Update Transfer`}
        redirect
        redirectTo="/transfers/requests"
        onSubmit={onSubmit}
        isPending={isPending}
        submitText="Update Transfer"
        cancelText="Cancel"
        onCancel={() => navigate("/transfers/requests")}
        gridClassName="gap-6"
        renderActions={false}
      />

      <section className="space-y-3" aria-labelledby="transfer-assets-heading">
        <div>
          <h2
            id="transfer-assets-heading"
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
              key={`${asset.assetID ?? "unidentified"}-${index}`}
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
                  <DynamicForm<TransferUpdateFormValues>
                    form={form}
                    fields={[
                      {
                        fieldType: "file",
                        name: `assets.${index}.images` as Path<TransferUpdateFormValues>,
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

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {invoiceCount} existing transport invoice
        {invoiceCount === 1 ? "" : "s"} will be preserved.
      </p>

      <DynamicFormActions
        formId="transfer-update-form"
        submitText="Update Transfer"
        cancelText="Cancel"
        onCancel={() => navigate("/transfers/requests")}
        isPending={isPending}
      />
    </div>
  );
};

function TransferUpdateForm() {
  const { id = "" } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useById<TransferWorkflowResponse>({
    id,
    resourcePath: "api/transfers",
    queryKey: ["transfers", "detail", "update"],
  });

  if (isLoading) return <FormSkeleton />;

  if (!id || isError || !data || data.status !== "pending" || !data.pending) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        This transfer request cannot be edited. Only pending requests are
        available for update.
      </p>
    );
  }

  return (
    <TransferUpdateEditor key={id} id={id} item={data} request={data.pending} />
  );
}

export default TransferUpdateForm;
