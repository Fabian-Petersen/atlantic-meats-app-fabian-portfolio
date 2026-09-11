import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";

import useGlobalContext from "@/context/useGlobalContext";
import { useAssetFilters } from "@/customHooks/useAssetFilters";
import { impact, priority, type } from "@/data/maintenanceRequestFormData";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import {
  createJobRequestSchema,
  type CreateJobRequestFormValues,
  type CreateJobRequestPayload,
} from "@/schemas/jobSchemas";
import DynamicForm, {
  DynamicFormActions,
  type DynamicFormField,
} from "../forms/DynamicForm";
import FormInfo from "../features/forms/FormInfo";
import JobAssetFields from "./JobAssetFields";
import { AddAssetButton } from "../forms/AddAssetButton";

const normalizeOptions = (
  options:
    | Array<string>
    | Array<{ label: string; value: string }>
    | undefined
    | null,
): string[] =>
  options?.map((option) =>
    typeof option === "string" ? option : option.value,
  ) ?? [];

const CreateJobForm = () => {
  const navigate = useNavigate();
  const [openAssetIndex, setOpenAssetIndex] = useState(0);
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  const form = useForm<CreateJobRequestFormValues>({
    resolver: zodResolver(
      createJobRequestSchema,
    ) as unknown as Resolver<CreateJobRequestFormValues>,
    defaultValues: {
      description: "",
      location: "",
      type: "",
      impact: "",
      priority: "",
      breakdown_time: "",
      assets: [
        {
          area: "",
          equipment: "",
          assetID: "",
          assetIssueReason: "",
          assetIssueDetails: "",
          images: [],
        },
      ],
    },
  });

  const location = useWatch({ control: form.control, name: "location" });
  const {
    fields: assetFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "assets",
  });
  const { locationOptions } = useAssetFilters({
    form,
    locationField: "location",
    assetIndex: 0,
  });

  const requestFields: DynamicFormField<CreateJobRequestFormValues>[] = [
    {
      fieldType: "textarea",
      name: "description",
      label: "Enter a job description",
      rows: 1,
      className: "md:col-span-2",
      required: true,
    },
    {
      fieldType: "select",
      name: "location",
      label: "Location",
      placeholder: "Select Location",
      options: normalizeOptions(locationOptions),
      required: true,
    },
    {
      fieldType: "input",
      type: "datetime-local",
      name: "breakdown_time",
      label: "Breakdown Time",
      required: true,
      placeholder: "",
    },
    {
      fieldType: "select",
      name: "type",
      label: "Type",
      placeholder: "Select Type",
      options: normalizeOptions(type),
      required: true,
    },
    {
      fieldType: "select",
      name: "impact",
      label: "Impact",
      placeholder: "Select Impact",
      options: normalizeOptions(impact),
      required: true,
    },
    {
      fieldType: "select",
      name: "priority",
      label: "Priority",
      placeholder: "Select Priority",
      options: normalizeOptions(priority),
      required: true,
    },
  ];

  const { submit, isPending } = useFormSubmit<
    CreateJobRequestFormValues,
    CreateJobRequestPayload
  >({
    resourcePath: "api/jobs/requests",
    queryKey: ["jobs"],
    buildPayload: (values, compressedFiles) => {
      let cursor = 0;
      const assets = values.assets.map((asset) => {
        const imageCount = asset.images?.length ?? 0;
        const assetImages = compressedFiles.slice(cursor, cursor + imageCount);
        cursor += imageCount;

        return {
          ...asset,
          assetIssueReason: asset.assetIssueReason ?? "",
          assetIssueDetails: asset.assetIssueDetails ?? "",
          images: assetImages.map((file) => ({
            filename: file.name,
            content_type: file.type,
          })),
        };
      });

      return { ...values, assets };
    },
    onSuccess: () => {
      setSuccessConfig({
        title: "Job Created",
        message: "The job request was successfully created.",
        redirectPath: "jobs/pending-approval",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Job Request Creation Failed",
        message:
          "Could not create the job request. Please check with your admin.",
        redirectPath: "dashboard",
      });
      setShowError(true);
    },
  });

  return (
    <div className="space-y-8">
      <DynamicForm<CreateJobRequestFormValues>
        form={form}
        formId="job-request-form"
        fields={requestFields}
        formHeading="Create Job Request"
        redirect={true}
        redirectTo="/dashboard"
        onSubmit={submit}
        isPending={isPending}
        onCancel={() => navigate("/dashboard")}
        gridClassName="gap-6"
        renderActions={false}
      />

      <div className={location ? "space-y-2" : "space-y-3"}>
        {location ? (
          <div className="flex items-center justify-end px-0">
            <AddAssetButton
              onClick={() =>
                append({
                  area: "",
                  equipment: "",
                  assetID: "",
                  assetIssueReason: "",
                  assetIssueDetails: "",
                  images: [],
                })
              }
            />
          </div>
        ) : (
          <FormInfo
            message={
              <>
                Select a <strong>Location</strong> before selecting assets.
              </>
            }
          />
        )}

        <div className="space-y-6">
          {assetFields.map((field, index) => (
            <JobAssetFields
              key={field.id}
              form={form}
              assetIndex={index}
              isOpen={openAssetIndex === index}
              onToggle={() =>
                setOpenAssetIndex((current) => (current === index ? -1 : index))
              }
              canRemove={assetFields.length > 1}
              onRemove={() => {
                remove(index);
                setOpenAssetIndex((current) => {
                  if (current === index) return Math.max(0, index - 1);
                  if (current > index) return current - 1;
                  return current;
                });
              }}
            />
          ))}
        </div>
      </div>

      <DynamicFormActions
        formId="job-request-form"
        submitText="Submit"
        cancelText="Cancel"
        onCancel={() => navigate("/dashboard")}
        isPending={isPending}
      />
    </div>
  );
};

export default CreateJobForm;
