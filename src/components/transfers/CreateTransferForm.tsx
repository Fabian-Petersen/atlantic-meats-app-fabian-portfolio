//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import schemas
import type { TransferRequestFormValues } from "../../schemas/index";
import { transferRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useTransfersFields } from "../forms/configs/useTransfersFields";
import DynamicForm from "../forms/DynamicForm";

const CreateTransferForm = () => {
  const navigate = useNavigate();
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // $ Hook handling the data send to the backend
  const { submit, isPending } = useFormSubmit({
    resourcePath: "api/transfers/requests",
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
        redirectPath: "transfers/requests",
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
      expectedDate: "",
      transferReason: "",
    },
  });

  // $ Hook creating the fields to be displayed by the Dynamic Form
  const { fields } = useTransfersFields(form);

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<TransferRequestFormValues>
      form={form}
      fields={fields}
      formHeading="Create Transfer"
      redirect={true}
      redirectTo="/transfers/requests"
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      onCancel={() => navigate("/transfers/requests")}
      className=""
      gridClassName="gap-6"
    />
  );
};

export default CreateTransferForm;
