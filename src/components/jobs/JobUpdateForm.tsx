//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

// $ React-Hook-Form, zod & schema
import { jobRequestSchema } from "../../schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

// $ Form Components
import FormRowInput from "../../../customComponents/FormRowInput";
import FormRowSelect from "../../../customComponents/FormRowSelect";
import FileInput from "../../../customComponents/FileInput";
import FormActionButtons from "../features/FormActionButtons";
import FormSkeleton from "../forms/FormSkeleton";

import useGlobalContext from "@/context/useGlobalContext";

// $ Import schemas
import type { JobAPIResponse, JobRequestFormValues } from "../../schemas/index";
import type { AssetEquipmentResponse } from "@/schemas/assetSchemas";

import { priority, type, impact } from "@/data/maintenanceRequestFormData";
import { stores } from "@/data/stores";
import { useById, useGetAll } from "@/utils/api";

// import assets from "@/data/assets.json";
// import { useCreateMaintenanceRequest } from "@/utils/maintenanceRequests";

const JobUpdateForm = () => {
  // const { mutateAsync } = useCreateMaintenanceRequest();
  const { selectedRowId, setShowUpdateMaintenanceDialog } = useGlobalContext();
  //   const navigate = useNavigate();

  const { data: item, isPending } = useById<JobAPIResponse>({
    id: selectedRowId ?? "",
    resourcePath: "api/jobs",
    queryKey: ["jobs", "pending-approval-job"],
    params: {
      status: "pending",
    },
  });

  // $ Form Schema
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobRequestFormValues>({
    defaultValues: {
      location: "",
      type: "",
      priority: "",
      equipment: "",
      breakdown_time: "",
      impact: "",
      jobComments: "",
      description: "",
      area: "",
      assetID: "",
      assetIssueReason: "",
      assetIssueDetails: "",
      images: [],
    },
    resolver: zodResolver(
      jobRequestSchema,
    ) as unknown as Resolver<JobRequestFormValues>,
  });

  useEffect(() => {
    if (!item) return;

    reset({
      location: item.location,
      type: item.type,
      priority: item.priority,
      equipment: item.equipment,
      breakdown_time: item.breakdown_time,
      impact: item.impact,
      jobComments: item.jobComments ?? "",
      description: item.description,
      area: item.area ?? "",
      assetID: item.assetID ?? "",
      assetIssueReason: item.assetIssueReason ?? "",
      assetIssueDetails: item.assetIssueDetails ?? "",
      images: [],
    });
  }, [item, reset]);

  const selectedLocation = useWatch({ control, name: "location" });
  const selectedArea = useWatch({ control, name: "area" });
  const selectedEquipment = useWatch({ control, name: "equipment" });
  const selectedType = useWatch({ control, name: "type" });
  const selectedImpact = useWatch({ control, name: "impact" });
  const selectedPriority = useWatch({ control, name: "priority" });

  const { data: equipmentData } = useGetAll<AssetEquipmentResponse>({
    resourcePath: "api/assets/options",
    queryKey: [
      "assets",
      "options",
      "edit-job-equipment",
      selectedLocation,
      selectedArea,
    ],
    params: {
      location: selectedLocation,
      area: selectedArea,
    },
    enabled: !!selectedLocation && !!selectedArea,
  });

  const equipmentOptions = Array.from(
    new Set(
      [
        selectedEquipment,
        ...(equipmentData?.equipment.map((equipment) => equipment.name) ?? []),
      ].filter((equipment): equipment is string => !!equipment),
    ),
  );

  const includeSelectedOption = (options: string[], selected: string) =>
    selected && !options.includes(selected) ? [selected, ...options] : options;

  const onSubmit = async (data: JobRequestFormValues) => {
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

  if (!selectedRowId || isPending || !item) {
    return <FormSkeleton />;
  }

  return (
    <form
      className="flex flex-col rounded-lg lg:w-full text-font dark:bg-(--bg-secondary_dark) gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full lg:py-6">
        <FormRowInput
          label="Additional Notes"
          type="text"
          name="jobComments"
          // control={control}
          placeholder="Enter additional notes"
          register={register}
          error={errors.jobComments}
          control={control}
        />
        <FormRowSelect
          name="location"
          label="Location"
          options={includeSelectedOption(stores, selectedLocation)}
          // control={control}
          placeholder="Select Store"
          register={register}
          error={errors.location}
          className="capitalize"
        />
        <FormRowSelect
          name="type"
          label="Type"
          options={includeSelectedOption(type, selectedType)}
          // control={control}
          placeholder="Select Type"
          register={register}
          error={errors.type}
        />
        <FormRowSelect
          name="impact"
          label="Impact"
          options={includeSelectedOption(impact, selectedImpact)}
          // control={control}
          placeholder="Select Impact"
          register={register}
          error={errors.impact}
        />
        <FormRowSelect
          name="priority"
          label="Priority"
          options={includeSelectedOption(priority, selectedPriority)}
          // control={control}
          placeholder="Select Priority"
          register={register}
          error={errors.priority}
        />
        <FormRowSelect
          name="equipment"
          label="Equipment"
          options={equipmentOptions}
          // control={control}
          placeholder="Select Equipment"
          register={register}
          error={errors.equipment}
        />
        <FileInput control={control} name="images" multiple={true} />
      </div>
      <FormActionButtons
        cancelText="Cancel"
        submitText="Update"
        isPending={isSubmitting}
        onCancel={() => setShowUpdateMaintenanceDialog(false)}
        className="border-0"
      />
    </form>
  );
};

export default JobUpdateForm;
