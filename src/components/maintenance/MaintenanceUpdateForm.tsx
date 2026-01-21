//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

// $ React-Hook-Form, zod & schema
import { createJobSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// $ Form Components
import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import FileInput from "../../../customComponents/FileInput";
import { Button } from "../ui/button";

import useGlobalContext from "@/context/useGlobalContext";

// $ Import schemas
import type { CreateJobFormValues } from "../../schemas/index";

import { priority, type, impact } from "@/data/maintenanceRequestFormData";
import { stores } from "@/data/stores";

// import assets from "@/data/assets.json";
// import { useCreateMaintenanceRequest } from "@/utils/maintenanceRequests";

const MaintenanceUpdateForm = () => {
  // const { mutateAsync } = useCreateMaintenanceRequest();
  const { genericData: initialData, setShowUpdateMaintenanceDialog } =
    useGlobalContext();
  //   const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData as CreateJobFormValues,
    resolver: zodResolver(createJobSchema),
  });

  const onSubmit = async (data: CreateJobFormValues) => {
    try {
      const base64Images = await Promise.all(
        (data.images || []).map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }),
        ),
      );

      const payload = { ...data, images: base64Images };
      console.log("Submit Update Form:", payload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-[#1d2739] gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full lg:py-6">
        <FormRowInput
          label="Additional Notes"
          type="text"
          name="additional_notes"
          // control={control}
          placeholder="Enter additional notes"
          register={register}
          error={errors.additional_notes}
        />
        <FormRowSelect
          name="store"
          label="Store"
          options={stores}
          // control={control}
          placeholder="Select Store"
          register={register}
          error={errors.store}
          className="capitalize"
        />
        <FormRowSelect
          name="type"
          label="Type"
          options={type}
          // control={control}
          placeholder="Select Type"
          register={register}
          error={errors.type}
        />
        <FormRowSelect
          name="impact"
          label="Impact"
          options={impact}
          // control={control}
          placeholder="Select Impact"
          register={register}
          error={errors.impact}
        />
        <FormRowSelect
          name="priority"
          label="Priority"
          options={priority}
          // control={control}
          placeholder="Select Priority"
          register={register}
          error={errors.priority}
        />
        <FormRowSelect
          name="equipment"
          label="Equipment"
          options={[]}
          // options={assets.assets.map((a) => ({
          //   label: a.equipment,
          //   value: a.equipment,
          // }))}
          // control={control}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FileInput control={control} name="images" multiple={true} />
      </div>
      <div className="flex gap-2 w-full justify-end">
        <Button
          onClick={() => setShowUpdateMaintenanceDialog(false)}
          variant={"cancel"}
        >
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
