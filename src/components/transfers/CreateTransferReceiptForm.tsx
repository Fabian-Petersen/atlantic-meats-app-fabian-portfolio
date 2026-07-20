/**
 * This component is used to complete the transfer of an asset once the asset is reveived at the destination, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.
 *
 *
 */

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import schemas
import type { TransferReceiptRequestValues } from "../../schemas/index";
import { transferReceiptRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import DynamicForm from "../forms/DynamicForm";
import { useTransfersReceiptFields } from "../forms/configs/useTransfersReceiptFields";

const CreateTransferForm = () => {
  const navigate = useNavigate();

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
  const { submit, isPending } = useFormSubmit({
    id: selectedRowId ?? "",
    resourcePath: "api/transfers",
    queryKey: ["transfers", "receipt-transfer"],
    action: "receipt",
    buildPayload: (values, compressed) => ({
      status: "receipt",
      ...values,
      images: compressed.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
      deliveryNote: compressed.map((f) => ({
        filename: f.name,
        content_type: f.type,
      })),
    }),
    onSuccess: (values) => {
      setSuccessConfig({
        title: "Success",
        message: `The asset with ID ${values.assetID} was successfully received at destination ${values.locationTo}.`,
        redirectPath: "transfers/in-transit",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Asset Transit Receipt Failed",
        message:
          "Could not create the asset receipt request. Please try again.",
        redirectPath: "transfers/in-transit",
      });
      setShowError(true);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                              React Hook Form                               */
  /* -------------------------------------------------------------------------- */
  // $ Form Instance passed to the Dynamic Form
  const form = useForm<TransferReceiptRequestValues>({
    resolver: zodResolver(
      transferReceiptRequestSchema,
    ) as unknown as Resolver<TransferReceiptRequestValues>,
    // defaultValues: {
    //   transportType: "courier",
    //   transportName: "mixer",
    //   transportCost: 0,
    //   transportDate: "2026-07-10",
    //   transitImages: [],
    //   transportInvoice: [],
    // },
  });

  /* -------------------------------------------------------------------------- */
  /*                              Form Fields Hook                              */
  /* -------------------------------------------------------------------------- */
  // $ Hook creating the fields to be displayed by the Dynamic Form
  const { fields } = useTransfersReceiptFields(form);

  /* -------------------------------------------------------------------------- */
  /*                              Render Dynamic Form                           */
  /* -------------------------------------------------------------------------- */
  return (
    <DynamicForm<TransferReceiptRequestValues>
      form={form}
      fields={fields}
      formHeading="Transfers - Receipt"
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
