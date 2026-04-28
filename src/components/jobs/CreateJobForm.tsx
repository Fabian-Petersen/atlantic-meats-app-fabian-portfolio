//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type Control,
  type Resolver,
  useWatch,
} from "react-hook-form";

// $ Zod Schema and Types
import type {
  JobRequestFormValues,
  AssetRequestFormValues,
} from "../../schemas/index";

import { jobRequestSchema } from "../../schemas/index";

import FormRowSelect from "../../../customComponents/FormRowSelect";

// $ Data for select options
import { priority, type, impact } from "@/data/maintenanceRequestFormData";

import FileInput from "../../../customComponents/FileInput";
import TextAreaInput from "../../../customComponents/TextAreaInput";

// $ Import api & custom hooks
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { useGetAll } from "@/utils/api";
import { cn } from "@/lib/utils";
import { sharedStyles } from "@/styles/shared";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import FormActionButtons from "../features/FormActionButtons";
import useGlobalContext from "@/context/useGlobalContext";

const CreateJobForm = () => {
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // $ Calling the useFormSubmit hook to post the job data to backend
  const { submit, isPending } = useFormSubmit({
    resourcePath: "jobs/request",
    queryKey: ["jobs"],
    buildPayload: (values, compressed) => ({
      ...values,
      images: compressed.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
    }),
    onSuccess: () => {
      setSuccessConfig({
        title: "Job Created",
        message: `The job request was successfully created.`,
        redirectPath: "jobs/pending-approval",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "User Creation Failed",
        message: "Could not create the job request. Please try again.",
        redirectPath: "jobs/create-job",
      });
      setShowError(true);
    },
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

  const { equipmentOptions, assetIdOptions, locationOptions, areaOptions } =
    useAssetFilters({
      assets: assetsArray,
      location: selectedLocation,
      equipment: selectedEquipment,
      assetID: selectedAssetID,
      area: selectedArea,
      setValue,
    });

  return (
    <form className={cn(sharedStyles.form)} onSubmit={handleSubmit(submit)}>
      <div className={cn(sharedStyles.formParent)}>
        <TextAreaInput
          name="description"
          register={register}
          placeholder="Enter a job description"
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
          placeholder="Select type"
          register={register}
          error={errors.type}
        />
        <FormRowSelect
          // label="Impact"
          name="impact"
          options={impact}
          placeholder="Select Impact"
          register={register}
          error={errors.impact}
        />
        <FormRowSelect
          // label="Priority"
          name="priority"
          options={priority}
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
          rows={4}
          // label="Comments"
          className="lg:col-span-2"
        />
      </div>
      <FormActionButtons
        cancelText="Cancel"
        onCancel={() => {
          navigate("/dashboard");
        }}
        submitText="Submit"
        isPending={isPending}
      />
    </form>
  );
};

export default CreateJobForm;
