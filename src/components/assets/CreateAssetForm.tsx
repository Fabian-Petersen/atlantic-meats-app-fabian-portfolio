//$ This component is used to create a maintenace job, the data is submitted to the database (dynamoDB) via API Gateway and Lambda on aws.

import { useNavigate } from "react-router-dom";

// $ React-Hook-Form, zod & schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

// $ Import schemas
import type { AssetRequestFormValues } from "../../schemas/index";
import { assetRequestSchema } from "../../schemas/index";

import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useAssetsFields } from "../forms/configs/useAssetsFields";
import DynamicForm from "../forms/DynamicForm";

const CreateAssetForm = () => {
  const navigate = useNavigate();
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // $ Hook handling the data send to the backend
  const { submit, isPending } = useFormSubmit({
    resourcePath: "api/assets",
    queryKey: ["assets", "create-asset"],
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
        message: `The asset with ID ${values.assetID} request was successfully created.`,
        redirectPath: "assets/list",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Asset Creation Failed",
        message: "Could not create the asset. Please try again.",
        redirectPath: "assets/list",
      });
      setShowError(true);
    },
  });

  // $ Form Instance passed to the Dynamic Form
  const form = useForm<AssetRequestFormValues>({
    resolver: zodResolver(
      assetRequestSchema,
    ) as unknown as Resolver<AssetRequestFormValues>,
    defaultValues: {
      business_unit: "",
      area: "",
      equipment: "",
      serialNumber: "",
      location: "",
      condition: "",
      images: [],
      assetID: "",
    },
  });

  // $ Hook creating the fields to be displayed by the Dynamic Form
  const { fields } = useAssetsFields();

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<AssetRequestFormValues>
      form={form}
      fields={fields}
      formHeading="Assets - Create New"
      redirect={true}
      redirectTo="/assets/list"
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      onCancel={() => navigate("/assets/list")}
      className=""
      gridClassName="gap-6"
    />
  );
};

export default CreateAssetForm;
