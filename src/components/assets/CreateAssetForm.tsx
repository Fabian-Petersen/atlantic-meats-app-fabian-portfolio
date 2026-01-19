//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";

// $ Import image compression hook
import { compressImagesToWebp } from "@/utils/compressImagesToWebp";

// $ Import schemas
import type {
  AssetFormValues,
  CreateAssetPayload,
  PresignedUrlResponse,
} from "../../schemas/index";
import { assetSchema } from "../../schemas/index";

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
  } = useForm<AssetFormValues>({
    defaultValues: {
      business_unit: "",
      category: "",
      equipment: "",
      assetID: "",
      condition: "",
      location: "",
      serialNumber: "",
      additional_notes: "",
      images: [],
    },
    resolver: zodResolver(assetSchema) as unknown as Resolver<AssetFormValues>,
  });

  // $ sort the locations in alphabetical order
  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

  // $ Form and Images Submit with Image Compression
  const onSubmit = async (data: AssetFormValues) => {
    // console.log("Create new asset:", data);

    try {
      // $ 1️⃣ Compress images in browser
      const originalFiles = data.images ?? [];
      const compressedFiles = await compressImagesToWebp(originalFiles);

      // $ 2️⃣ Build API payload (metadata only)
      const payload: CreateAssetPayload = {
        ...data,
        images: compressedFiles.map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
      };

      console.log("Payload for API:", payload);

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
      navigate("/asset");
    } catch (err) {
      console.error("Failed to create asset", err);
    }
  };

  // const onSubmit = async (data: AssetFormValues) => {
  //   console.log("Create new asset:", data);
  //   try {
  //     // $ 1. Build API payload (metadata only)
  //     const payload: CreateAssetPayload = {
  //       ...data,
  //       images: (data.images ?? []).map((file) => ({
  //         filename: file.name,
  //         content_type: file.type,
  //       })),
  //     };
  //     console.log("Payload for API:", payload);

  //     // $ 2. Create maintenance request (DynamoDB + presigned URLs)
  //     const response = await mutateAsync(payload);
  //     console.log("API Response:", response);

  //     const { presigned_urls } = response;
  //     console.log("Presigned URLs:", presigned_urls);

  //     // $ 3. Upload files directly to S3
  //     await Promise.all(
  //       presigned_urls.map((item: PresignedUrlResponse[number]) => {
  //         const file = (data.images ?? []).find(
  //           (f) => f.name === item.filename
  //         );

  //         if (!file) return Promise.resolve();

  //         return fetch(item.url, {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": item.content_type,
  //           },
  //           body: file,
  //         });
  //       })
  //     );
  //     toast.success("Asset successfully created!", {
  //       duration: 1000,
  //     });
  //     // navigate("/asset");
  //   } catch (err) {
  //     console.error("Failed to create asset", err);
  //   }
  // };

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
          name="category"
          label="Category"
          placeholder="Select category"
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
        <FileInput
          label="Supporting Documents"
          control={control}
          name="images"
          multiple={true}
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
      <div className="flex w-full">
        <div className="flex lg:w-1/2 ml-auto gap-2">
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
      </div>
    </form>
  );
};

export default CreateAssetForm;
