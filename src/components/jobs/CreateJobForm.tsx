//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ ——— Types ————————————————————————————————————————————————————————
import type { JobRequestFormValues } from "../../schemas/index";

// $ ——— RHF & zod ————————————————————————————————————————————————————
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobRequestSchema } from "../../schemas/index";

// $ ——— api & Custom Hooks ———————————————————————————————————————————
import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useJobFields } from "../forms/configs/useJobFields";

// $ ——— Dependency Components ————————————————————————————————————————
import DynamicForm from "../forms/DynamicForm";

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
        title: "Job Request Creation Failed",
        message:
          "Could not create the job request. Please check with your admin.",
        redirectPath: "dashboard",
      });
      setShowError(true);
    },
  });

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

  const { fields } = useJobFields(form);

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<JobRequestFormValues>
      form={form}
      fields={fields}
      formHeading="Create Job Request"
      redirect={true}
      redirectTo="/dashboard"
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      onCancel={() => navigate("/dashboard")}
      className=""
      gridClassName="gap-6"
    />
  );
};

export default CreateJobForm;
