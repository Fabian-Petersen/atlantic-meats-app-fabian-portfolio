//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// $ React-Hook-Form
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type Control,
  type Resolver,
  useWatch,
} from "react-hook-form";

// $ Import image compression hook
import { compressImagesToWebpv1 } from "@/utils/compressImagesToWebpv1";

// $ Zod Schema and Types
import type {
  JobRequestFormValues,
  CreateJobPayload,
  PresignedUrlResponse,
  AssetRequestFormValues,
} from "../../schemas/index";

import { jobRequestSchema } from "../../schemas/index";

import FormRowSelect from "../../../customComponents/FormRowSelect";

// $ Data for select options
import { priority, type, impact } from "@/data/maintenanceRequestFormData";

import FileInput from "../../../customComponents/FileInput";
import TextAreaInput from "../../../customComponents/TextAreaInput";
import { toast } from "sonner";

// $ Import api & custom hooks
import { usePOST } from "@/utils/api";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { useGetAll } from "@/utils/api";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";

const CreateJobForm = () => {
  // $ Calling the usePOST hook to fetch the data
  const { mutateAsync, isError, isPending } = usePOST<
    CreateJobPayload,
    { presigned_urls: PresignedUrlResponse }
  >({
    resourcePath: "jobs/requests",
    queryKey: ["jobs", "create-job"],
  });

  const { data } = useGetAll<AssetRequestFormValues[]>({
    resourcePath: "assets-data",
    queryKey: ["assets", "create-job-form"],
  });

  // data looks like { assets: Array(107) }
  const assetsArray: AssetRequestFormValues[] = Array.isArray(data) ? data : [];
  // $ Custom hook that manages the select input options based on asset data

  const navigate = useNavigate();

  // $ Form Schema
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm<JobRequestFormValues>({
    // defaultValues: {
    //   location: "Maitland",
    //   type: "corrective",
    //   priority: "High",
    //   equipment: "band saw",
    //   impact: "production",
    //   jobComments: "Testing request comments - band saw not switching on",
    //   description: "Testing workflow 20260331",
    //   area: "processing room",
    //   assetID: "RT-0015",
    //   images: [],
    // },
    resolver: zodResolver(
      jobRequestSchema,
    ) as unknown as Resolver<JobRequestFormValues>,
  });

  const selectedLocation = useWatch({
    control,
    name: "location",
  });

  const selectedArea = useWatch({
    control,
    name: "area",
  });

  const selectedEquipment = useWatch({
    control,
    name: "equipment",
  });

  const selectedAssetID = useWatch({
    control,
    name: "assetID",
  });

  // console.log(assetsArray);
  const { equipmentOptions, assetIdOptions, locationOptions, areaOptions } =
    useAssetFilters({
      assets: assetsArray,
      location: selectedLocation,
      equipment: selectedEquipment,
      assetID: selectedAssetID,
      area: selectedArea,
      setValue,
    });

  const onSubmit = async (data: JobRequestFormValues) => {
    try {
      // $ 1️⃣ Compress images in browser
      const originalFiles = data.images ?? [];
      const compressedFiles = await compressImagesToWebpv1(originalFiles);

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
        duration: 1500,
      });
      navigate("/jobs/pending-approval");
    } catch (err) {
      console.error("Failed to create maintenance request", err);
      toast.error(
        "Failed to create maintenance request. Please try again later.",
        {
          duration: 1500,
        },
      );
    }

    if (isError) {
      return toast.error("Failed to load assets. Please refresh the page.");
    }
  };

  return (
    <form className={cn(sharedStyles.form)} onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(sharedStyles.formParent)}>
        <TextAreaInput
          name="description"
          register={register}
          placeholder="Enter a job description"
          // control={control}
          rows={1}
          // label="Description"
          className="lg:col-span-2"
          error={errors.description}
        />
        <FormRowSelect
          // label="Location"
          name="location"
          options={locationOptions}
          placeholder="Select Location"
          register={register}
          error={errors.location}
          className="capitalize"
        />
        <FormRowSelect
          // label="Area"
          name="area"
          options={areaOptions}
          placeholder="Select Area"
          register={register}
          error={errors.area}
        />
        <FormRowSelect
          // label="Equipment"
          name="equipment"
          options={equipmentOptions}
          // control={control}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FormRowSelect
          // label="Asset ID"
          name="assetID"
          options={assetIdOptions}
          placeholder="Select Asset ID"
          register={register}
          error={errors.assetID}
        />
        <FormRowSelect
          // label="Request Type"
          name="type"
          options={type}
          // control={control}
          placeholder="Select type"
          register={register}
          error={errors.type}
        />
        <FormRowSelect
          // label="Impact"
          name="impact"
          options={impact}
          // control={control}
          placeholder="Select Impact"
          register={register}
          error={errors.impact}
        />
        <FormRowSelect
          // label="Priority"
          name="priority"
          options={priority}
          // control={control}
          placeholder="Select Priority"
          register={register}
          error={errors.priority}
        />
        <FileInput
          label=""
          control={control as unknown as Control<JobRequestFormValues>}
          name="images"
          multiple={true}
        />
        <TextAreaInput
          name="jobComments"
          register={register}
          placeholder="Comments"
          // control={control}
          rows={4}
          // label="Comments"
          className="lg:col-span-2"
        />
      </div>
      <div className={cn(sharedStyles.btnParent)}>
        <Button
          type="button"
          onClick={() => {
            navigate("/dashboard");
          }}
          variant="cancel"
          size="lg"
          className={cn(sharedStyles.btnCancel, sharedStyles.btn)}
        >
          Cancel
        </Button>
        <Button
          disabled={isPending}
          type="submit"
          variant="submit"
          size="lg"
          className={cn(sharedStyles.btnSubmit, sharedStyles.btn)}
        >
          {isPending ? <Spinner className="size-8" /> : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default CreateJobForm;
