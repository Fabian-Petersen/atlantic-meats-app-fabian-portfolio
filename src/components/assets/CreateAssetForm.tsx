//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { Activity, useState } from "react";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";

// $ Import schemas
import type { AssetRequestFormValues } from "../../schemas/index";
import { assetRequestSchema } from "../../schemas/index";

//$ Import Select Options Data
import {
  condition,
  location,
  CeateAssetFormOptionsData,
} from "@/data/assetSelectOptions";
import FileInput from "../../../customComponents/FileInput";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import FormActionButtons from "../features/FormActionButtons";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";

type BusinessUnit = keyof typeof CeateAssetFormOptionsData.business_unit;

const CreateAssetForm = () => {
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();
  // $ Calling the useFormSubmit hook to post the asset data to backend
  const { submit, isPending } = useFormSubmit({
    resourcePath: "assets-data",
    queryKey: ["assets", "create-asset"],
    buildPayload: (values, compressed) => ({
      ...values,
      images: compressed.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
    }),
    onSuccess: (values) => {
      setSuccessConfig({
        title: "Success",
        message: `The asset with ID ${values.assetID} request was successfully created.`,
        redirectPath: "assets/list",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Asset Creation Failed",
        message: "Could not create the asset. Please try again.",
        redirectPath: "assets/list",
      });
      setShowError(true);
    },
  });

  // const { mutateAsync, isError, isPending } = usePOST<
  //   CreateAssetPayload,
  //   { presigned_urls: PresignedUrlResponse }
  // >({
  //   resourcePath: "assets-data",
  //   queryKey: ["assets", "create-asset"],
  // });
  // const { handleError } = useApiError(); // This function takes an Axios Error and display a toast to the user from the backend

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

  const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssetRequestFormValues>({
    resolver: zodResolver(
      assetRequestSchema,
    ) as unknown as Resolver<AssetRequestFormValues>,
  });

  // $ sort the locations in alphabetical order
  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

  // // $ Form and Images Submit with Image Compression
  // const onSubmit = async (data: AssetRequestFormValues) => {
  //   // console.log("Create new asset:", data);

  //   try {
  //     // $ 1️⃣ Compress images in browser
  //     const originalFiles = data.images ?? [];
  //     const compressedFiles = await compressImagesToWebpv1(originalFiles);

  //     // $ 2️⃣ Build API payload (metadata only)
  //     const payload: CreateAssetPayload = {
  //       ...data,
  //       images: compressedFiles.map((file) => ({
  //         filename: file.name,
  //         content_type: file.type,
  //       })),
  //     };

  //     // console.log("Payload for API:", payload);

  //     // $ 3️⃣ Create asset + get presigned URLs
  //     const response = await mutateAsync(payload);
  //     const { presigned_urls } = response;

  //     // $ 4️⃣ Upload compressed images to S3
  //     await Promise.all(
  //       presigned_urls.map((image: PresignedUrlResponse[number]) => {
  //         const file = compressedFiles.find((f) => f.name === image.filename);

  //         if (!file) return Promise.resolve();

  //         return fetch(image.url, {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "image/webp",
  //           },
  //           body: file,
  //         });
  //       }),
  //     );

  //     toast.success("Asset successfully created!", { duration: 1000 });
  //     navigate("/assets/list"); // $ temporary disabled navigation
  //   } catch (err) {
  //     handleError(err);
  //   }

  //   if (isError) {
  //     return toast.error("Failed to create new asset");
  //   }
  // };

  return (
    <form className={cn(sharedStyles.form)} onSubmit={handleSubmit(submit)}>
      <div className={cn(sharedStyles.formParent)}>
        <FormRowSelect
          name="business_unit"
          // label="Business Unit"
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
          // label="Area"
          placeholder="Select Area"
          register={register}
          options={categoryOptions}
          onChange={([value]) => setCategory(value)}
          required
        />
        <FormRowSelect
          // label="Equipment"
          name="equipment"
          options={itemOptions}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FormRowInput
          // label="Asset ID"
          type="text"
          name="assetID"
          placeholder="Asset ID e.g. MX001"
          register={register}
          error={errors.assetID}
        />
        <FormRowSelect
          // label="Location"
          name="location"
          options={sortedLocations}
          placeholder="Select Location"
          register={register}
          error={errors.location}
          className="capitalize"
        />
        <FormRowSelect
          // label="Condition"
          name="condition"
          options={condition}
          placeholder="Select Condition"
          register={register}
          error={errors.condition}
        />
        <FormRowInput
          // label="Serial Number"
          type="text"
          name="serialNumber"
          placeholder="Serial Number"
          register={register}
          error={errors.serialNumber}
        />
        <Activity mode="visible">
          <FileInput control={control} name="images" multiple={true} />
        </Activity>
        <TextAreaInput
          // label="Comments"
          name="additional_notes"
          placeholder="Comments"
          register={register}
          className="md:col-span-2"
          rows={3}
        />
      </div>
      <FormActionButtons
        cancelText="Cancel"
        onCancel={() => {
          navigate("/assets/list");
        }}
        submitText="Submit"
        isPending={isPending}
      />
    </form>
  );
};

export default CreateAssetForm;
