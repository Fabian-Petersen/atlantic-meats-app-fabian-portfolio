//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// $ React-Hook-Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control, type Resolver } from "react-hook-form";

// $ Import image compression hook
import { compressImagesToWebp } from "@/utils/compressImagesToWebp";

// $ Zod Schema and Types
import type {
  CreateJobFormValues,
  CreateJobPayload,
  PresignedUrlResponse,
} from "../../schemas/index";
import { createJobSchema } from "../../schemas/index";

import FormRowSelect from "../../../customComponents/FormRowSelect";

// $ Data for select options
import { priority, type, impact } from "@/data/maintenanceRequestFormData";
import { stores } from "@/data/stores";

// import assets from "@/data/assets.json";
// import { useCreateMaintenanceRequest } from "@/utils/api";
import FileInput from "../../../customComponents/FileInput";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import { toast } from "sonner";
import { useCreateMaintenanceRequest } from "@/utils/api";
import useGlobalContext from "@/context/useGlobalContext";

const MaintenanceRequestForm = () => {
  const { mutateAsync, isError } = useCreateMaintenanceRequest();
  const { setHasError } = useGlobalContext();

  const navigate = useNavigate();

  // $ Form Schema
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    defaultValues: {
      equipment: "",
      store: "",
      type: "",
      impact: "",
      priority: "",
      additional_notes: "",
      images: [],
    },
    resolver: zodResolver(
      createJobSchema,
    ) as unknown as Resolver<CreateJobFormValues>,
  });

  const onSubmit = async (data: CreateJobFormValues) => {
    console.log("Submitting maintenance request:", data);
    try {
      // $ 1️⃣ Compress images in browser
      const originalFiles = data.images ?? [];
      const compressedFiles = await compressImagesToWebp(originalFiles);

      // $ 2️⃣ Build API payload (metadata only)
      const payload: CreateJobPayload = {
        ...data,
        images: compressedFiles.map((file) => ({
          filename: file.name,
          content_type: file.type,
        })),
      };

      // $ 2. Create maintenance request (DynamoDB + presigned URLs)
      const response = await mutateAsync(payload);
      const { presigned_urls } = response;

      // $ 3. Upload files directly to S3
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
      toast.success("Maintenance request created successfully!", {
        duration: 1000,
      });
      // navigate("/maintenance-list");
    } catch (err) {
      console.error("Failed to create maintenance request", err);
    }
  };

  useEffect(() => {
    if (isError) {
      setHasError(true);
    }
  }, [isError, setHasError]);

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-[#1d2739]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full lg:py-6">
        <FormRowSelect
          label="Equipment"
          name="equipment"
          options={["test equipment"]}
          // options={assets.categories.retail.system.security.map((a) => ({
          //   label: a.equipment,
          //   value: a.equipment,
          // }))}
          // control={control}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FormRowSelect
          label="Store"
          name="store"
          options={stores}
          // control={control}
          placeholder="Select Store"
          register={register}
          error={errors.store}
          className="capitalize"
        />
        <FormRowSelect
          label="Request Type"
          name="type"
          options={type}
          // control={control}
          placeholder="Select type"
          register={register}
          error={errors.type}
        />
        <FormRowSelect
          label="Impact"
          name="impact"
          options={impact}
          // control={control}
          placeholder="Select Impact"
          register={register}
          error={errors.impact}
        />
        <FormRowSelect
          label="Priority"
          name="priority"
          options={priority}
          // control={control}
          placeholder="Select Priority"
          register={register}
          error={errors.priority}
        />

        <FileInput
          label=""
          control={control as unknown as Control<CreateJobFormValues>}
          name="images"
          multiple={true}
        />
        <TextAreaInput
          name="additional_notes"
          register={register}
          // control={control}
          rows={4}
          label="Additional Notes"
          className="lg:col-span-2"
        />
      </div>
      <div className="flex w-full">
        <div className="flex lg:w-1/2 ml-auto gap-2 max-w-72">
          <Button
            type="button"
            onClick={() => {
              navigate("/maintenance-list");
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

export default MaintenanceRequestForm;
