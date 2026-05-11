// CreateStockItemForm.tsx
// Uses DynamicForm to create a new stock item.
// Demonstrates cascading selects by updating the config array in state.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm, { type DynamicFormField } from "../forms/DynamicForm";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import useGlobalContext from "@/context/useGlobalContext";
import {
  type StockRequestFormValues,
  stockRequestSchema,
} from "@/schemas/index";

// $ ─── Data ─────────────────────────────────────────────────────────────────────
import { CATEGORIES, SUPPLIERS, UNITS } from "@/data/stockFormOptions";

// $ ─── Component ────────────────────────────────────────────────────────────────

const CreateStockItemForm = () => {
  const navigate = useNavigate();
  const { setSuccessConfig, setShowSuccess, setErrorConfig, setShowError } =
    useGlobalContext();

  // Cascading select state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const subCategoryOptions = selectedCategory
    ? (CATEGORIES[selectedCategory] ?? [])
    : [];

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

  // ─── Field config ───────────────────────────────────────────────────────────
  // Rebuild whenever cascading state changes so subCategory options stay fresh.

  const fields: DynamicFormField<StockRequestFormValues>[] = [
    {
      fieldType: "input",
      name: "description",
      label: "Description",
      required: true,
    },
    {
      fieldType: "select",
      label: "Unit Measure",
      name: "unit",
      // placeholder: "",
      options: UNITS,
      required: true,
    },
    {
      fieldType: "select",
      label: "Category",
      name: "category",
      // placeholder: "",
      options: Object.keys(CATEGORIES),
      required: true,
      onChange: ([value]) => {
        setSelectedCategory(value ?? null);
      },
    },
    {
      fieldType: "select",
      name: "subCategory",
      label: "Sub Category",
      placeholder: "",
      options: subCategoryOptions,
      required: true,
    },
    {
      fieldType: "input",
      name: "minQty",
      label: "Minimum Quantity",
      type: "number",
      required: true,
    },
    {
      fieldType: "input",
      name: "reorderQty",
      type: "number",
      label: "Reorder Quantity",
    },
    {
      fieldType: "file",
      name: "images",
      label: "Upload images",
      multiple: true,
    },
    {
      fieldType: "select",
      name: "supplier",
      label: "Supplier",
      options: SUPPLIERS,
    },
    {
      fieldType: "input",
      type: "text",
      name: "costPerUnit",
      label: "Cost per Unit",
    },
    {
      fieldType: "textarea",
      name: "notes",
      label: "Notes",
      rows: 3,
      className: "md:col-span-2", // span full width on desktop
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <DynamicForm<StockRequestFormValues>
      schema={stockRequestSchema}
      fields={fields}
      onSubmit={submit}
      isPending={isPending}
      submitText="Submit"
      cancelText="Cancel"
      onCancel={() => navigate("/stock/list")}
      // Optional per-form styling overrides
      className=""
      gridClassName="gap-6"
    />
  );
};

export default CreateStockItemForm;
