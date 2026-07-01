//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import schemas
import type {
  AssetRequestFormValues,
  TransferRequestFormValues,
} from "../../schemas/index";
import { transferRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useTransfersFields } from "../forms/configs/useTransfersFields";
import DynamicForm from "../forms/DynamicForm";
import { useGetAll } from "@/utils/api";

const CreateTransferForm = () => {
  const navigate = useNavigate();
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // $ Hook handling the data send to the backend
  const { submit, isPending } = useFormSubmit({
    resourcePath: "api/transfers",
    queryKey: ["transfers", "create-transfer"],
    buildPayload: (values, compressed) => ({
      ...values,
      images: compressed.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
    }),
    onSuccess: (values) => {
      setSuccessConfig({
        title: "Success",
        message: `The transfer request for asset with ID ${values.assetID} was successfully created.`,
        redirectPath: "transfers/list",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Tranfer Request Failed",
        message: "Could not create the transfer request. Please try again.",
        redirectPath: "transfers/list",
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

  // $ Form Instance passed to the Dynamic Form
  const form = useForm<TransferRequestFormValues>({
    resolver: zodResolver(
      transferRequestSchema,
    ) as unknown as Resolver<TransferRequestFormValues>,
    defaultValues: {
      area: "",
      equipment: "",
      assetID: "",
      locationFrom: "",
      locationTo: "",
      expectedTransferDate: "",
      transferReason: "",
    },
  });

  // $ Hook creating the fields to be displayed by the Dynamic Form
  const { fields } = useTransfersFields(form, assetsArray);

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<TransferRequestFormValues>
      form={form}
      fields={fields}
      formHeading="Transfers - Create New"
      redirect={true}
      redirectTo="/transfers/list"
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      onCancel={() => navigate("/transfers/list")}
      className=""
      gridClassName="gap-6"
      isLoading={isLoading}
    />
  );
};

export default CreateTransferForm;
