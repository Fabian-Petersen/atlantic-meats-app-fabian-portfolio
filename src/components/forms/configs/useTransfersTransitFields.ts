import { type TransferInTransitRequestValues } from "@/schemas";

import type { DynamicFormField } from "../DynamicForm";
import { useWatch, type UseFormReturn } from "react-hook-form";

// $ ——— Hook ─────────────────────────────────────────────────────
export const useTransfersTransitFields = (
  form: UseFormReturn<TransferInTransitRequestValues>,
) => {
  // $ ─── Watch Dependent Values ─────────────────────────────────
  const selectedTransport = useWatch({
    control: form.control,
    name: "transportType",
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

  const transportOptions = ["", "courier", "employee", "contractor", "other"];

  // $ ─── Field Config ─────────────────────────────────
  const fields: DynamicFormField<TransferInTransitRequestValues>[] = [
    {
      fieldType: "select",
      name: "transportType",
      label: "Transport Type",
      placeholder: "Select Location From",
      options: normalizeOptions(transportOptions),
      required: true,
    },
    ...(selectedTransport === "courier"
      ? [
          {
            fieldType: "input",
            name: "trackingNumber",
            label: "Tracking Number",
            required: true,
          } satisfies DynamicFormField<TransferInTransitRequestValues>,
        ]
      : []),
    {
      fieldType: "input",
      name: "transportName",
      label: "Transport By",
      required: true,
    },
    {
      fieldType: "input",
      type: "number",
      name: "transportCost",
      label: "Transport Cost",
      required: false,
    },
    {
      fieldType: "input",
      type: "datetime-local",
      name: "transportDate",
      label: "Transport Date",
      required: true,
    },
    {
      fieldType: "textarea",
      name: "transportNotes",
      label: "Notes",
      required: false,
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
      name: "invoices",
      multiple: true,
      label: "Upload Invoice",
      className: "col-span-full",
    },
  ];

  return {
    fields,
  };
};
