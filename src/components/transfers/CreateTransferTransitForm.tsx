//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import schemas
import type {
  TransferInTransitRequestValues,
  TransferInTransitRequestPayload,
  TransferWorkflowResponse,
} from "../../schemas/index";
import { transferInTransitRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useTransfersTransitFields } from "../forms/configs/useTransfersTransitFields";
import DynamicForm from "../forms/DynamicForm";

type Props = {
  data?: TransferWorkflowResponse;
};

const CreateTransferForm = ({ data }: Props) => {
  const navigate = useNavigate();
  // console.log("transferItem:", data);
  /* -------------------------------------------------------------------------- */
  /*                              Global Context                                */
  /* -------------------------------------------------------------------------- */
  const {
    setSuccessConfig,
    selectedRowId,
    setShowSuccess,
    setErrorConfig,
    setShowError,
  } = useGlobalContext();

  /* -------------------------------------------------------------------------- */
  /*                              POST: Data                                    */
  /* -------------------------------------------------------------------------- */

  // $ Hook handling the data send to the backend
  const { submit, isPending } = useFormSubmit<
    TransferInTransitRequestValues,
    TransferInTransitRequestPayload
  >({
    id: selectedRowId ?? "",
    resourcePath: "api/transfers",
    queryKey: ["transfers", "create-transfer"],
    action: "in-transit",

    buildPayload: (values, compressedFiles, invoices) => ({
      status: "in-transit",
      ...values,
      images: compressedFiles.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
      transportInvoices: invoices.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
    }),
    onSuccess: () => {
      setSuccessConfig({
        title: "Success",
        message: `The assets with starting ID ${data?.assets[0]?.assetID} transit request successfully placed.`,
        redirectPath: "transfers/in-transit",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Transit Request Failed",
        message:
          "Could not create the asset transit request. Please try again.",
        redirectPath: "transfers/in-transit",
      });
      setShowError(true);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                              React Hook Form                               */
  /* -------------------------------------------------------------------------- */
  // $ Form Instance passed to the Dynamic Form
  const form = useForm<TransferInTransitRequestValues>({
    resolver: zodResolver(
      transferInTransitRequestSchema,
    ) as unknown as Resolver<TransferInTransitRequestValues>,
    defaultValues: {
      transportType: "",
      transportName: "",
      trackingNumber: "",
      transportDate: "",
      transportNotes: "",
      transportCost: 0,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                              Form Fields Hook                              */
  /* -------------------------------------------------------------------------- */
  // $ Hook creating the fields to be displayed by the Dynamic Form
  const { fields } = useTransfersTransitFields(form);

  /* -------------------------------------------------------------------------- */
  /*                              Render Dynamic Form                           */
  /* -------------------------------------------------------------------------- */
  return (
    <DynamicForm<TransferInTransitRequestValues>
      form={form}
      fields={fields}
      formHeading="Create Transit"
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
