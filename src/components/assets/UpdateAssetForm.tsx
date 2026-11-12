import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import useGlobalContext from "@/context/useGlobalContext";
import {
  assetRequestSchema,
  type AssetAPIResponse,
  type AssetRequestFormValues,
  type PresignedUrlResponse,
  type UpdateAssetPayload,
} from "@/schemas";
import {
  compressImagesToWebpv1,
  ImageCompressionError,
} from "@/utils/compressImagesToWebpv1";
import { useById, useUpdateItem } from "@/utils/api";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormSkeleton } from "@/components/forms/FormSkeleton";
import { useAssetsFields } from "@/components/forms/configs/useAssetsFields";

const ASSETS_QUERY_KEY = ["assets", "list"] as const;

type AssetUpdateStage = "compression" | "asset update" | "upload";

class AssetImageUploadError extends Error {
  readonly filename?: string;
  readonly imageIndex?: number;
  readonly status?: number;

  constructor(
    message: string,
    filename?: string,
    imageIndex?: number,
    status?: number,
  ) {
    super(message);
    this.name = "AssetImageUploadError";
    this.filename = filename;
    this.imageIndex = imageIndex;
    this.status = status;
  }
}

const sanitizeDiagnosticValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return value.replace(/https?:\/\/\S+/gi, "[redacted URL]");
  }

  if (Array.isArray(value)) return value.map(sanitizeDiagnosticValue);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        /(token|authorization|password|credential|secret|cookie|url)/i.test(key)
          ? "[redacted]"
          : sanitizeDiagnosticValue(nestedValue),
      ]),
    );
  }

  return value;
};

const formatAssetUpdateError = (
  error: unknown,
  stage: AssetUpdateStage,
  totalImages: number,
) => {
  const lines = [`Failed operation: ${stage}`, `Selected images: ${totalImages}`];

  if (error instanceof ImageCompressionError) {
    lines.push(
      `Image: ${error.filename}`,
      `Image index: ${error.imageIndex + 1} of ${error.totalImages}`,
    );
    const originalMessage =
      error.originalError instanceof Error
        ? error.originalError.message
        : String(error.originalError);
    if (originalMessage && originalMessage !== error.message) {
      lines.push(
        `Original error: ${sanitizeDiagnosticValue(originalMessage)}`,
      );
    }
  } else if (error instanceof AssetImageUploadError) {
    if (error.filename) lines.push(`Image: ${error.filename}`);
    if (error.imageIndex !== undefined) {
      lines.push(`Image index: ${error.imageIndex + 1} of ${totalImages}`);
    }
    if (error.status !== undefined) lines.push(`HTTP status: ${error.status}`);
  }

  const message = error instanceof Error ? error.message : String(error);
  lines.push(`Error: ${sanitizeDiagnosticValue(message)}`);

  if (axios.isAxiosError(error)) {
    if (error.response?.status !== undefined) {
      lines.push(`HTTP status: ${error.response.status}`);
    }
    if (error.response?.data !== undefined) {
      const safeResponse = sanitizeDiagnosticValue(error.response.data);
      const response = JSON.stringify(safeResponse, null, 2) ?? String(safeResponse);
      lines.push(`API response: ${response.slice(0, 2000)}`);
    }
  }

  return lines.join("\n");
};

type UpdateAssetEditorProps = {
  id: string;
  item: AssetAPIResponse;
};

