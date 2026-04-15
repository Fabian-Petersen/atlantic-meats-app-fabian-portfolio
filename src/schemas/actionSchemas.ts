import * as z from "zod";

//$ import types
import { ROOT_CAUSES } from "@/data/maintenanceAction";

export const actionRequestSchema = z.object({
  start_time: z
    .string()
    .min(1, "Start time required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date/time"),
  end_time: z
    .string()
    .min(1, "End time required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date/time"),
  total_km: z
    .string()
    .min(1, { message: "Total km is required" })
    .refine(
      (val) => {
        const num = Number(val);
        return Number.isFinite(num) && num > 0;
      },
      { message: "Start km must be a greater than zero" },
    ),
  work_order_number: z.string().optional(),
  work_completed: z.string().min(1, { message: "Please enter work completed" }),
  status: z.string().min(1, { message: "" }), // "pending", "in progress", "complete"
  root_cause: z.enum(ROOT_CAUSES, {
    message: "please select a root cause for breakdown",
  }),
  findings: z.string().optional(),
  images: z.array(z.instanceof(File)).default([]).optional(),
  signtuture: z.string().optional(),
  signedBy: z.string().min(1, { message: "Please enter name of signatory" }),
});

// % Schema expected from the backend
export const actionResponseSchema = actionRequestSchema.extend({
  id: z.string(),
  actionCreated: z.string(),
  actioned_by: z.string(),
  request_id: z.string(),
  action_id: z.string().optional(),
  completed_at: z.string().optional(),
  location: z.string(),
  requested_by: z.string(),
  jobcardNumber: z.string(),
  signedBy: z.string(),
});

// $ Type for sending the Action to the backend excluding the images (the images is not included with the initial request). Backend will send a presignURL for the images
export type ActionRequestPayload = Omit<ActionRequestFormValues, "images"> & {
  images: {
    filename: string;
    content_type: string;
  }[];
  signature?: string | null; // base64 PNG
  selectedRowId: string;
  jobCardNumber?: string; // ID of the maintenance request being actioned
};

// $ Schema for the Asset Table Menu
export const actionTableRowSchema = actionResponseSchema
  .omit({
    signtuture: true,
    findings: true,
    images: true,
    root_cause: true,
    work_completed: true,
  })
  .extend({
    id: z.string(),
    actioned_by: z.string(),
    actionCreated: z.string(),
    location: z.string(),
    requested_by: z.string(),
    jobcardNumber: z.string(),
  });

export type ActionTableRow = z.infer<typeof actionTableRowSchema>;
export type ActionRequestFormValues = z.infer<typeof actionRequestSchema>;
export type ActionAPIResponse = z.infer<typeof actionResponseSchema>;
