import { type TransferReceiptRequestValues } from "@/schemas";
import { type DynamicFormField } from "../DynamicForm";
import { useWatch, type UseFormReturn } from "react-hook-form";

// $ ——— Hook ─────────────────────────────────────────────────────
export const useTransfersReceiptFields = (
  form: UseFormReturn<TransferReceiptRequestValues>,
) => {
  // $ ─── Watch Dependent Values ─────────────────────────────────;

  const selectedCondition = useWatch({
    control: form.control,
    name: "condition",
  });
  // $ ─── Helpers ──────────────────────────────────────
  /**
   * Safely converts any option shape to plain string values.
   * Returns [] if the source array is undefined/null so that
   * FormRowSelect never receives undefined and tries to .map() it.
   */
  const normalizeOptions = (
    options:
      | Array<string>
      | Array<{ label: string; value: string }>
      | undefined
      | null,
  ): string[] => {
    if (!options) return []; // ✅ guard against undefined/null from async data
    return options.map((option) =>
      typeof option === "string" ? option : option.value,
    );
  };

  const conditionOptions = [
    "",
    "excellent",
    "good",
    "fair",
    "damaged",
    "other",
  ];

  // $ ─── Field Config ─────────────────────────────────
  const fields: DynamicFormField<TransferReceiptRequestValues>[] = [
    {
      fieldType: "input",
      type: "datetime-local",
      name: "receiptDate",
      label: "Date Received",
      placeholder: "Date Received",
      required: true,
    },
    {
      fieldType: "select",
      name: "condition",
      label: "Asset Condition",
      options: normalizeOptions(conditionOptions),
      required: true,
    },
    ...(selectedCondition === "damaged"
      ? [
          {
            fieldType: "input",
            name: "damageDetails",
            label: "Damage Details",
            required: true,
          } satisfies DynamicFormField<TransferReceiptRequestValues>,
        ]
      : []),
    {
      fieldType: "textarea",
      name: "receiptNotes",
      label: "Notes",
      rows: 1,
      className: "col-span-full",
    },
    {
      fieldType: "file",
      name: "images",
      multiple: true,
      label: "Upload Images",
      className: "col-span-full",
    },
    {
      fieldType: "file",
      name: "images",
      multiple: true,
      label: "Delivery Note",
      className: "col-span-full",
    },
  ];

  return {
    fields,
  };
};
