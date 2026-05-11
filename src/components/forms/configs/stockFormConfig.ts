import type { FormFieldConfig } from "../types";
import type { StockRequestFormValues } from "@/schemas";

const categories = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "bearing", label: "Bearing" },
  { value: "sundry", label: "Sundry" },
];

export const stockFields: FormFieldConfig<StockRequestFormValues>[] = [
  {
    fieldType: "input",
    type: "text",
    name: "stockCode",
    placeholder: "Stock Code",
  },
  {
    fieldType: "input",
    type: "text",
    name: "stockType",
    placeholder: "Stock Type",
  },
  {
    fieldType: "input",
    type: "text",
    name: "description",
    placeholder: "Description",
  },

  {
    fieldType: "select",
    name: "category",
    placeholder: "Select Category",
    options: categories,
    onChange: (value) => {
      console.log("Selected category:", value);
    },
  },
  {
    fieldType: "input",
    type: "text",
    name: "minQty",
    placeholder: "Minimum Quantity",
  },
  {
    fieldType: "input",
    type: "text",
    name: "reorderQty",
    placeholder: "Reorder Quantity",
  },
  {
    fieldType: "input",
    type: "text",
    name: "quantity",
    placeholder: "Quantity",
  },
  {
    fieldType: "file",
    name: "images",
    placeholder: "Upload Images",
    multiple: true,
  },
  {
    fieldType: "input",
    type: "text",
    name: "supplier",
    placeholder: "Supplier (optional)",
  },
  {
    fieldType: "input",
    type: "text",
    name: "costPerUnit",
    placeholder: "Cost (optional)",
  },
  { fieldType: "textarea", name: "notes", rows: 3, className: "md:col-span-2" },
];
