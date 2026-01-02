//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { Button } from "@/components/ui/button";
// import { PasswordToggleInput } from "@/components/PasswordToggleInput";

// $ React-Hook-Form, zod & schema
import { assetSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormRowInput from "../customComponents/FormRowInput";
import FormRowSelect from "../customComponents/FormRowSelect";

// $ Import schemas
import type { AssetFormValues } from "../../schemas/index";

export type AssetResponse = {
  id: string;
  createdAt: string;
  description: string;
  assetID: string;
  equipment: string;
  location: string;
  condition: string;
  serialNumber?: string | null;
  manufacturer?: string | null;
  model?: string | null;
};

// $ Import API interaction Functions
import { useCreateNewItem } from "@/utils/maintenanceRequests";

//$ Import Select Options Data
import { condition, equipment, location } from "@/data/assetSelectOptions";

// const { userAttributes, setUserAttributes } = useGlobalContext();

const CreateAssetForm = () => {
  const { mutateAsync, isPending } = useCreateNewItem<
    AssetResponse,
    AssetFormValues
  >({
    queryKey: ["assets"],
    endpoint: "/asset",
    redirect: "/asset",
  });

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssetFormValues>({
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
      //   images: [],
    },
    resolver: zodResolver(assetSchema),
  });

  const sortedLocations = [...location].sort((a, b) => a.localeCompare(b)); // sort the locations in alphabetical order

  const onSubmit = async (data: AssetFormValues) => {
    try {
      const response = await mutateAsync(data);
      console.log("New Asset Data:", response);
      console.log("Form Data:", data);
    } catch (err) {
      console.error(err);
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
      </div>
      <Button
        className="bg-(--clr-primary) text-white leading-1 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6 mt-6 text-lg"
        type="submit"
        // disabled={isSubmitting}
        disabled={isPending}
      >
        {isPending ? "Create New Asset..." : "Submit"}
      </Button>
    </form>
  );
};

export default CreateAssetForm;
