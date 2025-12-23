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
import stores from "@/data/stores";
import assets from "@/data/assets.json";

// const { userAttributes, setUserAttributes } = useGlobalContext();

const CreateJobForm = () => {
  //   const navigate = useNavigate();

  // $ Form Schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
  });

  const onSubmit = (data: CreateJobFormValues) => {
    console.log("form submitted");
    console.log(data);
  };

  return (
    <form
      className="flex flex-col gap-8 rounded-lg max-w-xl text-gray-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col mt-auto gap-8">
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
          label="Store"
          name="store"
          options={stores}
          control={control}
          placeholder="Select a Store"
          register={register}
          error={errors.store}
        />
        <FormRowSelect
          label="Equipment"
          name="equipment"
          options={assets.assets.map((a) => ({
            label: a.equipment,
            value: a.id,
          }))}
          control={control}
          placeholder="Select Asset"
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
        <Button
          className="bg-(--clr-primary) text-white leading-2 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6"
          type="submit"
          //   disabled={loading}
        >
          {/* {loading ? "Signing in..." : "Sign In"} */}
          Create Job
        </Button>
      </div>
    </form>
  );
};

export default CreateJobForm;
