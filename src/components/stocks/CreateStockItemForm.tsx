// CreateStockItemForm.tsx
// Uses DynamicForm to create a new stock item.
// Demonstrates cascading selects by updating the config array in state.

import { useNavigate } from "react-router-dom";
import DynamicForm from "../forms/DynamicForm";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import { useStockFields } from "../forms/configs/useStockFields";
import {
  type StockRequestFormValues,
  stockRequestSchema,
} from "@/schemas/index";
// import { useForm, type Resolver } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// $ ─── Component ────────────────────────────────────────────────────────────────

const CreateStockItemForm = () => {
  const navigate = useNavigate();
  // $ Global context for showing success/error messages
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // $ Get dynamic field configurations from the custom hook
  const { fields } = useStockFields();

  // Hook into shared submit logic (mirrors CreateAssetForm pattern)
  const { submit, isPending } = useFormSubmit({
    resourcePath: "stocks/create-new-stock",
    queryKey: ["stock", "create-stock-item"],
    buildPayload: (values) => ({ ...values }),
    onSuccess: (values) => {
      setSuccessConfig({
        title: "Success",
        message: `Stock item "${values.stockCode}" was successfully created.`,
        redirectPath: "stocks/list",
      });
      setShowSuccess(true);
    },
    onError: () => {
      setErrorConfig({
        title: "Stock Item Creation Failed",
        message: "Could not create the stock item. Please try again.",
        redirectPath: "stocks/list",
      });
      setShowError(true);
    },
  });

  // const form = useForm<StockRequestFormValues>({
  //   resolver: zodResolver(
  //     stockRequestSchema,
  //   ) as unknown as Resolver<StockRequestFormValues>,
  // });

  // $  ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <DynamicForm<StockRequestFormValues>
      schema={stockRequestSchema}
      fields={fields}
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      // control={form.control}
      // register={form.register}
      // errors={form.formState.errors}
      // handleSubmit={form.handleSubmit}
      onCancel={() => navigate("/stock/list")}
      className=""
      gridClassName="gap-6"
    />
  );
};

export default CreateStockItemForm;
