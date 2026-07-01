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
    resourcePath: "api/jobs/requests",
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
    resourcePath: "api/assets",
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
      redirect={true}
      redirectTo="/dashboard"
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
