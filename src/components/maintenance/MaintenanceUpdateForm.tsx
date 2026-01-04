//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

// $ React-Hook-Form, zod & schema
import { createJobSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormRowInput from "../customComponents/FormRowInput";
import FormRowSelect from "../customComponents/FormRowSelect";
import { useGlobalContext } from "@/useGlobalContext";
import { Button } from "../ui/button";

// $ Import schemas
import type { CreateJobFormValues } from "../../schemas/index";

import {
  stores,
  priority,
  type,
  impact,
} from "@/data/maintenanceRequestFormData";

import assets from "@/data/assets.json";
// import { useCreateMaintenanceRequest } from "@/utils/maintenanceRequests";

const MaintenanceUpdateForm = () => {
  // const { mutateAsync } = useCreateMaintenanceRequest();
  const { data: initialData, setShowUpdateDialog } = useGlobalContext();
  //   const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    defaultValues: initialData,
    resolver: zodResolver(createJobSchema),
  });

  const onSubmit = async (initialData: CreateJobFormValues) => {
    try {
      const payload = {
        ...initialData,
      };

      console.log("Submit Update Form:", payload);
      setTimeout(() => setShowUpdateDialog(false), 2000);
      // const response = await mutateAsync(payload);
      // console.log("created request:", response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-[#1d2739]"
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
          name="store"
          options={stores}
          control={control}
          placeholder="Select store"
          register={register}
          error={errors.store}
          className="capitalize"
        />
        <FormRowSelect
          name="type"
          options={type}
          control={control}
          placeholder="Select type"
          register={register}
          error={errors.type}
        />
        <FormRowSelect
          name="impact"
          options={impact}
          control={control}
          placeholder="Select Impact"
          register={register}
          error={errors.impact}
        />
        <FormRowSelect
          name="priority"
          options={priority}
          control={control}
          placeholder="Select Priority"
          register={register}
          error={errors.priority}
        />
        <FormRowSelect
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
      <div className="flex gap-2 w-full justify-end">
        <Button onClick={() => setShowUpdateDialog(false)} variant={"cancel"}>
          Cancel
        </Button>
        <Button disabled={isSubmitting} type="submit" variant={"submit"}>
          Update
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceUpdateForm;
