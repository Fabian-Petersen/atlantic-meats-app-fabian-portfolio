//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { PasswordToggleInput } from "@/components/PasswordToggleInput";

// $ React-Hook-Form, zod & schema
import { assetSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormRowInput from "../customComponents/FormRowInput";
import FormRowSelect from "../customComponents/FormRowSelect";

// $ Import schemas
import type { AssetFormValues, CreateAssetPayload } from "../../schemas/index";

// $ Import API interaction Functions
import {
  useCreateNewAsset,
  // useCreateNewItem,
} from "@/utils/maintenanceRequests";

//$ Import Select Options Data
import { condition, equipment, location } from "@/data/assetSelectOptions";
import FileInput from "../customComponents/FileInput";
import { toast } from "sonner";

// const { userAttributes, setUserAttributes } = useGlobalContext();

const CreateAssetForm = () => {
  const { mutateAsync } = useCreateNewAsset();
  const navigate = useNavigate();

  // const { mutateAsync } = useCreateMaintenanceRequest();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      description: "",
      equipment: "",
      assetID: "",
      condition: "",
      location: "",
      //   warranty: "",
      serialNumber: "",
      manufacturer: "",
      model: "",
      images: [],
    },
    resolver: zodResolver(assetSchema),
  });

  // $ sort the in  locations in alphabetical order
  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b));

  const onSubmit = async (data: AssetFormValues) => {
    try {
      // 1. Build API payload (metadata only)
      const payload: CreateAssetPayload = {
        ...data,
        images: data.images.map((file) => ({
          filename: file.name,
          content_type: file.type,
          // console.log("content_type from frontend:",file.type)
        })),
      };

      // 2. Create maintenance request (DynamoDB + presigned URLs)
      const response = await mutateAsync(payload);

      const { presigned_urls } = response;

      // 3. Upload files directly to S3
      await Promise.all(
        presigned_urls.map((item: any) => {
          const file = data.images.find((f) => f.name === item.filename);

          if (!file) return Promise.resolve();

          return fetch(item.url, {
            method: "PUT",
            headers: {
              "Content-Type": item.content_type,
            },
            body: file,
          });
        })
      );
      toast.success("New Asset Successfully Created!", {
        duration: 1000,
      });
      // navigate("/assets");
    } catch (err) {
      console.error("Failed to create new asset", err);
    }
  };

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-(--clr-font) dark:bg-[#1d2739]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full lg:py-6">
        <FormRowInput
          label="Description"
          type="text"
          name="description"
          control={control}
          placeholder="Asset Description"
          register={register}
          error={errors.description}
        />
        <FormRowInput
          label="Asset ID"
          type="text"
          name="assetID"
          control={control}
          placeholder="Asset ID e.g. MX001"
          register={register}
          error={errors.assetID}
        />
        <FormRowSelect
          label="Equipment Type"
          name="equipment"
          options={equipment}
          control={control}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FormRowSelect
          // label="Store"
          name="location"
          options={sortedLocations}
          control={control}
          placeholder="Select Location"
          register={register}
          error={errors.location}
          className="capitalize"
        />
        <FormRowSelect
          label="Condition"
          name="condition"
          options={condition}
          control={control}
          placeholder="Select Condition"
          register={register}
          error={errors.condition}
        />
        <FormRowInput
          label="Equipment Serial Number"
          type="text"
          name="serialNumber"
          control={control}
          placeholder="Serial Number"
          register={register}
          error={errors.serialNumber}
        />
        {/* <FormRowSelect
          label="Warranty"
          name="warranty"
          options={warranty}
          control={control}
          placeholder="Warranty Valid"
          register={register}
          error={errors.warranty}
        /> */}
        {/* <FormRowInput
          label="Warranty Expiry Date"
          name="warranty_expire"
          control={control}
          type="date"
          placeholder="Warranty Expiry Date"
          register={register}
          error={errors.warranty_expire}
        /> */}
        <FormRowInput
          label="Manufacturer"
          type="text"
          name="manufacturer"
          control={control}
          placeholder="Manufacturer"
          register={register}
          error={errors.manufacturer}
        />
        {/* <FormRowInput
          label="Date of Manufacture"
          type="date"
          name="date_of_manufacture"
          control={control}
          placeholder="Date of Manufacture"
          register={register}
          error={errors.date_of_manufacture}
        /> */}
        <FormRowInput
          label="Model"
          type="text"
          name="model"
          control={control}
          placeholder="Model"
          register={register}
          error={errors.model}
        />
        <FileInput
          label="Supporting Documents"
          control={control}
          name="images"
          multiple={true}
          // error={errors.images}
        />
      </div>
      <div className="flex gap-2 w-full justify-end">
        <Button
          type="button"
          onClick={() => {
            navigate("/asset");
          }}
          variant="cancel"
          size="lg"
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="submit"
          size="lg"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CreateAssetForm;
