//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ ——— Types ————————————————————————————————————————————————————————
import type {
  AssetRequestFormValues,
  JobRequestFormValues,
  // AssetRequestFormValues,
} from "../../schemas/index";

// $ ——— RHF & zod ————————————————————————————————————————————————————
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobRequestSchema } from "../../schemas/index";

// $ ——— api & Custom Hooks ———————————————————————————————————————————
// import { useGetAll } from "@/utils/api";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useJobFields } from "../forms/configs/useJobFields";

// $ ——— Dependency Components ————————————————————————————————————————
import DynamicForm from "../forms/DynamicForm";
import { useGetAll } from "@/utils/api";

// $ ——— Component ————————————————————————————————————————————————————
const CreateJobForm = () => {
  const navigate = useNavigate();
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // $ Calling the useFormSubmit hook to post the job data to backend
  const { submit, isPending } = useFormSubmit({
    resourcePath: "jobs/requests",
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

  const { data, isPending: isLoading } = useGetAll<AssetRequestFormValues[]>({
    resourcePath: "assets-data",
    queryKey: ["assets", "create-job-form"],
  });

  // data looks like { assets: Array(107) }
  const assetsArray: AssetRequestFormValues[] = Array.isArray(data) ? data : [];
  // $ Custom hook that manages the select input options based on asset data

  const form = useForm<JobRequestFormValues>({
    resolver: zodResolver(
      jobRequestSchema,
    ) as unknown as Resolver<JobRequestFormValues>,
    defaultValues: {
      description: "",
      location: "",
      area: "",
      equipment: "",
      assetID: "",
      type: "",
      impact: "",
      priority: "",
      jobComments: "",
      breakdown_time: "",
    },
  });

  const { fields } = useJobFields(form, assetsArray);

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<JobRequestFormValues>
      form={form}
      fields={fields}
      formHeading="Jobs - Create Request"
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      onCancel={() => navigate("/dashboard")}
      className=""
      gridClassName="gap-6"
      isLoading={isLoading}
    />
  );
};

export default CreateJobForm;

/* ----------------------------------- Non Dynamic Form ----------------------------------- */
// const navigate = useNavigate();

// // $ Form Schema
// const {
//   handleSubmit,
//   control,
//   register,
//   setValue,
//   formState: { errors },
// } = useForm<JobRequestFormValues>({
//   resolver: zodResolver(
//     jobRequestSchema,
//   ) as unknown as Resolver<JobRequestFormValues>,
// });

// const selectedLocation = useWatch({
//   control,
//   name: "location",
// });

// const selectedArea = useWatch({
//   control,
//   name: "area",
// });

// const selectedEquipment = useWatch({
//   control,
//   name: "equipment",
// });

// const selectedAssetID = useWatch({
//   control,
//   name: "assetID",
// });

// const { equipmentOptions, assetIdOptions, locationOptions, areaOptions } =
//   useAssetFilters({
//     assets: assetsArray,
//     location: selectedLocation,
//     equipment: selectedEquipment,
//     assetID: selectedAssetID,
//     area: selectedArea,
//     setValue,
//   });

// return (
//   <form className={cn(sharedStyles.form)} onSubmit={handleSubmit(submit)}>
//     <div className={cn(sharedStyles.formParent)}>
//       <TextAreaInput
//         name="description"
//         register={register}
//         label="Enter a job description"
//         rows={1}
//         className="lg:col-span-2"
//         error={errors.description}
//       />
//       <FormRowSelect
//         name="location"
//         options={locationOptions}
//         label="Select Location"
//         register={register}
//         error={errors.location}
//         className="capitalize"
//         required={true}
//         placeholder=""
//       />
//       <FormRowSelect
//         // label="Area"
//         name="area"
//         options={areaOptions}
//         label="Select Area"
//         register={register}
//         error={errors.area}
//       />
//       <FormRowSelect
//         // label="Equipment"
//         name="equipment"
//         options={equipmentOptions}
//         // control={control}
//         label="Select Equipment"
//         register={register}
//         error={errors.equipment}
//         required={true}
//       />
//       <FormRowSelect
//         // label="Asset ID"
//         name="assetID"
//         options={assetIdOptions}
//         label="Select Asset ID"
//         register={register}
//         error={errors.assetID}
//       />
//       <FormRowSelect
//         // label="Request Type"
//         name="type"
//         options={type}
//         label="Select Type"
//         register={register}
//         error={errors.type}
//         required={true}
//       />
//       <FormRowSelect
//         // label="Impact"
//         name="impact"
//         options={impact}
//         label="Select Impact"
//         register={register}
//         error={errors.impact}
//         required={true}
//       />
//       <FormRowSelect
//         // label="Priority"
//         name="priority"
//         options={priority}
//         label="Select Priority"
//         register={register}
//         error={errors.priority}
//         required={true}
//       />
//       <FileInput
//         label=""
//         control={control as unknown as Control<JobRequestFormValues>}
//         name="images"
//         multiple={true}
//       />
//       <TextAreaInput
//         name="jobComments"
//         register={register}
//         label="Comments"
//         rows={4}
//         // label="Comments"
//         className="lg:col-span-2"
//       />
//     </div>
//     <FormActionButtons
//       cancelText="Cancel"
//       onCancel={() => {
//         navigate("/dashboard");
//       }}
//       submitText="Submit"
//       isPending={isPending}
//     />
//   </form>
// );
