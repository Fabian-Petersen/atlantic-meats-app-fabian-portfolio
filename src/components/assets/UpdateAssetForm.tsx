import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// $ API hooks
import { useById, useUpdateItem } from "@/utils/api";

// $ Schema & types
import { assetRequestSchema } from "@/schemas";
import type {
  AssetRequestFormValues,
  CreateAssetPayload,
  PresignedUrlResponse,
} from "@/schemas";
import type { WithImages } from "@/pages/AssetsSingleItemPage";

// $ Select options
import {
  condition,
  location,
  CeateAssetFormOptionsData,
} from "@/data/assetSelectOptions";

// $ Components
import FileInput from "../../../customComponents/FileInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import FormRowInput from "../../../customComponents/FormRowInput";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import { PageLoadingSpinner } from "../features/PageLoadingSpinner";
import { Button } from "../ui/button";

// $ Context
import useGlobalContext from "@/context/useGlobalContext";

type BusinessUnit = keyof typeof CeateAssetFormOptionsData.business_unit;

const ASSETS_KEY = ["assets"];

const UpdateAssetForm = () => {
  const navigate = useNavigate();
  const { setShowUpdateAssetDialog, selectedRowId: id } = useGlobalContext();
  // console.log("selectedRowId:", id);

  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  // $ Fetch asset
  const { data: item, isPending } = useById<
    AssetRequestFormValues & WithImages
  >({
    id: id ?? "",
    queryKey: ASSETS_KEY,
    resourcePath: "asset",
  });

  // $ Update hook
  const updateAsset = useUpdateItem<
    CreateAssetPayload,
    { presigned_urls?: PresignedUrlResponse }
  >({
    resourcePath: "asset",
    queryKey: ASSETS_KEY,
  });

  // $ Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssetRequestFormValues>({
    defaultValues: item,
    resolver: zodResolver(
      assetRequestSchema,
    ) as unknown as Resolver<AssetRequestFormValues>,
    values: item
      ? {
          ...item,
          images: [], // cannot hydrate File[]
        }
      : undefined,
  });

  // console.log("item in form:", item);

  if (!id || isPending || !item) {
    return <PageLoadingSpinner />;
  }

  const DATA = CeateAssetFormOptionsData;

  const businessUnitOptions = Object.keys(DATA.business_unit) as BusinessUnit[];

  const categoryOptions = businessUnit
    ? Object.keys(DATA.business_unit[businessUnit].category)
    : [];

  const itemOptions =
    businessUnit && category
      ? DATA.business_unit[businessUnit].category[
          category as keyof (typeof DATA.business_unit)[typeof businessUnit]["category"]
        ]
      : [];

  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

  // $ Submit
  const onSubmit = async (data: AssetRequestFormValues) => {
    try {
      const payload: CreateAssetPayload = {
        ...data,
        images: (data.images ?? []).map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
      };

      const response = await updateAsset.mutateAsync({
        id,
        payload,
      });

      const { presigned_urls } = response ?? {};

      if (presigned_urls?.length) {
        await Promise.all(
          presigned_urls.map((item) => {
            const file = data.images?.find((f) => f.name === item.filename);

            if (!file) return Promise.resolve();

            return fetch(item.url, {
              method: "PUT",
              headers: {
                "Content-Type": item.content_type,
              },
              body: file,
            });
          }),
        );
      }

      toast.success("Asset successfully updated", { duration: 1000 });
      navigate("/asset");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update asset");
    }
  };

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-(--clr-font) dark:bg-[#1d2739]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full lg:py-6">
        <FormRowSelect
          name="business_unit"
          label="Business Unit"
          placeholder="Select business unit"
          register={register}
          options={businessUnitOptions}
          onChange={([value]) => {
            setBusinessUnit(value as BusinessUnit);
            setCategory(null);
          }}
          required
        />
        <FormRowSelect
          name="area"
          label="Area"
          placeholder="Select Area"
          register={register}
          options={categoryOptions}
          onChange={([value]) => setCategory(value)}
          required
        />
        <FormRowSelect
          label="Equipment"
          name="equipment"
          options={itemOptions}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FormRowInput
          label="Asset ID"
          type="text"
          name="assetID"
          placeholder="Asset ID e.g. MX001"
          register={register}
          error={errors.assetID}
        />
        <FormRowSelect
          label="Location"
          name="location"
          options={sortedLocations}
          placeholder="Select Location"
          register={register}
          error={errors.location}
          className="capitalize"
        />
        <FormRowSelect
          label="Condition"
          name="condition"
          options={condition}
          placeholder="Select Condition"
          register={register}
          error={errors.condition}
        />
        <FormRowInput
          label="Serial Number"
          type="text"
          name="serialNumber"
          placeholder="Serial Number"
          register={register}
          error={errors.serialNumber}
        />
        <FileInput
          label=""
          control={control}
          name="images"
          multiple={true}
          className="col-span-2"
          // error={errors.images}
        />
        <TextAreaInput
          label="Comments"
          name="additional_notes"
          placeholder="Comments"
          register={register}
          className="md:col-span-2"
          rows={3}
        />
      </div>
      <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 bg-white mt-auto">
        <Button
          type="button"
          onClick={() => {
            setShowUpdateAssetDialog(false);
          }}
          variant="cancel"
          size="lg"
          className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white"
        >
          Cancel
        </Button>
        <Button
          disabled={isPending}
          type="submit"
          variant="submit"
          size="lg"
          className="flex-1"
        >
          {isPending ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateAssetForm;
