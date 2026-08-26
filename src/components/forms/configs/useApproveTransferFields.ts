import { type TransferRequestFormValues } from "@/schemas";
import { type UseFormReturn } from "react-hook-form";

import type { DynamicFormField } from "../DynamicForm";

import { useAssetFilters } from "@/customHooks/useAssetFilters";

// $ ————————————————————————————————————————————————————————————————
// $ Helpers
// $ ————————————————————————————————————————————————————————————————

const normalizeOptions = (
  options:
    | Array<string>
    | Array<{ label: string; value: string }>
    | undefined
    | null,
): string[] => {
  if (!options) return [];

  return options.map((option) =>
    typeof option === "string" ? option : option.value,
  );
};

// $ ————————————————————————————————————————————————————————————————
// $ Hook
// $ ————————————————————————————————————————————————————————————————

export const useApproveTransferFields = (
  form: UseFormReturn<TransferRequestFormValues>,
) => {
  const { locationOptions, isPending, isError } = useAssetFilters({
    form,
    locationField: "locationFrom",
  });

  const locationSelectOptions = normalizeOptions(locationOptions);

  const fields: DynamicFormField<TransferRequestFormValues>[] = [
    {
      fieldType: "textarea",
      name: "transferReason",
      required: true,
      rows: 1,
      className: "md:col-span-2",
      label: "Reason for transfer",
    },
    {
      fieldType: "select",
      name: "locationFrom",
      label: "Location From",
      placeholder: "Select Location From",
      options: locationSelectOptions,
      required: true,
    },
    {
      fieldType: "select",
      name: "locationTo",
      label: "Location To",
      placeholder: "Select Location To",
      options: locationSelectOptions,
      required: true,
    },
  ];

  return {
    fields,
    isPending,
    isError,
  };
};

// import { type TransferRequestFormValues } from "@/schemas";
// import { type UseFormReturn } from "react-hook-form";

// import type { DynamicFormField } from "../DynamicForm";

// import { useAssetFilters } from "@/customHooks/useAssetFilters";

// // $ ————————————————————————————————————————————————————————————————
// // $ Helpers
// // $ ————————————————————————————————————————————————————————————————

// /**
//  * Converts the option format returned by useAssetFilters into the
//  * string[] format expected by DynamicForm select fields.
//  */
// const normalizeOptions = (
//   options:
//     | Array<string>
//     | Array<{ label: string; value: string }>
//     | undefined
//     | null,
// ): string[] => {
//   if (!options) return [];
//   return options.map((option) =>
//     typeof option === "string" ? option : option.value,
//   );
// };

// // $ ————————————————————————————————————————————————————————————————
// // $ Hook
// // $ ————————————————————————————————————————————————————————————————

// /**
//  * Field configuration for the Approve Transfer form.
//  *
//  * Migrated off the old locally-filtering asset hook (which took a
//  * full `assetsArray` and filtered it client-side) onto the
//  * backend-driven `useAssetFilters`. Reset-on-cascade logic now lives
//  * entirely inside `useAssetFilters` — this hook no longer calls
//  * `useAssetFilterReset` itself.
//  */
// export const useApproveTransferFields = (
//   form: UseFormReturn<TransferRequestFormValues>,
// ) => {
//   // $ ─── Backend Asset Options ─────────────────────────────────────
//   const {
//     equipmentOptions,
//     assetIdOptions,
//     locationOptions,
//     areaOptions,

//     isPending,
//     isError,
//   } = useAssetFilters({
//     form,
//     locationField: "locationFrom",
//   });

//   // $ ─── Asset Select Options ──────────────────────────────────────
//   const locationSelectOptions = normalizeOptions(locationOptions);
//   const areaSelectOptions = normalizeOptions(areaOptions);
//   const equipmentSelectOptions = normalizeOptions(equipmentOptions);
//   const assetIdSelectOptions = normalizeOptions(assetIdOptions);

//   // $ ─── Field Config ─────────────────────────────────
//   const fields: DynamicFormField<TransferRequestFormValues>[] = [
//     {
//       fieldType: "textarea",
//       name: "transferReason",
//       required: true,
//       rows: 1,
//       className: "md:col-span-2",
//       label: "Reason for transfer",
//     },
//     {
//       fieldType: "select",
//       name: "locationFrom",
//       label: "Location From",
//       placeholder: "Select Location From",
//       options: locationSelectOptions,
//       required: true,
//     },
//     {
//       fieldType: "select",
//       name: "locationTo",
//       label: "Location To",
//       placeholder: "Select Location To",
//       options: locationSelectOptions,
//       required: true,
//     },
//     {
//       fieldType: "select",
//       name: "area",
//       label: "Area",
//       placeholder: "Select Area",
//       options: areaSelectOptions,
//       disabled: !form.watch("locationFrom"),
//       required: true,
//     },
//     {
//       fieldType: "select",
//       name: "equipment",
//       label: "Equipment",
//       placeholder: "Select Equipment",
//       options: equipmentSelectOptions,
//       disabled: !form.watch("locationFrom") || !form.watch("area"),
//       required: true,
//     },
//     {
//       fieldType: "select",
//       name: "assetID",
//       label: "Asset ID",
//       placeholder: "Select Asset ID",
//       options: assetIdSelectOptions,
//       disabled:
//         !form.watch("locationFrom") ||
//         !form.watch("area") ||
//         !form.watch("equipment"),
//     },
//     {
//       fieldType: "file",
//       name: "images",
//       multiple: true,
//       label: "Upload Images",
//     },
//   ];

//   return {
//     fields,
//     isPending,
//     isError,
//   };
// };
