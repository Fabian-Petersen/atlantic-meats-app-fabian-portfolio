//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, useState } from "react";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";

// $ Import image compression hook
import { compressImagesToWebpv1 } from "../../utils/compressImagesToWebpv1";

// $ Import schemas
import type {
  AssetRequestFormValues,
  CreateAssetPayload,
  PresignedUrlResponse,
} from "../../schemas/index";
import { assetRequestSchema } from "../../schemas/index";

// $ Import API interaction Functions
import {
  useCreateNewAsset,
  // useCreateNewItem,
} from "@/utils/api";

//$ Import Select Options Data
import {
  condition,
  // equipment,
  location,
  CeateAssetFormOptionsData,
} from "@/data/assetSelectOptions";
import FileInput from "../../../customComponents/FileInput";
import { toast } from "sonner";
import TextAreaInput from "../../../customComponents/TextAreaInput";

type BusinessUnit = keyof typeof CeateAssetFormOptionsData.business_unit;

// type Category<B extends BusinessUnit> =
//   keyof (typeof CeateAssetFormOptionsData.business_unit)[B]["category"];

const CreateAssetForm = () => {
  // $ Use cascading (dependent) select inputs driven directly from the data structure.
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit | null>(null);
  const [category, setCategory] = useState<string | null>(null);

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

  const { mutateAsync } = useCreateNewAsset();
  const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AssetRequestFormValues>({
    defaultValues: {
      business_unit: "",
      area: "",
      equipment: "",
      assetID: "",
      condition: "",
      location: "",
      serialNumber: "",
      additional_notes: "",
      images: [],
    },
    resolver: zodResolver(
      assetRequestSchema,
    ) as unknown as Resolver<AssetRequestFormValues>,
  });

  // $ sort the locations in alphabetical order
  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

  // $ Form and Images Submit with Image Compression
  const onSubmit = async (data: AssetRequestFormValues) => {
    // console.log("Create new asset:", data);

    try {
      // $ 1️⃣ Compress images in browser
      const originalFiles = data.images ?? [];
      const compressedFiles = await compressImagesToWebpv1(originalFiles);

      // $ 2️⃣ Build API payload (metadata only)
      const payload: CreateAssetPayload = {
        ...data,
        images: compressedFiles.map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
      };

      // console.log("Payload for API:", payload);

      // $ 3️⃣ Create asset + get presigned URLs
      const response = await mutateAsync(payload);
      const { presigned_urls } = response;

      // $ 4️⃣ Upload compressed images to S3
      await Promise.all(
        presigned_urls.map((item: PresignedUrlResponse[number]) => {
          const file = compressedFiles.find((f) => f.name === item.filename);

          if (!file) return Promise.resolve();

          return fetch(item.url, {
            method: "PUT",
            headers: {
              "Content-Type": "image/webp",
            },
            body: file,
          });
        }),
      );

      toast.success("Asset successfully created!", { duration: 1000 });
      // navigate("/asset"); // $ temporary disabled navigation
    } catch (err) {
      console.error("Failed to create asset", err);
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
          // control={control}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FormRowInput
          label="Asset ID"
          type="text"
          name="assetID"
          // control={control}
          placeholder="Asset ID e.g. MX001"
          register={register}
          error={errors.assetID}
        />
        <FormRowSelect
          label="Location"
          name="location"
          options={sortedLocations}
          // control={control}
          placeholder="Select Location"
          register={register}
          error={errors.location}
          className="capitalize"
        />
        <FormRowSelect
          label="Condition"
          name="condition"
          options={condition}
          // control={control}
          placeholder="Select Condition"
          register={register}
          error={errors.condition}
        />
        <FormRowInput
          label="Serial Number"
          type="text"
          name="serialNumber"
          // control={control}
          placeholder="Serial Number"
          register={register}
          error={errors.serialNumber}
        />
        <Activity mode="visible">
          <FileInput
            control={control}
            name="images"
            multiple={true}
            // error={errors.images}
          />
        </Activity>
        <TextAreaInput
          label="Comments"
          name="additional_notes"
          placeholder="Comments"
          register={register}
          className="md:col-span-2"
          rows={3}
        />
      </div>
      <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72 bg-white pt-2">
        <Button
          type="button"
          onClick={() => {
            navigate("/asset");
          }}
          variant="cancel"
          size="lg"
          className="flex-1 hover:bg-red-500/90 hover:cursor-pointer hover:text-white"
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="submit"
          size="lg"
          className="flex-1"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CreateAssetForm;
