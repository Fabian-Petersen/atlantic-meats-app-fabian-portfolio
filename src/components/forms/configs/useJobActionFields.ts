// import { type ActionRequestFormValues } from "@/schemas";
// import { ROOT_CAUSES, status } from "@/data/maintenanceAction";

// import type { DynamicFormField, ControllerField } from "../DynamicForm";
// import DigitalSignature from "../../jobs/DigitalSignature";

// // $ ——— Hook ─────────────────────────────────────────────────────
// export const useJobActionFields = () => {
//   // $ Use cascading (dependent) select inputs driven directly from the data structure.

//   const normalizeOptions = (
//     options:
//       | Array<string>
//       | Array<{ label: string; value: string }>
//       | undefined
//       | null,
//   ): string[] => {
//     if (!options) return []; // ✅ guard against undefined/null from async data
//     return options.map((option) =>
//       typeof option === "string" ? option : option.value,
//     );
//   };

//   // $ ─── Field Config ─────────────────────────────────
//   const fields: DynamicFormField<ActionRequestFormValues>[] = [
//     {
//       fieldType: "input",
//       name: "start_time",
//       label: "Start Date/Time",
//       placeholder: "Start Time",
//       type: "datetime-local",
//       required: true,
//     },
//     {
//       fieldType: "input",
//       name: "end_time",
//       label: "End Date/Time",
//       placeholder: "End Time",
//       required: true,
//       type: "datetime-local",
//     },
//     {
//       fieldType: "input",
//       name: "total_km",
//       label: "Total Km's",
//       placeholder: "Total Kms",
//       required: true,
//     },
//     {
//       fieldType: "select",
//       name: "root_cause",
//       label: "Root Cause",
//       options: normalizeOptions(ROOT_CAUSES),
//       required: true,
//     },
//     {
//       fieldType: "select",
//       name: "status",
//       label: "Job Status",
//       placeholder: "Job Status",
//       options: normalizeOptions(status),
//     },
//     {
//       fieldType: "textarea",
//       name: "work_completed",
//       label: "Work Completed",
//       rows: 1,
//       required: true,
//     },
//     {
//       fieldType: "textarea",
//       name: "findings",
//       label: "findings",
//       rows: 1,
//     },
//     {
//       fieldType: "file",
//       name: "images",
//       multiple: true,
//       label: "Upload Images",
//     },
//     {
//       fieldType: "input",
//       name: "signedBy",
//       label: "signed by",
//     },
//      {
//     fieldType: "controller",
//     name: "signature",
//     label: "Signature",
//     render: ({ field, fieldState }) => (
//       <DigitalSignature
//         value={field.value}
//         onSave={field.onChange}
//         onClear={() => field.onChange("")}
//         className="mb-6"
//       />
//     ),
//   } satisfies ControllerField<ActionRequestFormValues>,
//   ];

//   return {
//     fields,
//   };
// };
