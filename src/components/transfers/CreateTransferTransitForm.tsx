//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import schemas
import type { TransferInTransitRequestValues } from "../../schemas/index";
import { transferInTransitRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useTransfersTransitFields } from "../forms/configs/useTransfersTransitFields";
import DynamicForm from "../forms/DynamicForm";

const CreateTransferForm = () => {
  const navigate = useNavigate();
  const {
    setSuccessConfig,
    selectedRowId,
    setShowSuccess,
    setErrorConfig,
    setShowError,
  } = useGlobalContext();

  // $ Hook handling the data send to the backend
  const { submit, isPending } = useFormSubmit({
    id: selectedRowId ?? "",
    resourcePath: "api/transfers/requests",
    queryKey: ["transfers", "create-transfer"],
    // params:{},
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
        message: `The asset with ID ${values.assetID} was successfully placed in transit to ${values.locationTo}.`,
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

  // $ Custom hook that manages the select input options based on asset data

  // $ Form Instance passed to the Dynamic Form
  const form = useForm<TransferInTransitRequestValues>({
    resolver: zodResolver(
      transferInTransitRequestSchema,
    ) as unknown as Resolver<TransferInTransitRequestValues>,
    // defaultValues: {
    //   transportType: "courier",
    //   transportName: "mixer",
    //   transportCost: 0,
    //   transportDate: "2026-07-10",
    //   transitImages: [],
    //   transportInvoice: [],
    // },
  });

  // $ Hook creating the fields to be displayed by the Dynamic Form
  const { fields } = useTransfersTransitFields(form);

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<TransferInTransitRequestValues>
      form={form}
      fields={fields}
      formHeading="Transfers - Create Transit"
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
