//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { PasswordToggleInput } from "@/components/PasswordToggleInput";

// $ React-Hook-Form, zod & schema
import { createJobSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormRowInput from "../customComponents/FormRowInput";
import FormRowSelect from "../customComponents/FormRowSelect";
// import { useGlobalContext } from "@/useGlobalContext";

// $ Import schemas
import type { CreateJobFormValues } from "../../schemas/index";

//$ AWS Amplify
import { fetchUserAttributes } from "aws-amplify/auth";

import {
  stores,
  priority,
  type,
  impact,
} from "@/data/maintenanceRequestFormData";

import assets from "@/data/assets.json";
import { useCreateMaintenanceRequest } from "@/utils/maintenanceRequests";

// const { userAttributes, setUserAttributes } = useGlobalContext();

const MaintenanceRequestForm = () => {
  const { mutateAsync } = useCreateMaintenanceRequest();
  //   const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    defaultValues: {
      description: "",
      store: "",
      type: "",
      priority: "",
      equipment: "",
      impact: "",
      // images: [],
    },
    resolver: zodResolver(createJobSchema),
  });

  const onSubmit = async (data: CreateJobFormValues) => {
    try {
      const user = await fetchUserAttributes();
      const payload = {
        ...data,
        userId: user.id,
        userName: user.name,
      };

      const response = await mutateAsync(payload);
      console.log("created request:", response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-(--clr-font)"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full lg:py-6">
        <FormRowInput
          label="Description"
          type="text"
          name="description"
          control={control}
          placeholder="Job Description"
          register={register}
          error={errors.description}
        />
        <FormRowSelect
          // label="Store"
          name="store"
          options={stores}
          control={control}
          placeholder="Select store"
          register={register}
          error={errors.store}
          className="capitalize"
        />
        <FormRowSelect
          // label="Request Type"
          name="type"
          options={type}
          control={control}
          placeholder="Select type"
          register={register}
          error={errors.type}
        />
        <FormRowSelect
          // label="Impact"
          name="impact"
          options={impact}
          control={control}
          placeholder="Select Impact"
          register={register}
          error={errors.impact}
        />
        <FormRowSelect
          // label="Priority"
          name="priority"
          options={priority}
          control={control}
          placeholder="Select Priority"
          register={register}
          error={errors.priority}
        />
        <FormRowSelect
          // label="equipment"
          name="equipment"
          options={assets.assets.map((a) => ({
            label: a.equipment,
            value: a.equipment,
          }))}
          control={control}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        {/* <FormRowInput
          label="Image"
          type="file"
          name="images"
          control={control}
          placeholder="Add Image"
          register={register}
          multiple={true}
          accept="image/*"
        /> */}
      </div>
      <Button
        className="bg-(--clr-primary) text-white leading-1 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6 mt-6 text-lg"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Request..." : "Submit"}
      </Button>
    </form>
  );
};

export default MaintenanceRequestForm;