const UpdateAssetEditor = ({ id, item }: UpdateAssetEditorProps) => {
  const navigate = useNavigate();
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();
  const [existingImages, setExistingImages] = useState(item.images);
  const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([]);

  const form = useForm<AssetRequestFormValues>({
    resolver: zodResolver(
      assetRequestSchema,
    ) as unknown as Resolver<AssetRequestFormValues>,
    defaultValues: {
      business_unit: item.business_unit ?? "",
      area: item.area ?? "",
      equipment: item.equipment ?? "",
      serialNumber: item.serialNumber ?? "",
      location: item.location ?? "",
      condition: item.condition ?? "",
      images: [],
      assetID: item.assetID ?? "",
      assetType: item.assetType,
      category: item.category,
      replacementValue: item.replacementValue,
      additional_notes: item.additional_notes ?? "",
    },
  });

  const { fields } = useAssetsFields({
    business_unit: item.business_unit,
    area: item.area,
    equipment: item.equipment,
    location: item.location,
    condition: item.condition,
    existingImages: existingImages.map(({ key, filename, url }) => ({
      key,
      filename,
      url,
    })),
    onRemoveExistingImage: (image) => {
      setExistingImages((current) =>
        current.filter((existingImage) => existingImage.key !== image.key),
      );
      setDeletedImageKeys((current) =>
        current.includes(image.key) ? current : [...current, image.key],
      );
    },
  });

  const { mutateAsync, isPending } = useUpdateItem<
    UpdateAssetPayload,
    { presigned_urls?: PresignedUrlResponse }
  >({
    resourcePath: "api/assets",
    queryKey: ASSETS_QUERY_KEY,
  });

  const onSubmit = async (values: AssetRequestFormValues) => {
    let stage: AssetUpdateStage = "compression";
    const totalImages = values.images.length;

    try {
      const { images, ...assetValues } = values;
      const compressedImages = images.length
        ? await compressImagesToWebpv1(images)
        : [];
      const payload: UpdateAssetPayload = {
        ...assetValues,
        images: compressedImages.map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
        deleted_image_keys: deletedImageKeys,
      };

      stage = "asset update";
      const response = await mutateAsync({ id, payload });

      if (compressedImages.length) {
        stage = "upload";
        if (!response.presigned_urls) {
          throw new AssetImageUploadError(
            "Expected upload URLs but none were returned.",
          );
        }

        await Promise.all(
          response.presigned_urls.map(async (upload, imageIndex) => {
            const file = compressedImages.find(
              (image) => image.name === upload.filename,
            );

            if (!file) {
              throw new AssetImageUploadError(
                `Could not find local file for ${upload.filename}.`,
                upload.filename,
                imageIndex,
              );
            }

            let uploadResponse: Response;
            try {
              uploadResponse = await fetch(upload.url, {
                method: "PUT",
                headers: { "Content-Type": upload.content_type },
                body: file,
              });
            } catch (uploadError) {
              throw new AssetImageUploadError(
                uploadError instanceof Error
                  ? uploadError.message
                  : "The image upload request failed.",
                upload.filename,
                imageIndex,
              );
            }

            if (!uploadResponse.ok) {
              throw new AssetImageUploadError(
                `Image upload failed for ${upload.filename}.`,
                upload.filename,
                imageIndex,
                uploadResponse.status,
              );
            }
          }),
        );
      }

      setSuccessConfig({
        title: "Asset Updated",
        message: `Asset ${values.assetID || item.id} was successfully updated.`,
        redirectPath: "assets/list",
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Asset update failed:", error);
      setErrorConfig({
        title: "Asset Update Failed",
        message:
          "Could not update the asset. Copy the details below when reporting this problem.",
        details: formatAssetUpdateError(error, stage, totalImages),
        redirectPath: "assets/list",
      });
      setShowError(true);
    }
  };

  return (
    <DynamicForm<AssetRequestFormValues>
      form={form}
      fields={fields}
      formHeading="Update Asset"
      redirect
      redirectTo="/assets/list"
      onSubmit={onSubmit}
      isPending={isPending}
      submitText="Update Asset"
      cancelText="Cancel"
      onCancel={() => navigate("/assets/list")}
      gridClassName="gap-6"
    />
  );
};

const UpdateAssetForm = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useById<AssetAPIResponse>({
    id,
    resourcePath: "api/assets",
    queryKey: ["assets", "detail"],
  });

  if (isLoading) return <FormSkeleton />;

  if (!id || isError || !data) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        The asset could not be loaded. Please return to the asset list and try
        again.
      </p>
    );
  }

  return <UpdateAssetEditor key={id} id={id} item={data} />;
};

export default UpdateAssetForm;
