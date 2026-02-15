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
});

// % Schema expected from the backend
export const actionResponseSchema = actionRequestSchema.extend({
  id: z.string(),
  action_createdAt: z.string(),
  request_id: z.string(),
  action_id: z.string().optional(),
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

export type ActionRequestFormValues = z.infer<typeof actionRequestSchema>;
export type ActionAPIResponse = z.infer<typeof actionResponseSchema>;
