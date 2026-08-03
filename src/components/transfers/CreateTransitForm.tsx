//$ This component is used to create a asset in-transit, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import schemas
import type {
  // AssetRequestFormValues,
  TransferInTransitRequestValues,
} from "../../schemas/index";
import { transferRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import DynamicForm from "../forms/DynamicForm";
// import { useGetAll } from "@/utils/api";
import { useTransfersTransitFields } from "../forms/configs/useTransfersTransitFields";

const CreateTransitForm = () => {
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

  // $ Form Instance passed to the Dynamic Form
  const form = useForm<TransferInTransitRequestValues>({
    resolver: zodResolver(
      transferRequestSchema,
    ) as unknown as Resolver<TransferInTransitRequestValues>,
    defaultValues: {
      transportType: "",
      transportName: "",
      trackingNumber: "",
      transportCost: 0,
      transportNotes: "",
      images: [],
      transportInvoices: [],
    },
  });

  // $ Hook creating the fields to be displayed by the Dynamic Form
  const { fields } = useTransfersTransitFields(form);

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<TransferInTransitRequestValues>
      form={form}
      fields={fields}
      formHeading="Transfers - Ship Asset"
      redirect={true}
      redirectTo="/transfers/list"
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      onCancel={() => navigate("/transfers/list")}
      className=""
      gridClassName="gap-6"
      // isLoading={isLoading}
    />
  );
};

export default CreateTransitForm;
