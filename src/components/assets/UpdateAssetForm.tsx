import { useState } from "react";
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
import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";
import { useById, useUpdateItem } from "@/utils/api";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormSkeleton } from "@/components/forms/FormSkeleton";
import { useAssetsFields } from "@/components/forms/configs/useAssetsFields";

const ASSETS_QUERY_KEY = ["assets", "list"] as const;

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
        title: "Asset Updated",
        message: `Asset ${values.assetID || item.id} was successfully updated.`,
        redirectPath: "assets/list",
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Asset update failed:", error);
      setErrorConfig({
        title: "Asset Update Failed",
        message: "Could not update the asset. Please try again.",
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
